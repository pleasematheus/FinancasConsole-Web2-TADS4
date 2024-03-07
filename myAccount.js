const fs = require('fs')
const path = require('path')

const chalk = require('chalk')
const inquirer = require('inquirer')

let caminhoUsuario
let usuario

let voltarMenuPrincipal

const lerDadosUsuario = caminho => {
  let dados = fs.readFileSync(caminho, 'utf8')

  return JSON.parse(dados)
}

const contaAtiva = _ => {
  console.log(`Conta ativa:
    ${chalk.green(usuario)}
  `)
}

function run(username, funcaoMenuPrincipal) {
  console.clear()
  const caminho = path.join('contas', username + '.json')

  if (fs.existsSync(caminho)) {
    caminhoUsuario = caminho
    usuario = username
    voltarMenuPrincipal = funcaoMenuPrincipal
    dashboard()
  } else {
    throw new Exception(chalk.bgRed.white('Usuário não existe!'))
  }
}

function dashboard() {
  contaAtiva()

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'opcao',
        message: 'Selecione a opção desejada:',
        choices: ['Consultar Saldo', 'Depositar', 'Sacar', 'Trocar conta'],
      },
    ])
    .then((respostas) => {
      const resp = respostas['opcao']

      if (resp === 'Consultar Saldo') {
        console.clear()
        consultaSaldo()
      } else if (resp === 'Depositar') {
        console.clear()
        deposita()
      } else if (resp === 'Sacar') {
        console.clear()
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

function consultaSaldo(returnMenu = true) {
  const dados = lerDadosUsuario(caminhoUsuario)

  console.log(`Saldo da conta: R$ ${dados.saldo.toFixed(2)}\n`)

  if(returnMenu) dashboard()
}

function deposita() {
  inquirer
    .prompt([
      {
        type: 'number',
        name: 'valor',
        message: 'Digite o valor a ser depositado: '
      }
    ])
    .then((input) => {
      let valor = null
      if (input['valor'] > 0) {
        valor = input['valor']

        let dadosUsuario = lerDadosUsuario(caminhoUsuario)
        let valorFinal = dadosUsuario.saldo += input['valor']

        escreverArquivo(valorFinal)
        console.log(chalk.blueBright(`Valor despositado: R$ ${valor.toFixed(2)}`))

        consultaSaldo()
      }
      else{
        console.log('Digite um valor válido!')
        dashboard()
      }
    })
    .catch((e) => {
      console.log(e)
      dashboard()
    })
}

function saca() {
  let returnMenu = false
  contaAtiva()
  consultaSaldo(returnMenu)

  inquirer
    .prompt([
      {
        type: 'number',
        name: 'valor',
        message: 'Digite o valor a ser sacado: '
      }
    ])
    .then((input) => {
      let valor = null
      if (input['valor'] > 0) {
        valor = input['valor']

        let dadosUsuario = lerDadosUsuario(caminhoUsuario)

        if (dadosUsuario.saldo < valor) {
          console.clear()
          console.log('Valor de saque maior que o disponível!')
          consultaSaldo()
        } else {
          let valorFinal = dadosUsuario.saldo -= input['valor']

          escreverArquivo(valorFinal)
          console.log(chalk.blueBright(`Valor sacado: R$ ${valor.toFixed(2)}`))

          consultaSaldo()
        }

      } else {
        console.log('Digite um valor de saque válido')
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

const escreverArquivo = data => {
  let conta = lerDadosUsuario(caminhoUsuario)
  conta.saldo = data

  fs.writeFileSync(caminhoUsuario, JSON.stringify(conta))
}

module.exports = run