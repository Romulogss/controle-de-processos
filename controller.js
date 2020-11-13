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
    //console.log(situacao)
    createProcesso(novoProcesso)
    alert('Processo registrado')
    window.location = 'index.html'
}

const atualizarProcesso = () => {
    const nome = document.getElementById('nome').value
    const tipo = document.getElementById('tipo').value
    const situacao = document.getElementById('situacao').value
    const tombamento = document.getElementById('tombamento').value
    const processo = JSON.parse(localStorage.processo)
    const novoProcesso = {
        nome,
        tipo,
        situacao,
        tombamento,
        id: processo.processo._id,
    }

    //console.log(novoProcesso)
    updateProcesso(novoProcesso)
    alert('Processo Atualizado!')
    window.location = 'index.html'
}

const popularProcessos = () => getProcessos().then(({ data: processos }) => {
    PROCESSOS = processos.processos
    listarProcessos()
})

const processFilter = situacao => {
    let processos = []
    PROCESSOS.forEach(processo => {
        if (processo.situacao === situacao) processos.push(processo)
    })

    return processos
}

const listarProcessos = (filtrar = null, situacao) => {
    let tabela = document.getElementById('lista-de-processos')
    tabela.innerHTML = ''
    let status = ''
    const processos = filtrar ? processFilter(situacao) : [...PROCESSOS]
    processos.forEach(processo => {
        if (processo.situacao == 1) status = 'Em andamento'
        if (processo.situacao == 2) status = 'Documento já entregue'
        if (processo.situacao == 3) status = 'Desistiu'
        if (processo.situacao == 4) status = 'Indeferido'
        tabela.innerHTML += `
        <tr>
            <td>${processo.tombamento}</td>
            <td>${processo.nome}</td>
            <td>${processo.tipo}</td>
            <td>${status}</td>
            <td class="text-center"><button class="btn btn-primary" onclick="find('${processo._id}')"><i class="fas fa-edit"></i></button></td>
        </tr>`
    })
    const total = processos.length
    document.getElementById('total').innerHTML = total
}

const preencherFormEdicao = () => {
    let processo = JSON.parse(localStorage.processo)
    processo = processo.processo
    document.getElementById('nome').value = processo.nome
    document.getElementById('tipo').value = processo.tipo
    document.getElementById('situacao').value = processo.situacao
    document.getElementById('tombamento').value = processo.tombamento
}

const filtarProcessos = () => {
    let situacao = document.getElementById('situacao').value
    if (situacao !== "") listarProcessos(true, situacao)
    else listarProcessos()
}

const totalPorTipoSituacao = (tipo, status) => {
    let total = 0;
    PROCESSOS.forEach(processo => {
        if (processo.tipo === tipo && processo.situacao === status) total++;
    })

    return total
}

const totalDeProcessos = tipo => {
    const andamento = totalPorTipoSituacao(tipo, 1)
    const finalizado = totalPorTipoSituacao(tipo, 2)
    const desistencia = totalPorTipoSituacao(tipo, 3)
    const indeferido = totalPorTipoSituacao(tipo, 4)
    const total = andamento + finalizado + desistencia + indeferido

    const quantidadeDeProcessos = {
        andamento,
        finalizado,
        desistencia,
        indeferido,
        total
    }
    return quantidadeDeProcessos
}

const preencherTabelaPorSituacaoETipo = (situacao, tipo, total) => {
    document.getElementById(`${tipo}-${situacao}`).innerHTML = total
}

const preencherRelatorio = () => {
    const tiposDeProcessos = ['aquisicao', 'transferencia', 'porte', 'segunda-via']
    tiposDeProcessos.forEach(tipo => {
        const tipoAtual = totalDeProcessos(tipo)
        for(t in tipoAtual) {
            preencherTabelaPorSituacaoETipo(tipo, t, tipoAtual[t])
        }
    })
}