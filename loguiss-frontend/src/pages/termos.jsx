function Termos() {
    return (
        <div className="min-h-screen bg-fundo flex items-start justify-center py-16">
            <div className="w-full max-w-3xl px-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold text-texto">Termos de Serviço</h1>
                    <p className="mt-2 text-sm text-texto-suave">
                        Loguiss • Vigente desde 12 de agosto de 2026
                    </p>
                </header>
                <main className="bg-transparent border border-borda rounded-lg p-8 text-left max-h-[76vh] overflow-y-auto">
                    <p className="text-texto mb-6 leading-relaxed">
                        Bem-vindo ao nosso sistema! Ao utilizar este sistema, você concorda com os
                        seguintes termos de serviço:
                    </p>
                    <section className="mb-6">
                        <h2 className="text-sm font-medium text-texto tracking-wide uppercase pb-3 border-b border-borda">
                            Quem pode usar
                        </h2>
                        <p className="mt-4 text-texto leading-relaxed">
                            Ao acessar ou utilizar o sistema Loguiss ("Sistema", "Plataforma" ou
                            "Serviço"), o usuário declara ter lido, compreendido e aceitado estes
                            Termos de Uso. Caso não concorde, não utilize o Sistema.
                        </p>
                        <p className="mt-3 text-sm text-texto-suave">
                            Equipe responsável: Rafael Luiz Pilonetto e Christian da Rosa
                            Martinkoski.
                        </p>
                    </section>
                    <section className="mb-6">
                        <h3 className="text-sm font-medium text-texto tracking-wide uppercase pb-3 border-b border-borda">
                            O que oferecemos
                        </h3>
                        <ul className="mt-4 space-y-2 text-texto list-disc list-inside">
                            <li>Cadastro de produtos, receitas, matérias-primas e fornecedores;</li>
                            <li>Controle de movimentações de estoque e gestão de produção;</li>
                            <li>Previsões via IA e integrações com PDV;</li>
                            <li>Relatórios e alertas para suporte à operação.</li>
                        </ul>
                        <p className="mt-3 text-sm text-texto-suave">
                            O Sistema é fornecido "como está" e pode ser atualizado quando
                            necessário.
                        </p>
                    </section>
                    <section className="mb-6">
                        <h3 className="text-sm font-medium text-texto tracking-wide uppercase pb-3 border-b border-borda">
                            Cadastro e conta
                        </h3>
                        <p className="mt-4 text-texto">
                            Responsabilidade pela veracidade das informações e sigilo das
                            credenciais. Perfis com permissões distintas; a empresa contratante
                            responde pelos usuários vinculados.
                        </p>
                    </section>
                    <section className="mb-6">
                        <h3 className="text-sm font-medium text-texto tracking-wide uppercase pb-3 border-b border-borda">
                            Planos e pagamento
                        </h3>
                        <p className="mt-4 text-texto">
                            Períodos gratuitos podem ser oferecidos; após isso, será cobrado
                            conforme tabela vigente.
                        </p>
                    </section>
                    <section className="mb-6">
                        <h3 className="text-sm font-medium text-texto tracking-wide uppercase pb-3 border-b border-borda">
                            Uso adequado
                        </h3>
                        <p className="mt-4 text-texto">
                            Proibido uso ilícito, engenharia reversa, ou automações não autorizadas.
                            Violações podem resultar em suspensão ou encerramento da conta.
                        </p>
                    </section>
                    <section className="mb-6">
                        <h3 className="text-sm font-medium text-texto tracking-wide uppercase pb-3 border-b border-borda">
                            Responsabilidades e IA
                        </h3>
                        <p className="mt-4 text-texto">
                            As previsões de IA são orientativas. Integrações dependem de terceiros;
                            o Loguiss não se responsabiliza por indisponibilidades externas.
                        </p>
                    </section>
                    <section className="mb-6">
                        <h3 className="text-sm font-medium text-texto tracking-wide uppercase pb-3 border-b border-borda">
                            Legislação
                        </h3>
                        <p className="mt-4 text-texto">
                            Regidos pela legislação brasileira. Foro da comarca do domicílio da
                            empresa responsável.
                        </p>
                    </section>
                </main>
                <footer className="mt-6 flex items-center justify-between text-sm text-texto-suave">
                    <span>Última atualização: 12 de agosto de 2026</span>
                    <a href="/" className="text-texto hover:underline">
                        Voltar
                    </a>
                </footer>
            </div>
        </div>
    );
}

export default Termos;