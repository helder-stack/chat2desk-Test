# CHAT2DESK TEST

## Sistema para registro e login de usuários

![Badge](https://img.shields.io/badge/node.js-v14.16.0-green)

## Tabela de rotas 

* Login *
### router.post('/login')
        
* Deletar usuários *
### router.get('/delete/:id')
        
* Pegar informações do usuário logado *
### router.get('/getInfo')

* Listagem de usuários *
### router.get('/userList')
        
* Registro de usuários *
### router.post('/register/user')
        
* edição de dados *
### router.post('/edit')

* Rota principal *
### app.get('/')
        
* rota da dashoboard *
### app.get('/dashboard')
        
* rota do formulário de registro * 
### app.get('/register')
        
* rote de logout *
### app.get('/logout')

## RECURSOS
- [x] Cadastro de usuários
- [x] Edição de dados
- [x] Login
- [x] Deletar dados


## REQUISITOS

### Antes de rodar a aplicação, certifique-se de que seu node está atualizado a partir da versão 14.16.0

### Rodar o sistema
#### Para rodar o sistema, execute: npm start


# O SERVIDOR INICIARÁ NA PORTA 3001 - ACESSE localhost:3001/