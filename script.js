// Função para renderizar gráficos
function renderCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });

    const chartColors = ['#1e3a8a', '#dc2626', '#059669', '#d97706', '#7c3aed', '#0891b2'];

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
            datalabels: {
                anchor: 'center',
                align: 'center',
                color: '#fff',
                font: { weight: 'bold', size: 15 },
                formatter: (value) => value > 0 ? value : ''
            }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    // Gráfico por Unidade
    const unidadeData = countBy(filteredData, 'unidade');
    charts.unidade = new Chart(document.getElementById('unidadeChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(unidadeData),
            datasets: [{
                data: Object.values(unidadeData),
                backgroundColor: chartColors[0]
            }]
        },
        options: { ...commonOptions, indexAxis: 'y' }
    });

    // NOVO: Gráfico por Vínculo
    const vinculoData = countBy(filteredData, 'vinculo');
    charts.vinculo = new Chart(document.getElementById('vinculoChart'), {
        type: 'bar', // Gráfico de barras vertical
        data: {
            labels: Object.keys(vinculoData),
            datasets: [{
                label: 'Total por Vínculo',
                data: Object.values(vinculoData),
                backgroundColor: '#059669' // Cor verde escuro
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: { beginAtZero: true }
            }
        }
    });

    // Gráfico por Função (COM LEGENDA HORIZONTAL)
    const funcaoData = countBy(filteredData, 'funcao');
    charts.funcao = new Chart(document.getElementById('funcaoChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(funcaoData),
            datasets: [{
                data: Object.values(funcaoData),
                backgroundColor: chartColors[1]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
                datalabels: {
                    anchor: 'center',
                    align: 'center',
                    rotation: 0, // <-- ALTERAÇÃO AQUI: de 90 para 0
                    color: '#fff',
                    font: { weight: 'bold', size: 16 },
                    formatter: (value) => value > 0 ? value : ''
                }
            },
            scales: {
                x: { 
                    beginAtZero: true,
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: { beginAtZero: true }
            }
        }
    });

    // Gráfico por Carga Horária
    const cargaHorariaData = countBy(filteredData, 'cargaHoraria');
    charts.cargaHoraria = new Chart(document.getElementById('cargaHorariaChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(cargaHorariaData),
            datasets: [{
                data: Object.values(cargaHorariaData),
                backgroundColor: chartColors
            }]
        },
        options: { ...commonOptions, plugins: { ...commonOptions.plugins, legend: { display: true, position: 'bottom', labels: { font: { size: 16 } } } } }
    });

    // Gráfico por Turno
    const turnoData = countBy(filteredData, 'turno');
    charts.turno = new Chart(document.getElementById('turnoChart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(turnoData),
            datasets: [{
                data: Object.values(turnoData),
                backgroundColor: chartColors
            }]
        },
        options: { ...commonOptions, plugins: { ...commonOptions.plugins, legend: { display: true, position: 'bottom', labels: { font: { size: 16 } } } } }
    });

    // Gráfico por Situação Funcional
    const situacaoFuncionalData = countBy(filteredData, 'situacaoFuncional');
    charts.situacaoFuncional = new Chart(document.getElementById('situacaoFuncionalChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(situacaoFuncionalData),
            datasets: [{
                data: Object.values(situacaoFuncionalData),
                backgroundColor: chartColors[4]
            }]
        },
        options: commonOptions
    });

    // Gráfico por Situação Atual
    const situacaoAtualData = countBy(filteredData, 'situacaoAtual');
    charts.situacaoAtual = new Chart(document.getElementById('situacaoAtualChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(situacaoAtualData),
            datasets: [{
                data: Object.values(situacaoAtualData),
                backgroundColor: chartColors[5]
            }]
        },
        options: commonOptions
    });
}
