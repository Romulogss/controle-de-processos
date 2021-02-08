const Graphql = {
    endpoint: 'http://control-guns.herokuapp.com/',
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

const getProcessos = pagina => {
    pagina = pagina
    const query = `
        query {
            processos(data: ${pagina}) {
                processos {
                    _id
                    nome
                    tipo
                    situacao
                    tombamento
                }
                paginacao {
                    totalDeProcessos
                    paginaAtual
                    totalDePaginas
                }
            }
        }
    `
    return Graphql.exec(query)
}
const createProcesso = novoProcesso => {
    const query = `
        mutation (
            $nome: String!,
            $tipo: Int!,
            $situacao: Int!
            $tombamento: String!
        ) {
            createProcesso (data: {
                nome: $nome
                tipo: $tipo
                situacao: $situacao
                tombamento: $tombamento
            }) {
                tombamento
            }
        }
    `
    return Graphql.exec(query, novoProcesso)
}

const updateProcesso = ProcessoAtualizado => {
    const query = `
        mutation (
            $nome: String!,
            $tipo: Int!,
            $situacao: Int!
            $tombamento: String!
            $id: ID
        ) {
            updateProcesso (data: {
                nome: $nome
                tipo: $tipo
                situacao: $situacao
                tombamento: $tombamento
                _id: $id
            }) {
                situacao
            }
        }
    `
    return Graphql.exec(query, ProcessoAtualizado)
}

//MÉTODOS DE BUSCA
const findByTombamento = tombamento => {
    const query = `
        query {
            processosPorTombamento(data: "${tombamento}") {
                _id
                nome
                tipo
                situacao
                tombamento
            }
        }
    `
    console.log(query)
    return Graphql.exec(query)
}

const findById = id => {
    const query = `
        query {
         processo(id: "${id}" ) {
            _id
            nome
            tipo
            situacao
            tombamento
         }   
        }
    `
    // console.log(query)
    return Graphql.exec(query)
        .then(({ data: processo }) => {
            localStorage.setItem('processo', JSON.stringify(processo))
            window.location = 'edit.html'
        })
        .catch(erro => alert(erro))
}

const findBySituacao = dadosDaBusca => {
    const query = `
        query {
            processosPorSituacao(data: {situacao: ${dadosDaBusca.situacao}, page: ${dadosDaBusca.page}}) {
                processos {
                    _id
                    nome
                    tipo
                    situacao
                    tombamento
                }
                paginacao {
                    totalDeProcessos
                    paginaAtual
                    totalDePaginas
                }
            }
        }
    `
    return Graphql.exec(query)
}

const findByTipo = dadosDaBusca => {
    const query = `
        query {
            processosPorTipo(data: {tipo: ${dadosDaBusca.tipo}, page: ${dadosDaBusca.page}}) {
                processos {
                    _id
                    nome
                    tipo
                    situacao
                    tombamento
                }
                paginacao {
                    totalDeProcessos
                    paginaAtual
                    totalDePaginas
                }
            }
        }
    `
    return Graphql.exec(query)
}

const findByTipoESituacao = tipoIdESituacaoId => {
    const query = `
        query {
            processosPorTipoESituacao(data: ${tipoIdESituacaoId}) {
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

const totalByTipo = tipoId => {
    tipoId = parseInt(tipoId)
    const query = `
        query {
            totalDeProcessosPorTipo(data: ${tipoId}) {
                total
            }
        }
    `
    return Graphql.exec(query)
}

const totalBySituacao = () => {
    const query = `
        query {
            totalDeProcessosPorSituacao {
                andamento
                finalizado
                incompleto
                total
            }
        }
    `
    return Graphql.exec(query)
}

const totalByTipoESituacao = tipoId => {
    tipoId = parseInt(tipoId)
    const query = `
        query {
            totalDeSituacaoPorTipo(data: ${tipoId}) {
                andamento
                finalizado
                incompleto
                total
            }
        }
    `
    return Graphql.exec(query)
}
