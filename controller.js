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
    createProcesso(novoProcesso).then(({ data: { createProcesso: tombamento } }) => {
        alert(`Processo ${tombamento} registrado!`)
        window.location = 'index.html'
    })

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

    updateProcesso(processoAtualizado).then(res => {
        alert(`Processo Atualizado!`)
        window.location = 'index.html'
    }).catch(err => console.log(err))
}

const popularProcessos = (pagina = 0) => {
    localStorage.setItem('pageAtual', pagina)
    paginacao()
    getProcessos(pagina).then(({ data: { processos: processos } }) => {
        try {
            listarProcessos(processos)
        } catch (err) {
            console.log(err)
        }
    })
}

const buscarPorTombamento = tombamento => {
    tombamento = tombamento.trim()
    if (tombamento !== "") {
        findByTombamento(tombamento).then(({ data: { processosPorTombamento } }) => {
            listarProcessos(processosPorTombamento)
        })
    }
}

const filtarProcessos = () => {
    const situacao = parseInt(document.getElementById('situacao').value)
    const tipo = parseInt(document.getElementById('tipo').value)
    if (situacao !== 0) {
        filtro = situacao
        findBySituacao(situacao).then(({ data: { processosPorSituacao: processosPorSituacao } }) => {
            listarProcessos(processosPorSituacao)
        })
    }
    else if (tipo !== 0) {
        findByTipo(tipo).then(({ data: { processosPorTipo: processosPorTipo } }) => {
            listarProcessos(processosPorTipo)
        })
    }
    else popularProcessos()
}

const paginacao = () => {
    totalBySituacao().then(({ data: { totalDeProcessosPorSituacao: { total } } }) => {
        const pages = Math.ceil(total / 25)
        const pageAtual = parseInt(localStorage.pageAtual)
        console.log(localStorage.pageAtual)
        let navPaginacao = `
        <nav aria-label="Page navigation example" style="text-align: center;">
                <ul class="pagination" style="text-align: center;">
                    <li class="page-item" >
                        <a class="page-link" aria-label="Previous" onclick="popularProcessos(0)" href="#topo">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                        </a>
                    </li>
        `
        let i = 0
        let ultimaPage = 9
        if(pageAtual > 5) {
            i = pageAtual - 5
            ultimaPage = (pageAtual + 5) > pages ? pages : (pageAtual + 5)
            console.log(i + ultimaPage)
            if((i + ultimaPage) <= 10) {
                i=0
                ultimaPage = 10
            }
        }

        for (i; i < ultimaPage; i++) {
            navPaginacao += `<li class="page-item"><a class="page-link" onclick="popularProcessos(${i})" href="#topo">${i + 1}</a></li>`
        }
        navPaginacao += `
        <li class="page-item">
                        <a class="page-link" href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span class="sr-only">Next</span>
                        </a>
                    </li>
                </ul>
            </nav>
        `
        document.getElementById('paginas').innerHTML = navPaginacao
    })
}

const listarProcessos = (processos) => {
    let tabela = document.getElementById('lista-de-processos')
    tabela.innerHTML = ''
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
            <td class="text-center"><button class="btn btn-primary" onclick="findById('${processo._id}')"><i class="fas fa-edit"></i></button></td>
        </tr>`
    })
    const total = processos.length
    document.getElementById('total').innerHTML = total
    paginacao()
}

const preencherFormEdicao = () => {
    let processo = JSON.parse(localStorage.processo)
    processo = processo.processo
    document.getElementById('nome').value = processo.nome
    document.getElementById('tipo').value = parseInt(processo.tipo)
    document.getElementById('situacao').value = parseInt(processo.situacao)
    document.getElementById('tombamento').value = processo.tombamento
}

const totalDeProcessos = tipo => {
    let quantidadeDeProcessos = {}
    totalByTipoESituacao(tipo).then(({ data: { totalDeSituacaoPorTipo: totalDeSituacaoPorTipo } }) => {
        quantidadeDeProcessos = totalDeSituacaoPorTipo
        return quantidadeDeProcessos
    })
    return quantidadeDeProcessos
}

const preencherTabelaPorSituacaoETipo = (situacao, tipo, total) => {
    document.getElementById(`${tipo}-${situacao}`).innerHTML = total
}

const preencherRelatorio = () => {
    const tiposDeProcessos = ['aquisicao', 'transferencia', 'porte', 'segunda-via']

    tiposDeProcessos.forEach((tipo, idx) => {
        totalByTipoESituacao(idx + 1).then(({ data: { totalDeSituacaoPorTipo: totalDeSituacaoPorTipo } }) => {
            const tipoAtual = totalDeSituacaoPorTipo
            for (t in tipoAtual) {
                preencherTabelaPorSituacaoETipo(t, tipo, tipoAtual[t])
            }
        })
    })
    instanciarGrafico()
}

const instanciarGrafico = () => {
    totalBySituacao().then(({ data: { totalDeProcessosPorSituacao: totalDeProcessosPorSituacao } }) => {
        montarGrafico(totalDeProcessosPorSituacao)
    })

}

const montarGrafico = (dados) => {
    var ctx = document.getElementById(`chart-total`).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
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