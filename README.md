# InnDAP!
Serviço de genrenciamento de contas federadas para o esquema InnovaPerson.

[Conheça o Inova RS](https://www.inova.rs.gov.br/conheca-inova-rs)

## 1. Funcionalidades
* Registro de contas de usuários
* Gerenciamento multimínio
* Auto-inscrição com aprovação
* Notificação via e-mail

## 2. Arquitetura
![arquitetura](img/arquitetura.png)
## 3. Fluxo de Operação
![operacao](img/fluxo-de-operacao.png)
## 4. Fluxo de Auto-inscrição
![auto-inscricao](img/fluxo-de-autoinscricao.png)
## 5. Screenshots
### 5.1. Configurações

Adicionando um domínio
![configuracao de dominio](img/configuracao-dominio.png)
Tela de configuração para conexão com a base LDAP
![configuracao de ldao](img/configuracao-ldap.png)
Configuração de um servidor de e-mail (por domínio) para envio de notificações
![configuracao de email](img/configuracao-email.png)
Tela de resumo de configurações por domínio
![resumo-de-configuracoes](img/resumo-de-configuracoes.png)
### 5.2. Gerenciamento de contas

Consulta das afiliações de um usuário registrado
![consulta afiliacoes](img/consulta-afiliacoes.png)
Fomulário de inclusão de usuário
![inclusao de usuario](img/inclusao-de-usuario.png)
![inclusao de afiliacao](img/inclusao-de-afiliacao.png)
![inclusao de usuario resumo](img/inclusao-de-usuario-resumo.png)
Resumo de contas registradas com usuário pronto para sincronização com  a base LDAP
![pronto para sincronizacao](img/pronto-para-sincronizacao.png)
---
## Deploy

### Pré-requisitos
* [innovaLdapAPI](https://github.com/allexmagno/innovaLdapAPI)
* Node

`git clone https://github.com/allexmagno/innDAP `\
`npm install`\
`npm start`