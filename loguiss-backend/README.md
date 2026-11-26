# Loguiss — backend

## Tecnologias

Versões principais conforme declaradas em `package.json`:

- Node.js com módulos ES.
- Express 5 para a API REST.
- PostgreSQL 15 para persistência.
- Prisma 7 com adaptador `pg` para acesso ao banco e migrations.
- `jsonwebtoken` 9 para tokens JWT.
- Nodemailer 8 para envio de e-mail.
- Docker Compose para desenvolvimento local do banco.

## Pré-requisitos

- Node.js e npm.
- Docker Desktop, ou uma instância PostgreSQL acessível.
- Credenciais de e-mail e senha de aplicativo Gmail para testar o envio de códigos de verificação.

## Instalação e execução

Na raiz do repositório:

```bash
cd loguiss-backend
npm install
```

Copie `.env.example` para `.env` e preencha as configurações locais. Suba o PostgreSQL e aplique as migrations conforme a seção abaixo. Em seguida, inicie a API:

```bash
npm run dev
```

O servidor Node escuta na porta `3000`, definida em `index.js`. Os comandos `npm start` e `npm run dev` executam a mesma entrada.

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | Conexão PostgreSQL usada pela aplicação Prisma. |
| `DIRECT_URL` | Conexão usada pelo Prisma CLI para operações de schema e migrations. |
| `CHAVE_JWT` | Segredo usado para assinar e validar tokens. |
| `EMAIL_APP` | Conta Gmail usada para enviar e-mails. |
| `SENHA_APP` | Senha de aplicativo da conta de envio. |
| `FRONT_URL` | Origem do frontend permitida pela configuração CORS em `app.js`. |
| `GEMINI_API_KEY` | Chave da API Gemini usada para gerar previsões. |
| `GEMINI_MODEL` | Modelo principal; padrão `gemini-3.5-flash-lite`. |
| `GEMINI_FALLBACK_MODELS` | Lista opcional de modelos alternativos, separada por vírgula. |
| `GEMINI_TIMEOUT_MS` | Tempo máximo por chamada da IA em milissegundos; padrão `30000`. |
| `GEMINI_USAR_BUSCA_WEB` | Define se a IA pode pesquisar contexto na web; use `false` para desativar. |

Não inclua credenciais reais no README, no `.env.example` ou no controle de versão. Mantenha valores locais somente em `.env`.

Se a API Gemini estiver indisponível, a previsão usa uma projeção local baseada no histórico e no padrão semanal. O campo `previsao.modelo` identifica o resultado como `fallback-local` ou `misto-gemini-e-local`; a resposta da API mantém o mesmo formato.

Cada previsão considera até 20 produtos ativos com maior volume de saídas nos últimos 30 dias e envia até 40 movimentações recentes somente desses produtos. As movimentações aparecem compactadas no campo `mov` e também alimentam o histórico diário; os produtos vão em um único lote para a chamada de previsão da IA.

As consultas `GET /previsao/ultima` e `GET /previsao/:id` reconstroem os dados salvos para o frontend. Além dos gráficos e recomendações existentes, `produtosPrevisao` traz os detalhes e a série diária salva de cada produto, e `respostasIA` expõe as respostas originais persistidas por lote.

## Banco de dados e migrations

O projeto inclui um serviço PostgreSQL no `docker-compose.yml`. Inicie-o e confira a porta publicada:

```bash
docker compose up -d
docker compose ps
docker compose port db 5432
```

Use host, porta, usuário, senha e nome de banco correspondentes à sua configuração local de PostgreSQL ao preencher `DATABASE_URL` e `DIRECT_URL`. O mapeamento de porta do Compose pode variar conforme a configuração local. As credenciais definidas no Compose são apenas para desenvolvimento e não devem ser reutilizadas em produção.

Com as variáveis de ambiente configuradas:

```bash
npx prisma migrate deploy
npx prisma generate
```

Para criar e aplicar uma migration durante o desenvolvimento:

```bash
npx prisma migrate dev --name nome_da_migration
npx prisma generate
```

O schema está em `prisma/schema.prisma` e o histórico de migrations em `prisma/migrations/`. Não há script de seed configurado no `package.json`; os dados de teste precisam ser criados por uma rotina própria ou pelas operações disponíveis.
s