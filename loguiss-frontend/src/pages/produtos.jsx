import { Package, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../components/button';
import { EntityCard } from '../components/card';
import { Combobox } from '../components/combobox';
import { Inputs } from '../components/inputs';
import { SideBar } from '../components/sidebar';
import api from '../services/api';
import { formatarMoeda } from '../utils/validacoes';

const produtoInicial = {
    id_produto: null,
    desc: '',
    id_categoria: null,
    categoria: '',
    id_unidade_medida: null,
    unidade: '',
    minimo: '',
    valor: '',
    quantidade_estoque: '0',
    id_fornecedor: null,
    fornecedor: '',
    dt_entrada: '',
    prazo_saida: '',
    dt_validade: '',
    fgTipoProducao: false,
};

const ingredienteInicial = {
    produto: '',
    id_produto: null,
    quantidade: '',
    id_unidade: '',
};

const receitaInicial = {
    nome: '',
    margemPerda: '',
    quantidadePerdida: '',
    quantidadeProduzida: '',
    ingredientes: [ingredienteInicial],
};

const produtoParaForm = (p) => {
    const categoria = p.categorias?.[0]?.categoria;
    const fornecedor = p.fornecedores?.[0]?.fornecedor;

    return {
        ...produtoInicial,
        id_produto: p.id_produto,
        desc: p.descricao ?? '',
        categoria: categoria?.descricao ?? '',
        id_categoria: categoria?.id_categoria ?? null,
        fornecedor: fornecedor?.nome ?? '',
        id_fornecedor: fornecedor?.id_fornecedor ?? null,
        minimo: p.minimo ?? '',
        valor: p.valor ?? '',
        quantidade_estoque: String(p.estoque?.quantidade ?? 0),
        fgTipoProducao: Boolean(p.fgTipoProducao),
        unidade: p.unidade ?? '',
        id_unidade_medida: p.id_unidade_medida ?? null,
        dt_entrada: (p.dt_entrada ?? '').slice(0, 10),
        prazo_saida: (p.prazo_saida ?? '').slice(0, 10),
        dt_validade: (p.dt_validade ?? '').slice(0, 10),
    };
};

const semSelecao = (texto, id) => texto.trim() !== '' && !id;

const lista = (resultado, chave) =>
    resultado.status === 'fulfilled' && Array.isArray(resultado.value.data?.[chave])
        ? resultado.value.data[chave]
        : [];

function Produtos() {
    const [showProductForm, setShowProductForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [unidades, setUnidades] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [newProduct, setNewProduct] = useState(produtoInicial);
    const [newReceita, setNewReceita] = useState(receitaInicial);

    const filteredProducts = products.filter((produto) =>
        (produto.descricao ?? '').toLowerCase().includes(appliedSearch.toLowerCase()),
    );

    useEffect(() => {
        const carregar = async () => {
            const resultados = await Promise.allSettled([
                api.get('/produto/list_produtos'),
                api.get('/fornecedor/list_fornecedor'),
                api.get('/categoria/list_categorias'),
                api.get('/unidade_medida/list_unidade_medida'),
            ]);

            setProducts(lista(resultados[0], 'produtos'));
            setFornecedores(lista(resultados[1], 'fornecedores'));
            setCategorias(lista(resultados[2], 'categorias'));
            setUnidades(lista(resultados[3], 'unidades'));

            if (resultados.some((r) => r.status === 'rejected')) {
                toast.error('Alguns dados não puderam ser carregados.');
            }
        };

        carregar();
    }, []);

    useEffect(() => { //bloqueia o scroll da tela de trás quando um modal estiver aberto
        if (!showProductForm) return;

        const overflowAnterior = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflowAnterior;
        };
    }, [showProductForm]);

    const setCampo = (campo) => (e) =>
        setNewProduct((prev) => ({
            ...prev,
            [campo]: e.target.value,
        }));

    const setCampoReceita = (campo) => (e) =>
        setNewReceita((prev) => ({
            ...prev,
            [campo]: e.target.value,
        }));

    const atualizarIngrediente = (index, campos) =>
        setNewReceita((prev) => ({
            ...prev,
            ingredientes: prev.ingredientes.map((ing, i) =>
                i === index ? { ...ing, ...campos } : ing,
            ),
        }));

    const adicionarIngrediente = () =>
        setNewReceita((prev) => ({
            ...prev,
            ingredientes: [...prev.ingredientes, { ...ingredienteInicial }],
        }));

    const removerIngrediente = (index) =>
        setNewReceita((prev) => ({
            ...prev,
            ingredientes: prev.ingredientes.filter((_, i) => i !== index),
        }));

    const abrirNovo = () => {
        setEditingId(null);
        setNewProduct(produtoInicial);
        setNewReceita(receitaInicial);
        setShowProductForm(true);
    };

    const abrirEdicao = (produto) => {
        setEditingId(produto.id_produto);
        setNewProduct(produtoParaForm(produto));
        setNewReceita(produto.receita ?? receitaInicial);
        setShowProductForm(true);
    };

    const fecharForm = () => {
        setShowProductForm(false);
        setEditingId(null);
        setNewProduct(produtoInicial);
        setNewReceita(receitaInicial);
    };

    const validarSelecoes = () => {
        if (semSelecao(newProduct.categoria, newProduct.id_categoria)) {
            return 'Escolha uma categoria da lista.';
        }

        if (semSelecao(newProduct.unidade, newProduct.id_unidade_medida)) {
            return 'Escolha uma unidade de medida da lista.';
        }

        if (semSelecao(newProduct.fornecedor, newProduct.id_fornecedor)) {
            return 'Escolha um fornecedor da lista.';
        }

        if (newProduct.fgTipoProducao && newReceita.ingredientes.some((i) => !i.id_produto)) {
            return 'Escolha os produtos da receita na lista.';
        }

        return '';
    };

    const salvarProduto = (e) => {
        e.preventDefault();

        const erro = validarSelecoes();

        if (erro) {
            toast.error(erro);
            return;
        }

        toast.error('A integração de cadastro e edição ainda precisa das rotas do backend.');
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
            <SideBar />

            <main className="ml-72 min-h-screen p-5">
                {/* Cabeçalho */}
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text)]">Produtos</h1>

                        <p className="text-[var(--text-secondary)]">
                            Esta é a página de produtos. Aqui você pode gerenciar os produtos
                            cadastrados no sistema.
                        </p>
                    </div>

                    <Button type="button" className="mt-2 w-auto" onClick={abrirNovo}>
                        Adicionar novo produto
                    </Button>
                </div>

                {/* Pesquisa */}
                <Inputs
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            setAppliedSearch(searchTerm.trim());
                        }
                    }}
                    className="mt-5 w-1/2"
                    icon={Search}
                />

                {/* Cards */}
                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.length === 0 && (
                        <p className="text-texto-suave">Nenhum produto encontrado.</p>
                    )}

                    {filteredProducts.map((produto) => (
                        <EntityCard
                            key={produto.id_produto}
                            titulo={produto.descricao}
                            icone={Package}
                            onEdit={() => abrirEdicao(produto)}
                            onDelete={() => {
                                toast.error(
                                    'A rota de exclusão de produtos ainda não foi integrada.',
                                );
                            }}
                        >
                            <p className="mt-2 text-texto-suave">
                                Categoria:{' '}
                                {produto.categorias?.[0]?.categoria?.descricao ?? 'Sem categoria'}
                            </p>

                            <p className="mt-1 text-texto-suave">
                                Quantidade: {produto.estoque?.quantidade ?? 0}
                            </p>

                            <p className="mt-1 text-texto-suave">
                                Valor: {formatarMoeda(produto.valor)}
                            </p>

                            <p className="mt-1 text-texto-suave">
                                Fornecedor:{' '}
                                {produto.fornecedores?.[0]?.fornecedor?.nome ?? 'Sem fornecedor'}
                            </p>

                            <p className="mt-1 text-texto-suave">
                                Produto Produção: {produto.fgTipoProducao ? 'Sim' : 'Não'}
                            </p>
                        </EntityCard>
                    ))}
                </div>
            </main>

            {/* Modal */}
            {showProductForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-borda bg-superficie shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
                        {/* Cabeçalho */}
                        <div className="flex items-center justify-between px-6 py-5">
                            <div>
                                <h2 className="text-2xl font-bold text-texto">
                                    {editingId !== null ? 'Editar produto' : 'Adicionar produto'}
                                </h2>

                                <p className="mt-1 text-sm text-texto-suave">
                                    {editingId !== null
                                        ? 'Atualize as informações do produto.'
                                        : 'Preencha os dados para cadastrar um novo produto.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fecharForm}
                                className="text-2xl text-texto-suave transition-colors hover:text-primaria"
                            >
                                ×
                            </button>
                        </div>

                        <form className="flex min-h-0 flex-1 flex-col" onSubmit={salvarProduto}>
                            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                                {/* Informações do produto */}
                                <div className="mb-6">
                                    <div className="mb-4 flex items-center gap-2">
                                        <div className="h-5 w-1 rounded-full bg-primaria" />

                                        <h3 className="text-sm font-bold uppercase tracking-wider text-texto">
                                            Informações do produto
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <Inputs
                                            label="Descrição"
                                            className="sm:col-span-2"
                                            value={newProduct.desc}
                                            onChange={setCampo('desc')}
                                            placeholder="Nome do produto"
                                            required
                                        />

                                        <Combobox
                                            label="Categoria"
                                            value={newProduct.categoria}
                                            opcoes={categorias}
                                            getLabel={(c) => c.descricao}
                                            getChave={(c) => c.id_categoria}
                                            onChange={(texto) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    categoria: texto,
                                                    id_categoria: null,
                                                })
                                            }
                                            onSelect={(c) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    categoria: c.descricao,
                                                    id_categoria: c.id_categoria,
                                                })
                                            }
                                        />

                                        <Combobox
                                            label="Unidade de medida"
                                            value={newProduct.unidade}
                                            opcoes={unidades}
                                            getLabel={(u) =>
                                                `${u.descrunidade} - ${u.nomenclatura}`
                                            }
                                            getChave={(u) => u.id_unidade}
                                            onChange={(texto) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    unidade: texto,
                                                    id_unidade_medida: null,
                                                })
                                            }
                                            onSelect={(u) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    unidade: u.nomenclatura,
                                                    id_unidade_medida: u.id_unidade,
                                                })
                                            }
                                        />

                                        <Inputs
                                            label="Estoque mínimo"
                                            type="number"
                                            min="0"
                                            value={newProduct.minimo}
                                            onChange={setCampo('minimo')}
                                            placeholder="0"
                                            required
                                        />

                                        <Inputs
                                            label="Quantidade em estoque"
                                            type="number"
                                            value={newProduct.quantidade_estoque}
                                            placeholder="0"
                                            disabled
                                        />

                                        <Inputs
                                            label="Valor unitário"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={newProduct.valor}
                                            onChange={setCampo('valor')}
                                            placeholder="0,00"
                                            required
                                        />

                                        <Combobox
                                            label="Fornecedor"
                                            value={newProduct.fornecedor}
                                            opcoes={fornecedores}
                                            getLabel={(f) => f.nome}
                                            getChave={(f) => f.id_fornecedor}
                                            onChange={(texto) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    fornecedor: texto,
                                                    id_fornecedor: null,
                                                })
                                            }
                                            onSelect={(f) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    fornecedor: f.nome,
                                                    id_fornecedor: f.id_fornecedor,
                                                })
                                            }
                                        />

                                        <Inputs
                                            label="Data de entrada"
                                            type="date"
                                            value={newProduct.dt_entrada}
                                            onChange={setCampo('dt_entrada')}
                                            required
                                        />

                                        <Inputs
                                            label="Prazo de saída"
                                            type="date"
                                            value={newProduct.prazo_saida}
                                            onChange={setCampo('prazo_saida')}
                                        />

                                        <Inputs
                                            label="Data de validade"
                                            type="date"
                                            value={newProduct.dt_validade}
                                            onChange={setCampo('dt_validade')}
                                        />

                                        {/* Tipo de produto */}
                                        <div className="sm:col-span-2">
                                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-borda bg-elevada/50 p-4 transition-colors hover:border-primaria/40">
                                                <input
                                                    type="checkbox"
                                                    checked={newProduct.fgTipoProducao}
                                                    onChange={(e) =>
                                                        setNewProduct({
                                                            ...newProduct,
                                                            fgTipoProducao: e.target.checked,
                                                        })
                                                    }
                                                    className="h-5 w-5 cursor-pointer accent-primaria"
                                                />

                                                <div>
                                                    <span className="block text-sm font-semibold text-texto">
                                                        Produto de produção
                                                    </span>

                                                    <span className="text-xs text-texto-suave">
                                                        Ative para cadastrar uma receita e seus
                                                        ingredientes.
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Receita */}
                                {newProduct.fgTipoProducao && (
                                    <div className="rounded-xl border border-primaria/25 bg-elevada/40 p-5">
                                        <div className="mb-5 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primaria/10 text-primaria">
                                                <Package size={21} />
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold text-texto">
                                                    Receita de produção
                                                </h3>

                                                <p className="text-xs text-texto-suave">
                                                    Configure os dados e ingredientes da receita.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <Inputs
                                                label="Nome da receita"
                                                className="sm:col-span-2"
                                                value={newReceita.nome}
                                                onChange={setCampoReceita('nome')}
                                                placeholder="Nome da receita"
                                                required
                                            />

                                            <Inputs
                                                label="Margem de perda (%)"
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={newReceita.margemPerda}
                                                onChange={setCampoReceita('margemPerda')}
                                                placeholder="0"
                                            />

                                            <Inputs
                                                label="Quantidade produzida"
                                                type="number"
                                                min="0"
                                                value={newReceita.quantidadeProduzida}
                                                onChange={setCampoReceita('quantidadeProduzida')}
                                                placeholder="0"
                                                required
                                            />

                                            <Inputs
                                                label="Quantidade perdida"
                                                type="number"
                                                min="0"
                                                value={newReceita.quantidadePerdida}
                                                onChange={setCampoReceita('quantidadePerdida')}
                                                placeholder="0"
                                            />
                                        </div>

                                        {/* Ingredientes */}
                                        <div className="mt-6 border-t border-borda pt-5">
                                            <div className="mb-4 flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-texto">
                                                    Produtos utilizados
                                                </h4>

                                                <span className="rounded-full bg-primaria/10 px-2.5 py-1 text-xs font-semibold text-primaria">
                                                    {newReceita.ingredientes.length} ingrediente(s)
                                                </span>
                                            </div>

                                            {newReceita.ingredientes.map((ingrediente, index) => (
                                                <div
                                                    key={index}
                                                    className="mb-3 rounded-lg border border-borda bg-superficie p-3"
                                                >
                                                    <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-4">
                                                        <Combobox
                                                            aria-label="Produto"
                                                            placeholder="Produto"
                                                            value={ingrediente.produto}
                                                            opcoes={products.filter(
                                                                (p) => p.id_produto !== editingId,
                                                            )}
                                                            getLabel={(p) => p.descricao}
                                                            getChave={(p) => p.id_produto}
                                                            onChange={(texto) =>
                                                                atualizarIngrediente(index, {
                                                                    produto: texto,
                                                                    id_produto: null,
                                                                })
                                                            }
                                                            onSelect={(p) =>
                                                                atualizarIngrediente(index, {
                                                                    produto: p.descricao,
                                                                    id_produto: p.id_produto,
                                                                })
                                                            }
                                                            required
                                                        />

                                                        <Inputs
                                                            aria-label="Quantidade"
                                                            type="number"
                                                            min="0"
                                                            placeholder="Quantidade"
                                                            value={ingrediente.quantidade}
                                                            onChange={(e) =>
                                                                atualizarIngrediente(index, {
                                                                    quantidade: e.target.value,
                                                                })
                                                            }
                                                            required
                                                        />

                                                        <Inputs
                                                            aria-label="Unidade"
                                                            type="select"
                                                            value={ingrediente.id_unidade}
                                                            onChange={(e) =>
                                                                atualizarIngrediente(index, {
                                                                    id_unidade:
                                                                        e.target.value === ''
                                                                            ? ''
                                                                            : Number(
                                                                                e.target.value,
                                                                            ),
                                                                })
                                                            }
                                                            options={[
                                                                { value: '', label: 'Unidade' },
                                                                ...unidades.map((u) => ({
                                                                    value: u.id_unidade,
                                                                    label: `${u.descrunidade} - ${u.nomenclatura}`,
                                                                })),
                                                            ]}
                                                            required
                                                        />

                                                        <Button
                                                            type="button"
                                                            variant="danger"
                                                            className="px-4 py-3"
                                                            onClick={() =>
                                                                removerIngrediente(index)
                                                            }
                                                        >
                                                            Remover
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}

                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                className="mt-2"
                                                onClick={adicionarIngrediente}
                                            >
                                                + Adicionar produto
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Rodapé */}
                            <div className="flex shrink-0 justify-end gap-3 border-t border-borda bg-fundo px-6 py-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="px-5"
                                    onClick={fecharForm}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    className="px-5"
                                >
                                    {editingId !== null ? 'Salvar alterações' : 'Cadastrar produto'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Produtos;