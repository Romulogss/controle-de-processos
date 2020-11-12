let PROCESSOS = []
const criarProcesso = () => {
    const nome = document.getElementById('nome').value
    const tipo = document.getElementById('tipo').value
    const situacao = document.getElementById('situacao').value
    const tombamento = document.getElementById('tombamento').value

    const novoProcesso = {
        nome,
        tipo,
        situacao,
        tombamento
    }

    createProcesso(novoProcesso)
    alert('Processo registrado')
}

const atualizarProcesso = () => {
    const nome = document.getElementById('nome').value
    const tipo = document.getElementById('tipo').value
    const situacao = document.getElementById('situacao').value
    const tombamento = document.getElementById('tombamento').value

    const novoProcesso = {
        nome,
        tipo,
        situacao,
        tombamento
    }

    updateProcesso(novoProcesso)
    alert('Processo registrado')
}

const popularProcessos = () => getProcessos().then(({ data: processos }) => {
    PROCESSOS = processos.processos
    listarProcessos()
})

const listarProcessos = () => {
    let tabela = document.getElementById('lista-de-processos')
    PROCESSOS.forEach(processo => {
        tabela.innerHTML += `
        <tr>
            <td>${processo.tombamento}</td>
            <td>${processo.nome}</td>
            <td>${processo.tipo}</td>
            <td>${processo.situacao}</td>
            <td><button class="btn btn-primary" onclick="find('${processo._id}')"><i class="fas fa-edit"></i></button></td>
        </tr>`
    })
}

const preencherFormEdicao = () => {
    processo = JSON.parse(localStorage.processo)
    processo = processo.processo
    document.getElementById('nome').value = processo.nome
    document.getElementById('tipo').value = processo.tipo
    document.getElementById('situacao').value = processo.situacao
    document.getElementById('tombamento').value = processo.tombamento
}