const fs = require("fs");

//transforma o json em um objeto array com os objetos existentes
let userList = JSON.parse(
  fs.readFileSync("./database/users.json", "utf-8", (error, data) => {
    return data;
  })
);

//função para atualizar o json com os dados atuais (caso delete ou edite algum dado)
async function reWrite() {
  fs.writeFile(
    "./database/users.json",
    await JSON.stringify(userList),
    (error) => {
      if (error) {
        console.log(error);
      }
    }
  );
}

//verifica se o email recebido é valido
function emailVerify(email) {
  //o email não porerá conter espaço
  let aux = email.split(" ");
  if (aux.length > 1) {
    return false;
  } else {
    //e deve conter dois elementos, separados por @
    //ex: helder@gmail.com
    aux = email.split("@");
    if (aux.length < 2) {
      return false;
    } else {
      //irá verificar se a segunda parte (@gmail.com) possui dois elementos ou mais
      //1- gmail
      //2- .com
      aux = aux[1].split(".");
      if (aux.length < 2) {
        return false;
      } else {
        //se possuir dois elementos, irá verificar se o último (depois do ponto) está vazio
        if (aux[1] == "") {
          return false;
        } else {
          return true;
        }
      }
    }
  }
}

//deleta um usuário do userlist
function userDelete(id) {
  //irá deletar o usuário da lista local, filtrando e armazenando na variável local aux
  let aux = userList.filter((user) => user.id != id);
  userList = aux;
  //atualizando a lista de usuários local e reescrevendo-a logo após
  reWrite();
}

//adiciona um novo usuário, utilizando como base a lista userList
function newUser(data) {
  //recebe o objeto desejado
  //adiciona na lista de usuários local
  userList.push(data);
  //e reescreve no arquivo principal
  reWrite();
}

//retorna a lista atual de usuários
function getUserList() {
  return userList;
}

//retorna um determinado usuário, definido pelo id
function getUser(id) {
  for (let index = 0; index <= userList.length; index++) {
    if (userList[index].id == id) {
      return userList[index];
      break;
    }
  }
}

//função para atualizar um usuário
async function update(userDataUpdate) {
  //irá procurar o id do usuário no banco de dados
  for (let index = 0; index <= userList.length; index++) {
    //encontrando o id, irá atualizá-lo e reescrever o arquivo principal
    if (userList[index].id == parseInt(userDataUpdate.id)) {
      userList[index] = await userDataUpdate;
      reWrite();
      break;
    }
  }
}

module.exports = {
  userList,
  getUserList,
  newUser,
  userDelete,
  getUser,
  update,
  emailVerify,
};
