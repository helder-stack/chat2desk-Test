//altera os campos para ver a senha
function passwords() {
  if(document.getElementsByTagName('a').length > 1){
    if (!viewPass) {
      pass[0].setAttribute("type", "text");
      pass[1].setAttribute("type", "text");
      document.getElementsByTagName("a")[2].innerHTML =
        "Clique aqui para voltar para o modo senha";
      viewPass = true;
    } else {
      pass[0].setAttribute("type", "password");
      pass[1].setAttribute("type", "password");
      document.getElementsByTagName("a")[2].innerHTML =
        "Clique aqui para ver as senhas";
      viewPass = false;
    }
  }else{
    if (!viewPass) {
      pass[0].setAttribute("type", "text");
      pass[1].setAttribute("type", "text");
      document.getElementsByTagName("a")[0].innerHTML =
        "Clique aqui para voltar para o modo senha";
      viewPass = true;
    } else {
      pass[0].setAttribute("type", "password");
      pass[1].setAttribute("type", "password");
      document.getElementsByTagName("a")[0].innerHTML =
        "Clique aqui para ver as senhas";
      viewPass = false;
    }
  }
}

//verifica se as senhas estão dentro dos padrões:
//não pode ser undefined
//não podem estar vazias
//não podem conter espaço
//ambos os campos devem ser iguais
function passFieldVerify() {
  if (pass[0].value == pass[1].value) {
    if (
      pass[0].value != undefined &&
      pass[0].value != "" &&
      pass[0].value != " " &&
      pass[0].value.length >= 5 &&
      pass[1].value != undefined &&
      pass[1].value != "" &&
      pass[1].value != " " &&
      pass[1].value.length >= 5
    ) {
      if (pass[0].value.indexOf(" ") == -1) {
        return true;
      } else {
        alert("A senha não pode conter espaço");
        return false;
      }
    } else {
      alert("Formato de senha incorreto");
      return false;
    }
  } else {
    alert("As senhas estão diferentes");
    return false;
  }
}

//verifica se o email está dentro dos padrões:
//não pode conter espaço
//o formato é: exemplo@gmail.com ou exemplo@gmail.com.br
//é necessário ter um domínio (.com.br, .com, etc)
function emailVerify(email) {
  let aux = email.split(" ");
  if (aux.length > 1) {
    alert("O email não pode conter espaço");
    return false;
  } else {
    aux = email.split("@");
    if (aux.length < 2) {
      alert("O email precisa ser completo");
      return false;
    } else {
      aux = aux[1].split(".");
      if (aux.length < 2) {
        alert("O email precisa ser completo");

        return false;
      } else {
        if (aux[1] == "") {
          alert("O email precisa não pode conte espaço");

          return false;
        } else {
          return true;
        }
      }
    }
  }
}

//verifica o campo de nome
//Não pode conter números
//não pode ter apenas 1 nome
function nameVerify(username) {
  var number = false;
  for (var index = 0; index <= username.length - 1; index++) {
    if (!isNaN(username[index]) && username[index] != " ") {
      number = true;
      break;
    }
  }
  if (number) {
    alert("O nome não pode conter números");
    return false;
  } else {
    let aux = username.split(" ");
    if (aux.length <= 1) {
      alert("Insira o nome completo");
      return false;
    } else {
      if (aux.length >= 2) {
        if (aux[1] == "") {
          alert("Insira o nome completo");
          return false;
        } else {
          return true;
        }
      } else {
        alert("Insira o nome completo");
        return false;
      }
    }
  }
}

//verifica o campo de idade
//não pode ser menos de 9 anos e mais de 120 anos
//não pode conter letras
function ageVerify(age) {
  if (isNaN(age)) {
    alert("A idade precisa ser um número");
    return false;
  } else {
    if (age <= 8 || age >= 121) {
      alert("A idade precisa ser entre 9 e 120 anos");
      return false;
    } else {
      return true;
    }
  }
}
