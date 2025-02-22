This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Install packges
```bash
npm install
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Enviroments Variables (.env.local)

|Variavel|Descrição|
|:-|:-|
|`GOOGLE_CLIENT_ID`|**Obrigatório**. Client ID utilizado para integração com o google oauth|
|`GOOGLE_CLIENT_SECRET`|**Obrigatório**. Client Secret utilizado para integração com o google oauth |
|`NEXTAUTH_URL`|**Obrigatório**. URL da aplicação frontend |
|`NEXTAUTH_SECRET`|**Obrigatório**. Secret utilizado para geração do token quando logado com credentials |
|`NEXT_PUBLIC_API_BASE_URL`|**Obrigatório**. A chave da API backend CertificaUTF  |
|`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`|**Obrigatório**. A chave da API para integração com o google maps |

## Documentação 

Algumas imagens do podem ser encontradas na pasta `documentation/images`