let PROCESSOS = []
const criarProcesso = () => {
    const nome = document.getElementById('nome').value
    const tipo = parseInt(document.getElementById('tipo').value)
    const situacao = parseInt(document.getElementById('situacao').value)
    const tombamento = document.getElementById('tombamento').value

    const novoProcesso = {
        nome,
        tipo,
        situacao,
        tombamento
    }
    //console.log(novoProcesso)
    createProcesso(novoProcesso).then(() => {
        alert('Processo registrado')
        window.location = 'index.html'
    })
    //alert('Processo registrado')
    setInterval(() => { }, 3000)

}

const atualizarProcesso = () => {
    const nome = document.getElementById('nome').value
    const tipo = parseInt(document.getElementById('tipo').value)
    const situacao = parseInt(document.getElementById('situacao').value)
    const tombamento = document.getElementById('tombamento').value
    const processo = JSON.parse(localStorage.processo)
    const processoAtualizado = {
        nome,
        tipo,
        situacao,
        tombamento,
        id: processo.processo._id,
    }

    updateProcesso(processoAtualizado)
    alert('Processo Atualizado!')
    window.location = 'index.html'
}

const popularProcessos = () => getProcessos().then(({ data: processos }) => {
    PROCESSOS = processos.processos
    try {
        listarProcessos()
    } catch (err) {
        console.log(err)
    }
})

const processFilter = (tipoDeFiltro, filtro) => {
    let processos = []
    if (tipoDeFiltro === 'filtrar-por-situacao') {
        PROCESSOS.forEach(processo => {
            if (processo.situacao === filtro) processos.push(processo)
        })
    } else if (tipoDeFiltro === 'filtrar-por-tipo') {
        PROCESSOS.forEach(processo => {
            if (processo.tipo === filtro) processos.push(processo)
        })
    }
    return processos
}

const filtarProcessos = () => {
    const situacao = parseInt(document.getElementById('situacao').value)
    const tipo = parseInt(document.getElementById('tipo').value)
    let filtro = ''
    if (situacao !== 0) {
        filtro = situacao
        listarProcessos(true, filtro, 'filtrar-por-situacao')
    }
    else if (tipo !== 0) {
        filtro = tipo
        listarProcessos(true, filtro, 'filtrar-por-tipo')
    }
    else listarProcessos()
}

const listarProcessos = (filtrar = null, filtro, tipoDeFiltro) => {
    let tabela = document.getElementById('lista-de-processos')
    tabela.innerHTML = ''
    let status = ''
    let tipo = ''
    const processos = filtrar ? processFilter(tipoDeFiltro, filtro) : [...PROCESSOS]
    processos.forEach(processo => {
        if (processo.situacao === 1) status = 'Em andamento'
        if (processo.situacao === 2) status = 'Finalizado'
        if (processo.situacao === 3) status = 'Desistiu/Indeferido'
        if (processo.tipo === 1) tipo = 'Aquisição'
        if (processo.tipo === 2) tipo = 'Transferência'
        if (processo.tipo === 3) tipo = 'Porte'
        if (processo.tipo === 4) tipo = '2ª via'
        tabela.innerHTML += `
        <tr>
            <td>${processo.tombamento}</td>
            <td>${processo.nome}</td>
            <td>${tipo}</td>
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
    document.getElementById('tipo').value = parseInt(processo.tipo)
    document.getElementById('situacao').value = parseInt(processo.situacao)
    document.getElementById('tombamento').value = processo.tombamento
}

const totalPorTipoSituacao = (tipo, status) => {
    let total = 0;
    PROCESSOS.forEach(processo => {
        if (processo.tipo === tipo && processo.situacao === status) total++;
    })
    //console.log(tipo)
    return total
}

const totalPorSituacao = situacao => {
    let total = 0;
    PROCESSOS.forEach(processo => {
        if (processo.situacao === situacao) total++;
    })

    return total
}

const totalDeProcessos = tipo => {
    const andamento = totalPorTipoSituacao(tipo, 1)
    const finalizado = totalPorTipoSituacao(tipo, 2)
    const incompleto = totalPorTipoSituacao(tipo, 3)
    const total = andamento + finalizado + incompleto

    const quantidadeDeProcessos = {
        andamento,
        finalizado,
        incompleto,
        total
    }
    return quantidadeDeProcessos
}

const preencherTabelaPorSituacaoETipo = (situacao, tipo, total) => {

    document.getElementById(`${tipo}-${situacao}`).innerHTML = total
}

const preencherRelatorio = () => {
    getProcessos().then(({ data: processos }) => {
        PROCESSOS = processos.processos
        const tiposDeProcessos = ['aquisicao', 'transferencia', 'porte', 'segunda-via']

        tiposDeProcessos.forEach((tipo, idx) => {
            const tipoAtual = totalDeProcessos(idx + 1)
            for (t in tipoAtual) {
                preencherTabelaPorSituacaoETipo(t, tipo, tipoAtual[t])
            }
        })
        grafico()
    })
}

const grafico = () => {
    const andamento = totalPorSituacao(1)
    const finalizado = totalPorSituacao(2)
    const incompleto = totalPorSituacao(3)
    const dados = {
        andamento,
        finalizado,
        incompleto
    }
    criarGrafico(dados)
}

const criarGrafico = (dados) => {
    var ctx = document.getElementById(`chart-total`).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Andamendo', 'Finalizado', 'Desistência/Indeferido'],
            datasets: [{
                label: '# of Votes',
                data: [dados.andamento, dados.finalizado, dados.incompleto],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {}
    });
}