import { Factory } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../components/button';
import { Inputs } from '../components/inputs';
import { SideBar } from '../components/sidebar';
import api from '../services/api';

function formatarQuantidade(valor) {
    const quantidade = Number(valor);
    if (!Number.isFinite(quantidade)) return '—';

    return quantidade.toLocaleString('pt-BR', { maximumFractionDigits: 10 });
}

function converterNecessidadeParaEstoque(quantidade, unidadeReceita, unidadeEstoque) {
    if (unidadeReceita?.id_unidade === unidadeEstoque?.id_unidade) {
        return { quantidade };
    }

    const fatorReceita = Number(unidadeReceita?.fator_conversao);
    const fatorEstoque = Number(unidadeEstoque?.fator_conversao);

    if (
        !unidadeReceita?.dimensao_conversao ||
        unidadeReceita.dimensao_conversao !== unidadeEstoque?.dimensao_conversao ||
        !Number.isFinite(fatorReceita) ||
        fatorReceita <= 0 ||
        !Number.isFinite(fatorEstoque) ||
        fatorEstoque <= 0
    ) {
        return { erro: 'Unidades incompatíveis ou sem fatores de conversão cadastrados.' };
    }

    const convertida = (quantidade * fatorReceita) / fatorEstoque;
    return { quantidade: Math.ceil(convertida * 1e10) / 1e10 };
}

function Producao() {
    const [produtos, setProdutos] = useState([]);
    const [producoes, setProducoes] = useState([]);
    const [idProduto, setIdProduto] = useState('');
    const [quantidade, setQuantidade] = useState('1');
    const [carregando, setCarregando] = useState(true);
    const [processando, setProcessando] = useState(false);
    const chaveIdempotencia = useRef(null);

    const buscarDados = useCallback(async () => {
        const [respostaProdutos, respostaHistorico] = await Promise.all([
            api.get('/produto/list_produtos'),
            api.get('/producao/historico'),
        ]);

        return {
            produtos: respostaProdutos.data.produtos ?? [],
            producoes: respostaHistorico.data.producoes ?? [],
        };
    }, []);

    const carregarDados = useCallback(async () => {
        try {
            const dados = await buscarDados();
            setProdutos(dados.produtos);
            setProducoes(dados.producoes);
        } catch (error) {
            toast.error(error.response?.data?.MSG || 'Erro ao carregar dados de produção.');
        } finally {
            setCarregando(false);
        }
    }, [buscarDados]);

    useEffect(() => {
        let cancelado = false;

        buscarDados()
            .then((dados) => {
                if (cancelado) return;
                setProdutos(dados.produtos);
                setProducoes(dados.producoes);
            })
            .catch((error) => {
                if (!cancelado) {
                    toast.error(
                        error.response?.data?.MSG || 'Erro ao carregar dados de produção.',
                    );
                }
            })
            .finally(() => {
                if (!cancelado) setCarregando(false);
            });

        return () => {
            cancelado = true;
        };
    }, [buscarDados]);

    const produtosDeProducao = useMemo(
        () =>
            produtos.filter(
                (produto) =>
                    produto.tipo_produto?.flag_tipo === 'P' && produto.receita_producao,
            ),
        [produtos],
    );

    const produtoSelecionado = produtosDeProducao.find(
        (produto) => produto.id_produto === Number(idProduto),
    );
    const receita = produtoSelecionado?.receita_producao;
    const quantidadeAlvo = Number(quantidade);
    const rendimentoReceita = Number(receita?.quantidade_produzida);
    const margemPerda = Number(receita?.margem_perda);
    const erroConfiguracaoReceita =
        receita &&
        (!Number.isFinite(rendimentoReceita) ||
            rendimentoReceita <= 0 ||
            !Number.isFinite(margemPerda) ||
            margemPerda < 0 ||
            margemPerda > 100 ||
            receita.produtos?.length === 0)
            ? 'A receita precisa ter rendimento maior que zero, margem entre 0 e 100% e ao menos um ingrediente.'
            : '';

    const necessidades = useMemo(() => {
        if (
            !receita ||
            !Number.isFinite(quantidadeAlvo) ||
            quantidadeAlvo <= 0 ||
            !Number.isFinite(rendimentoReceita) ||
            rendimentoReceita <= 0 ||
            !Number.isFinite(margemPerda) ||
            margemPerda < 0 ||
            margemPerda > 100
        ) {
            return [];
        }

        return (receita.produtos ?? []).map((item) => {
            const quantidadeReceita = Number(item.quantidade);
            if (!Number.isFinite(quantidadeReceita) || quantidadeReceita < 0) {
                return {
                    id: item.id_produto,
                    descricao: item.produto?.descricao ?? 'Ingrediente',
                    unidadeReceita: item.unidade_medida?.nomenclatura ?? '',
                    unidadeEstoque: item.produto?.unidade_medida?.nomenclatura ?? '',
                    disponivel: Number(item.produto?.estoque?.quantidade ?? 0),
                    erro: 'A quantidade cadastrada na receita é inválida.',
                    insuficiente: false,
                };
            }

            const necessidadeNaUnidadeReceita =
                quantidadeReceita *
                (quantidadeAlvo / rendimentoReceita) *
                (1 + margemPerda / 100);
            const conversao = converterNecessidadeParaEstoque(
                necessidadeNaUnidadeReceita,
                item.unidade_medida,
                item.produto?.unidade_medida,
            );
            const disponivel = Number(item.produto?.estoque?.quantidade ?? 0);

            return {
                id: item.id_produto,
                descricao: item.produto?.descricao ?? 'Ingrediente',
                unidadeReceita: item.unidade_medida?.nomenclatura ?? '',
                unidadeEstoque: item.produto?.unidade_medida?.nomenclatura ?? '',
                disponivel,
                necessario: conversao.quantidade,
                erro: conversao.erro,
                insuficiente:
                    !conversao.erro && disponivel < conversao.quantidade,
            };
        });
    }, [receita, quantidadeAlvo, rendimentoReceita, margemPerda]);

    const confirmarProducao = async (event) => {
        event.preventDefault();

        if (!produtoSelecionado) {
            toast.error('Selecione um produto de produção.');
            return;
        }

        if (!Number.isFinite(quantidadeAlvo) || quantidadeAlvo <= 0) {
            toast.error('Informe uma quantidade maior que zero.');
            return;
        }

        if (erroConfiguracaoReceita) {
            toast.error(erroConfiguracaoReceita);
            return;
        }

        const erroConversao = necessidades.find((item) => item.erro);
        if (erroConversao) {
            toast.error(`${erroConversao.descricao}: ${erroConversao.erro}`);
            return;
        }

        const faltantes = necessidades.filter((item) => item.insuficiente);
        if (faltantes.length > 0) {
            toast.error(
                `Estoque insuficiente: ${faltantes
                    .map(
                        (item) =>
                            `${item.descricao} (disponível ${formatarQuantidade(item.disponivel)} ${item.unidadeEstoque}; necessário ${formatarQuantidade(item.necessario)} ${item.unidadeEstoque})`,
                    )
                    .join('; ')}`,
            );
            return;
        }

        setProcessando(true);
        try {
            if (!chaveIdempotencia.current) {
                try {
                    chaveIdempotencia.current = sessionStorage.getItem(
                        'loguiss:producao:chave-pendente',
                    );
                } catch {
                    chaveIdempotencia.current = null;
                }

                chaveIdempotencia.current ??=
                    globalThis.crypto?.randomUUID?.() ??
                    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

                try {
                    sessionStorage.setItem(
                        'loguiss:producao:chave-pendente',
                        chaveIdempotencia.current,
                    );
                } catch {
                    // A chave permanece em memória se o armazenamento da sessão estiver indisponível.
                }
            }

            const resposta = await api.post('/producao/realizar', {
                id_produto: produtoSelecionado.id_produto,
                quantidade: quantidadeAlvo,
                chave_idempotencia: chaveIdempotencia.current,
            });

            chaveIdempotencia.current = null;
            try {
                sessionStorage.removeItem('loguiss:producao:chave-pendente');
            } catch {
                // A remoção é best-effort; a resposta da produção já foi confirmada pelo servidor.
            }
            toast.success(resposta.data.MSG || 'Produção realizada com sucesso.');
            await carregarDados();
        } catch (error) {
            const dadosErro = error.response?.data;
            const faltas = dadosErro?.faltantes
                ?.map(
                    (item) =>
                        `${item.ingrediente}: disponível ${formatarQuantidade(item.disponivel)}, necessário ${formatarQuantidade(item.necessario)}; falta ${formatarQuantidade(item.faltante)}.`,
                )
                .join(' ');

            toast.error(
                [dadosErro?.MSG || 'Erro ao realizar produção.', faltas]
                    .filter(Boolean)
                    .join(' '),
            );
        } finally {
            setProcessando(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <SideBar />
            <main className="ml-72 min-h-screen space-y-8 p-5">
                <header>
                    <h1 className="flex items-center gap-3 text-3xl font-bold">
                        <Factory aria-hidden="true" />
                        Produção
                    </h1>
                    <p className="mt-2 text-[var(--text-secondary)]">
                        Confira a necessidade de ingredientes e registre a produção do produto
                        final.
                    </p>
                </header>

                <section className="rounded-xl border border-borda bg-superficie p-5">
                    <h2 className="mb-4 text-xl font-bold">Registrar produção</h2>
                    {produtosDeProducao.length === 0 && !carregando ? (
                        <p className="text-texto-suave">
                            Nenhum produto de produção com receita cadastrada foi encontrado.
                        </p>
                    ) : (
                        <form onSubmit={confirmarProducao} className="space-y-5">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Inputs
                                    label="Produto de produção"
                                    type="select"
                                    value={idProduto}
                                    onChange={(event) => setIdProduto(event.target.value)}
                                    options={[
                                        { value: '', label: 'Selecione um produto' },
                                        ...produtosDeProducao.map((produto) => ({
                                            value: String(produto.id_produto),
                                            label: produto.descricao,
                                        })),
                                    ]}
                                    required
                                />
                                <Inputs
                                    label={`Quantidade a produzir${produtoSelecionado?.unidade_medida?.nomenclatura ? ` (${produtoSelecionado.unidade_medida.nomenclatura})` : ''}`}
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={quantidade}
                                    onChange={(event) => setQuantidade(event.target.value)}
                                    required
                                />
                            </div>

                            {produtoSelecionado && (
                                <>
                                    {erroConfiguracaoReceita && (
                                        <p role="alert" className="text-sm text-red-400">
                                            {erroConfiguracaoReceita}
                                        </p>
                                    )}
                                    <div className="rounded-lg border border-borda p-4">
                                        <p className="mb-3 text-sm text-texto-suave">
                                            Receita: {receita.descricao} · rendimento base{' '}
                                            {formatarQuantidade(receita.quantidade_produzida)} ·
                                            margem adicional {formatarQuantidade(margemPerda)}%
                                        </p>
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[700px] text-left text-sm">
                                                <thead className="border-b border-borda text-texto-suave">
                                                    <tr>
                                                        <th className="py-2">Ingrediente</th>
                                                        <th className="py-2">Necessário</th>
                                                        <th className="py-2">Disponível</th>
                                                        <th className="py-2">Situação</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {necessidades.map((item) => (
                                                        <tr
                                                            key={item.id}
                                                            className="border-b border-borda/60 last:border-0"
                                                        >
                                                            <td className="py-3">
                                                                {item.descricao}
                                                                <span className="ml-1 text-texto-suave">
                                                                    ({item.unidadeReceita})
                                                                </span>
                                                            </td>
                                                            <td className="py-3">
                                                                {item.erro
                                                                    ? '—'
                                                                    : `${formatarQuantidade(item.necessario)} ${item.unidadeEstoque}`}
                                                            </td>
                                                            <td className="py-3">
                                                                {formatarQuantidade(item.disponivel)}{' '}
                                                                {item.unidadeEstoque}
                                                            </td>
                                                            <td
                                                                className={`py-3 ${item.erro || item.insuficiente ? 'text-red-400' : 'text-green-400'}`}
                                                            >
                                                                {item.erro
                                                                    ? item.erro
                                                                    : item.insuficiente
                                                                      ? 'Estoque insuficiente'
                                                                      : 'Disponível'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            loading={processando}
                                            disabled={
                                                processando ||
                                                Boolean(erroConfiguracaoReceita) ||
                                                necessidades.length === 0 ||
                                                necessidades.some(
                                                    (item) => item.erro || item.insuficiente,
                                                )
                                            }
                                        >
                                            Confirmar produção
                                        </Button>
                                    </div>
                                </>
                            )}
                        </form>
                    )}
                </section>

                <section className="rounded-xl border border-borda bg-superficie p-5">
                    <h2 className="mb-4 text-xl font-bold">Histórico de produção</h2>
                    {carregando ? (
                        <p className="text-texto-suave">Carregando histórico...</p>
                    ) : producoes.length === 0 ? (
                        <p className="text-texto-suave">Ainda não há produções registradas.</p>
                    ) : (
                        <div className="space-y-4">
                            {producoes.map((producao) => (
                                <article
                                    key={producao.id_producao}
                                    className="rounded-lg border border-borda p-4"
                                >
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <h3 className="font-bold">
                                            {producao.produto.descricao} —{' '}
                                            {formatarQuantidade(producao.quantidade)}{' '}
                                            {producao.produto.unidade_medida?.nomenclatura}
                                        </h3>
                                        <time
                                            dateTime={producao.data_producao}
                                            className="text-sm text-texto-suave"
                                        >
                                            {new Date(producao.data_producao).toLocaleString(
                                                'pt-BR',
                                            )}
                                        </time>
                                    </div>
                                    <p className="mt-1 text-sm text-texto-suave">
                                        Receita: {producao.descricao_receita} · margem{' '}
                                        {formatarQuantidade(producao.margem_perda)}%
                                    </p>
                                    <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                                        {producao.movimentacoes.map((movimentacao) => (
                                            <li key={movimentacao.id_movimentacao}>
                                                {movimentacao.tipo === 'SAIDA'
                                                    ? 'Consumido'
                                                    : 'Produzido'}
                                                : {movimentacao.produto.descricao} —{' '}
                                                {formatarQuantidade(movimentacao.quantidade)}{' '}
                                                {movimentacao.produto.unidade_medida?.nomenclatura}
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Producao;
