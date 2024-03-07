const fs = require("fs")
const path = require("path")

const chalk = require("chalk")
const inquirer = require("inquirer")

let caminhoUsuario
let usuario

let voltarMenuPrincipal

const lerDadosUsuario = caminho => {
  let dados = fs.readFileSync(caminho, 'utf8')

  return JSON.parse(dados)
}

function run(username, funcaoMenuPrincipal) {
  console.clear()
  const caminho = path.join("contas", username + ".json")

  if (fs.existsSync(caminho)) {
    caminhoUsuario = caminho
    usuario = username
    voltarMenuPrincipal = funcaoMenuPrincipal
    dashboard()
  } else {
    throw new Exception(chalk.bgRed.white("Usuário não existe!"))
  }
}

function dashboard() {
  console.log(`Conta ativa:
    ${chalk.green(usuario)}
  `)

  inquirer
    .prompt([
      {
        type: "list",
        name: "opcao",
        message: "Selecione a opção desejada:",
        choices: ["Consultar Saldo", "Depositar", "Sacar", "Trocar conta"],
      },
    ])
    .then((respostas) => {
      const resp = respostas["opcao"]

      if (resp === "Consultar Saldo") {
        consultaSaldo()
      } else if (resp === "Depositar") {
        deposita()
      } else if (resp === "Sacar") {
        saca()
      } else {
        console.log(chalk.bgMagenta.green('Voltando para o menu principal'))
        voltarMenuPrincipal()
      }
    })
    .catch((err) => {
      console.log(err)
      voltarMenuPrincipal()
    })
}

function consultaSaldo() {
  console.log("### Consultando saldo ###")

  const dados = lerDadosUsuario(caminhoUsuario)

  console.log(`Saldo da conta: R$ ${dados.saldo.toFixed(2)}\n`)

  dashboard()
}

function deposita() {
  console.log("### Depositando ###")
  //Programe a operação de depósito aqui
  /*Não esqueça de invocar a função dashboard() após a execução
  da operação para o usuário poder continuar operando sua conta */
  dashboard()
}

function saca() {
  console.log("### Sacando ###")
  //Programe a operação de saque aqui
  /*Não esqueça de invocar a função dashboard() após a execução
  da operação para o usuário poder continuar operando sua conta */
  dashboard()
}

module.exports = run