const Graphql = {
    endpoint: 'https://glacial-lowlands-37327.herokuapp.com/',
    exec: (query, variaveis) => {
        return fetch(Graphql.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, variables: variaveis })
        })
            .then(resposta => resposta.json())
            .catch(err => { console.log(err) })
    }
}

const getProcessos = () => {
    const query = `
        query {
            processos {
                _id
                nome
                tipo
                situacao
                tombamento
            }
        }
    `
    return Graphql.exec(query)
}
const createProcesso = novoProcesso => {
    const query = `
        mutation (
            $nome: String!,
            $tipo: String!,
            $situacao: String!
            $tombamento: String!
        ) {
            createProcesso (data: {
                nome: $nome
                tipo: $tipo
                situacao: $situacao
                tombamento: $tombamento
            }) {
                _id
                nome
            }
        }
    `
    Graphql.exec(query, novoProcesso)
        .then(data => console.log(data))
        .catch(erro => alert(erro))
}

const updateProcesso = ProcessoAtualizado => {
    const query = `
        mutation (
            $nome: String!,
            $tipo: String!,
            $situacao: String!
            $tombamento: String!
        ) {
            updateProcesso (data: {
                nome: $nome
                tipo: $tipo
                situacao: $situacao
                tombamento: $tombamento
            }) {
                _id
                nome
            }
        }
    `
    Graphql.exec(query, ProcessoAtualizado)
        .then(data => {
            console.log(data)
        })
        .catch(erro => alert(erro))
}

const find = id => {
    
    query = `
        query {
         processo(id: "${id}") {
            nome
            tipo
            situacao
            tombamento
         }   
        }
    `
    console.log(query)
    return Graphql.exec(query)
        .then(({ data: processo }) => {
            localStorage.setItem('processo', JSON.stringify(processo))
            window.location = 'edit.html'
        })
        .catch(erro => alert(erro))
}