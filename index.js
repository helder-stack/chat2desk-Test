//IMPORTAÇÕES
const express = require("express");
const app = express();
const bp = require("body-parser");
const userController = require("./database/controller");
const cors = require("cors");
const auth = require("./middleware/auth");
const session = require("express-session");
const userModel = require("./database/model");

//CONFIGURAÇÕES DAS ROTAS DO ARQUIVO ATUAL
app.use(
  session({
    secret: "çlasjd",
    cookie: { maxAge: 300000 },
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.static("public"));
app.use(cors());
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use("/", userController);
app.set("view engine", "ejs");

//ROTAS PRINCIPAIS DE PÁGINAS

app.get("/", (req, res) => {
  res.render("index.ejs");
});

//exibe a tela de operações
app.get("/dashboard", auth, (req, res) => {
  res.render("dashboard.ejs", {
    userData: {
      id: req.id,
      email: req.email,
    },
  });
});

//exibe a tela de registro, caso o usuário queira logar no sistema mas não tenha uma conta
app.get("/register", (req, res) => {
  res.render("register");
});

//realiza o logout
app.get("/logout", (req, res) => {
  //seta o token como "" para dar logout ao recarregar
  req.session.token = "";
  res.redirect("/");
});

app.listen("3001", (req, res) => {
  console.log("Server is running...");
});
