
Backend desenvolvido em Node.js utilizando Express, Prisma ORM e PostgreSQL.

## Tecnologias Utilizadas

* Node.js
* Express
* Prisma ORM
* PostgreSQL
* Docker
* JWT (JSON Web Token)
* Nodemailer
* Dotenv
* CORS

---

## Pré-requisitos

Antes de iniciar o projeto, é necessário ter instalado:

* Node.js
* Docker Desktop
* Git

---

## Clonando o Projeto

```bash
git clone <url-do-repositorio>
cd loguiss-backend
```

---

## Instalando Dependências

```bash
npm install
```

---

## Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto.

Exemplo:

```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5433/Loguiss?schema=public

JWT_SECRET=sua_chave_jwt_super_secreta

EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_senha_de_app_google
```

---

## Iniciando o Banco de Dados

O projeto utiliza PostgreSQL em um container Docker.

Inicie o banco com:

```bash
docker compose up -d
```

ou

```bash
docker-compose up -d
```

Verifique se o container está em execução:

```bash
docker ps
```

---

## Executando as Migrations

Após iniciar o banco:

```bash
npx prisma migrate deploy
```

Durante o desenvolvimento:

```bash
npx prisma migrate dev
```

---

## Gerando o Prisma Client

Sempre que houver alteração no arquivo `schema.prisma`:

```bash
npx prisma generate
```

---

## Abrindo o Prisma Studio

Interface gráfica para visualizar e editar dados:

```bash
npx prisma studio
```

---

## Iniciando a API

```bash
node index.js
```

ou

```bash
npm start
```

---

## Sistema de Autenticação

O projeto utiliza:

* JWT para autenticação.
* Middleware de validação de token.
* Recuperação de senha por e-mail.

Fluxo:

1. Usuário solicita recuperação de senha.
2. Sistema gera código de verificação.
3. Código é enviado por e-mail.
4. Usuário valida o código.
5. Sistema permite redefinir a senha.

---

## Envio de E-mails

O envio de e-mails é realizado através do Nodemailer utilizando Gmail.

Necessário:

1. Ativar verificação em duas etapas na conta Google.
2. Gerar uma senha de aplicativo.
3. Configurar as variáveis:

```env
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_senha_de_app
```

---

## Estrutura do Projeto

```text
loguiss-backend/
│
├── controllers/
├── routes/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── .env
├── docker-compose.yml
├── prisma.config.ts
├── database.js
├── index.js
└── package.json
```

---

## Dependências Principais

```bash
npm install express
npm install prisma
npm install @prisma/client
npm install nodemailer
npm install dotenv
npm install cors
npm install jsonwebtoken
npm install cpf-cnpj-validator
```

---

## Comandos Úteis

Gerar Prisma Client:

```bash
npx prisma generate
```

Criar migration:

```bash
npx prisma migrate dev --name nome_da_migration
```

Abrir Prisma Studio:

```bash
npx prisma studio
```

Subir containers Docker:

```bash
docker compose up -d
```

Parar containers Docker:

```bash
docker compose down
```

Ver containers ativos:

```bash
docker ps
```

---

## Observações

* Nunca envie o arquivo `.env` para o GitHub.
* Certifique-se de que o Docker esteja em execução antes de iniciar a API.
* Sempre execute as migrations após clonar o projeto em uma nova máquina.
* Após alterações no schema do Prisma, execute `npx prisma generate`.
