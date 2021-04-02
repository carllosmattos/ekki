# Projeto Ekki - Backend

Este projeto foi criado para motivos de teste para uma empressa utilizando as ferramentas principais [Node.js](https://nodejs.org/en/) e [Express](https://expressjs.com/pt-br/).

Feramentas Utilizadas:
* [NodeJs](https://nodejs.org/en/)
* [Express](https://expressjs.com/pt-br/)
* [knex](http://knexjs.org/)
* [mysql2](https://www.npmjs.com/package/mysql2)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [bodyParser](https://www.npmjs.com/package/body-parser)
* [cors](https://www.npmjs.com/package/cors)
* [helmet](https://www.npmjs.com/package/helmet)
* [hide-powered-by](https://www.npmjs.com/package/hide-powered-by)
* [hsts](https://www.npmjs.com/package/hsts)
* [http-status-codes](https://www.npmjs.com/package/http-status-codes)
* [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc)
* [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
* [yamljs](https://www.npmjs.com/package/yamljs)
* [x-xss-protection](https://www.npmjs.com/package/x-xss-protection)
* [uuid](https://www.npmjs.com/package/uuid)
* [nodemon](https://nodemon.io/)

## Screenshots
app view:
![App UI](/app.png)

## Development

### Setup

#### 1) Instalação de dependencias
``` sh
npm i 
```
Obs: E necessario que o [NodeJs](https://nodejs.org/en/) já esteja instalado em sua máquina

#### 2) Data base
``` sh
docker-compose up -d 
```
Obs: Deixei um aquivo de [DockerCompose](https://docs.docker.com/compose/) para simplificar utilização do projeto

#### 3) Migrate Knex
``` sh
npm run migrate:up
```

#### 4) Iniciar Projeto
``` sh
npm run dev

# verificar a url http://localhost:3000 ou http://localhost:${customPort}
```

#### 5) Uso
Faça 2 request na rota http://localhost:3000 ou http://localhost:${customPort} e verifique o seu 
console de execução

## Test
#### 1) Inicialização da swich de teste
Obs: Antes de fazer os passo de iniciar os testes deverar ser feito previamente os passos a passos da DEVELOPMENT
``` sh
npm test
# OU
npm run test:unit
# OU
npm run test:integration
# OU
npm run test:watch
```

#### 2) Inicialização da swich de teste de cobertura
Obs: Antes de fazer os passo de iniciar os testes deverar ser feito previamente os passos a passos da DEVELOPMENT
``` sh
npm run coverage
# OU
npm run coverage:coveralls
```

## Extra
### Doc
O projeto BACKEND possui uma documentação das rotas da API navegar para `http://localhost:3000/api-doc`

### Pipeline Deploy
Estarei deixando um arquivo chamado `.travis.yml` que ser para pipeline de deploy do projeto
na plataforma [travis-ci](https://travis-ci.org/)

### Ambiente em Docker
Rode ```docker-compose -d up``` para gerar o build de todo o ambiente do projeto.

### Ambiente em kubernetes
Eu tambem deixei pre configurado um ambiente em kubernetes os arquivos `.yml` estão localizados em `./kubernetes/**/*.yml`, tambem deixei pre configurado arquivos para automatizar o startup e shutdown do ambiente em kubernetes os arquivos estão localizados em `./kubernetes/*sh`

## Contato

Desenvolvido por: [Carlos Eduardo](https://github.com/carllosmattos)

* Email: [duduvieiramattos@gmail.com](mailto:duduvieiramattos@gmail.com) 
* Github: [github.com/carllosmattos](https://github.com/carllosmattos)
* Linkedin: [linkedin.com/in/carlos-eduardo-vieira-de-matos-7068b5158](https://www.linkedin.com/in/carlos-eduardo-vieira-de-matos-7068b5158)

### Customização de Configurações do projeto
Verifique [Configurações e Referencias](https://expressjs.com/pt-br/).