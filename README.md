# Sistema de Envio de Mensagens por WhatsApp

O sistema de envio de mensagens por WhatsApp foi desenvolvido com o objetivo de fornecer uma forma fácil e eficiente de envio de mensagens por WhatsApp.

## Funcionalidades

O sistema fornece as seguintes funcionalidades:

- Envio de mensagens por WhatsApp
- Geração de QR Code para autenticação
- Verificação do status de autenticação
- Destruição do cliente

## Como usar

Para usar o sistema, basta seguir os passos abaixo:

### 0. Instalação

Execute o comando `npm install` para instalar as dependências do sistema

Execute o comando `npm run build` para iniciar o sistema

Copie o arquivo `.env.example` para `.env` e preencha as variáveis de ambiente com as suas configurações

Execute o comando `npm run start` para iniciar o sistema

### 1. Inicializar o cliente

Para inicializar o cliente, basta fazer uma solicitação POST para a rota `/api/v1/whatsapp/[client-id]`

[client-id]: O ID único do cliente

Se tudo der certo, o sistema retornará status 200 com a resposta `{
	"message": "Client initialized"
}`

### 2. Autenticação

Para autenticar o cliente, basta fazer uma solicitação GET para a rota `/api/v1/whatsapp/[client-id]/image`

Se tudo der certo, o sistema retornará status 200 com a image do QRCODE para escanear com o seu whatsapp

### 3. Enviar mensagem

Para enviar uma mensagem, basta fazer uma solicitação POST para a rota `/api/v1/whatsapp/[client-id]/send-message` com o corpo:

```json
{
  "to": "2449xxxxxxxx",
  "message": "conteúdo da mensagem"
}
```

Se tudo der certo, o sistema retornará status 200 com a resposta `{
    "message": "Message sent"
}`

Obs: O telefone deve ser formatado com o prefixo do país, exemplo: `2449xxxxxxxx` e a mensagem só será enviada caso `/api/v1/whatsapp/[client-id]/status` retorne

```json
{
  "isAuthenticated": true,
  "isReady": true
}
```

Caso não retorne a resposta acima, verifique o status de autenticação e o qrcode.

### 4. Ver perfil do whatsapp

Para ver o perfil do whatsapp, basta fazer uma solicitação GET para a rota `/api/v1/whatsapp/[client-id]/me`

Se tudo der certo, o sistema retornará status 200 com a resposta

```json
{
  "whatsappName": "João Neto",
  "phoneNumber": "244942779755"
}
```

### 5. Verificar status de autenticação

Para verificar o status de autenticação, basta fazer uma solicitação GET para a rota `/api/v1/whatsapp/[client-id]/status`

Se tudo der certo, o sistema retornará status 200 com a resposta `true` se sim ou `false` se não

```json
{
  "isAuthenticated": true,
  "isReady": true
}
```

### 6. Fazer logout

Para fazer logout, basta fazer uma solicitação POST para a rota `/api/v1/whatsapp/[client-id]/logout`

### 7. Destruir o cliente

Para destruir o cliente, basta fazer uma solicitação DELETE para a rota `/api/v1/whatsapp/[client-id]/destroy`
