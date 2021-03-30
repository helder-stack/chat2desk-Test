//IMPORTAÇÕES

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const userModel = require("./model");

//senha do jwt
const jwtkey = "asdjkaksd";

//configuração da sessão
router.use(
  session({
    secret: "çlasjd",
    cookie: { maxAge: 300000 },
    resave: true,
    saveUninitialized: true,
  })
);

//rotas de operações com usuários

//faz o login
router.post("/login", async (req, res) => {
  //faz a desestruturação do objeto recebido pelo corpo da requisição
  var { email, password } = req.body;

  //notFound é uma variável que determina se o usuário logado foi encontrado ou não
  //Definida como true em padrão para que determine que ele não foi encontrado ainda
  var NotFound = true;
  //pega sempre a lista de usuários atualizada
  let userList = await userModel.getUserList();

  //se a lista for maior que 1 elemento, ou seja, existirem usuários, ele irá pesquisar na lista
  if (userList.length >= 1) {
    //ele irá percorrer os campos do objeto encontrado
    for (let index = 0; index <= userList.length - 1; index++) {
      //caso o email seja encontrado
      if (userList[index].email == email) {
        //irá mudar o notFound para false, indicando que o email foi encontrado
        NotFound = false;
        //irá comparar a senha do input com a senha hash do banco de dados
        if (bcrypt.compareSync(password, userModel.userList[index].password)) {
          //irá criar um token de acesso com o id e email do usuário
          jwt.sign(
            {
              id: userList[index].id,
              email: userList[index].email,
            },
            jwtkey,
            {
              //este token durará apenas 30 minutos
              expiresIn: "30m",
            },
            (error, token) => {
              //irá criar uma sessão no servidor com o token de acesso
              req.session.token = token;
              //irá enviar para o front, o token de acesso
              res.send(token);
            }
          );
          break

          //se não encontrar o usuário, ele irá retornar um status de autorização recusada
        } else {
          res.sendStatus(203);
        }
      }
    }
    //se notFound estiver True, ele irá retornar o código 204
    //indicando que não foi encontrado
    if (NotFound) {
      res.sendStatus(204);
    }

    //caso não exista, indicará que não foi encontrado um usuário, porque a lista se encontra vazia
  } else {
    res.sendStatus(204);
  }
});

//rota para deletar um usuário do json
router.get("/delete/:id", auth, (req, res) => {
  userModel.userDelete(req.params.id);
  res.redirect("/userList");
});

//cria um novo usuário no banco de dados
router.post("/register/user", async (req, res) => {

  var { username, age, password, email, password } = req.body;
  if (!userVerify(email)) {
    //se não encontrar um usuário, irá criar um novo
    if (email != "" && password != "") {
      if (!userModel.emailVerify(email)) {
        res.sendStatus(203);
      } else {
       
        if (isNaN(age)) {
          res.sendStatus(203);
        } else {
          let salt = bcrypt.genSaltSync(10);
          password = bcrypt.hashSync(password, salt);
          userModel.newUser({
            id:
              userModel.getUserList().length == 0
                ? 1
                : userModel.getUserList()[userModel.getUserList().length - 1]
                    .id + 1,
            username,
            age,
            email,
            password,
          });
          
          res.sendStatus(200);
        }
      }
    }
  } else {
    res.sendStatus(208);
  }
});

//pega as informações do usuário logado para ser exibida na dashboard
router.get("/getInfo", auth, async (req, res) => {
  //pega a lista de usuários atualizada
  let userList = await userModel.getUserList();

  //cado encontre o id do usuário que seja igual a req.id (criado no middleware), enviará o status do usuário logado
  userList.forEach((user) => {
    if (user.id == req.id) {
      res.send(user);
    }
  });
});

//exibe a lista de usuários cadastrados
router.get("/userList", auth, async (req, res) => {
  let userListUp = await userModel.getUserList();
  res.render("users.ejs", {
    users: userListUp,
  });
});

//exibe o formulário de edição
router.get("/edit/:id", auth, async (req, res) => {
  //userObject irá ser um objeto auxiliar com os dados atuais
  let userObject;
  //irá pegar a lista atual no banco de dados
  let userList = await userModel.getUserList();
  //e irá percorrê-la até encontrar o usuário
  userList.forEach((user) => {
    if (user.id == req.params.id) {
      //encontrado o objeto desejado, ele irá coloca-lo em userObject
      userObject = user;
    }
  });

  //verifica se o id enviado para o servidor é um número
  if (!isNaN(req.params.id)) {
    //se for um número, irá verificar se userObject existe
    if (userObject) {
      //se existe, irá renderizar a página de formulário com as informações do usuário escolhido
      res.render("edit.ejs", {
        userObject,
      });
      //se não existir, irá voltar para userList
    } else {
      res.redirect("/userList");
    }
    //se não for um número, irá voltar para a user list
  } else {
    res.redirect("/userList");
  }
});

//faz a edição no banco de dados
router.post("/edit", auth, async (req, res) => {
  //irá desestruturar a requisição
  var { id, username, age, email, password } = req.body;

  try {
    //vai verificar se o formato do email está dentro dos padrões
    if (!userModel.emailVerify(email)) {
      //se não estiver, irá enviar o código 203, informando que o formato é inválido
      res.sendStatus(203);
    } else {
      //irá pegar os dados atuais do usuário que deseja torcar
      var currentDataUser = await userModel.getUser(parseInt(id));

      //esta variável será um objeto com os dados atuais
      var dataUserUpdate = {};

      //transforma o id recebido em um número
      id = parseInt(id);

      //caso o email recebido seja diferente do email do usuário atual
      //ou seja, se o usuário quis mudar o email
      if (email != currentDataUser.email) {
        //ele irá verificar se o email já existe no banco de dados
        if (userVerify(email)) {
          //se ele já existir, irá retornar o status 208, indicando que o email já existe e não pode ser cadastrado
          res.sendStatus(208);
        } else {
          //se as senhas estiverem vazias, indicará que o usuário não quis alterar a senha
          if (password == "") {
            dataUserUpdate = {
              id,
              username,
              age,
              email,
              //enviando apenas a senha atual (que recebeu do banco de dados)
              password: currentDataUser.password,
            };
          } else {
            //caso a senha não esteja vazia
            // irá gerar um hash para a nova senha
            let salt = bcrypt.genSaltSync(10);
            password = bcrypt.hashSync(password, salt);
            dataUserUpdate = {
              id,
              username,
              age,
              email: email,
              password,
            };
          }
          userModel.update(dataUserUpdate);
          //e irá retornar o status 200, indicando que tudo ocorreu bem
          res.sendStatus(200);
        }

        //caso o email seja igual, ele não irá alterar o email
      } else {
        if (password == "") {
          dataUserUpdate = {
            id,
            username,
            age,
            email: currentDataUser.email,
            password: currentDataUser.password,
          };
          userModel.update(dataUserUpdate);

        } else {
          let salt = bcrypt.genSaltSync(10);
          password = bcrypt.hashSync(password, salt);
          dataUserUpdate = {
            id,
            username,
            age,
            email:currentDataUser.email,
            password,
          };
        }
        userModel.update(dataUserUpdate);
        res.sendStatus(200);
        //depois de fazer as alterações do usuário, irá chamar o método update
        //enviando os dados atuais como parâmetro
      }
    }
  } catch (e) {
    res.sendStatus(203);
  }
});

//verifica se o usuário já existe no banco de dados
function userVerify(email) {
  //definido como false por padrão
  var auxFinding = false;
  //irá receber a lista atual de usuários
  for (var index = 0; index <= userModel.getUserList().length - 1; index++) {
    if (userModel.getUserList()[index].email == email) {
      //caso exista, irá definir auxFinding como true
      //indicando que foi encontrado
      auxFinding = true;
      break;
    }
  }
  return auxFinding;
}

module.exports = router;
