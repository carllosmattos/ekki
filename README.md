# Projeto EKKI - @Author Carlos Eduardo <carllosmattos@yahoo.com>

Este projeto foi gerado com  [Vue.js](https://vuejs.org/) versão 2.6.11 versão 8.3.26, [Express.js](https://expressjs.com/pt-br/) versão 4.17.1, 
[knex.js](http://knexjs.org/) versão 0.95.3

## Screenshots

![App UI](/app.png)

# Projetos desenvolvidos

## Frontend com Vue.js
Rode `npm run serve` para pode acessar o servidor de desenvolvimento. Navegar para `http://localhost:8080/#`. O aplicativo será recarregado automaticamente se você alterar qualquer um dos arquivos de origem.
## Backend com Express.js
Rode `npm run dev` no cmd para rodar o servidor dev. Navege para `http://localhost:3000`. O aplicativo será recarregado automaticamente se você alterar qualquer um dos arquivos de origem.

# Instalação e configuração de Ambientes

## Ambiente na maquina local
para que este projeto funcione na sua maquina primeiro você vai precisar de algumas ferramentas instaladas em usa maquina
- 1º [node.js](https://nodejs.org/en/) qualquer versão acima da V5
- 2º [Vue CLI](https://cli.vuejs.org/) versão 4.5.6 rode o comando ```npm i @vue/cli@4.5.6 -g```
- 3º [mysql](https://www.mysql.com/) versão mysql na versão 5.7 ou superior.

## Ambiente em kubernetes
Também está pre configurado um ambiente em kubernetes os arquivos `.yml` estão localizados em `./backend/kubernetes/**/*.yml`, e  também 
arquivos para automatizar o startup e shutdown do ambiente em kubernetes os arquivos estão localizados em `./backend/kubernetes/*sh`

## IMPORTANTE Configuração da base de dados
Antes de iniciar qualquer ambiente sejá ele `LOCAL | DOCKERIZADO` deve ser criado uma base de dados no [mysql](https://www.mysql.com/) uma para ambiente de DEV outra para ambiente de TEST.

Database Name | User Database | Password Database
--------------|---------------|------------------
ekki          |    `root`     | admin

# Teste
[jest](https://jestjs.io/pt-BR/) na versão 26.6.3
Para teste de cobertura de cobertura de código.

## Mais Ajuda
O Frontend e o Backend possuem seus próprios `README.md` nas pastas raiz com maior detalhamento do projeto respectivo.