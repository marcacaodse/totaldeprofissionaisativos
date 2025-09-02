// Registrar plugin do Chart.js
Chart.register(ChartDataLabels);

// URL da planilha do Google Sheets
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1RGc_C7ABlb5hsGrVLgpZWmpdKjelyd6t06M1Ddl-VvU/gviz/tq?tqx=out:json';

let profissionaisData = [];
let filteredData = [];
let charts = {};

// Função para carregar dados do Google Sheets
async function loadGoogleSheetsData( ) {
    try {
        const response = await fetch(SHEET_URL);
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        
        if (json.table && json.table.rows) {
            const headers = json.table.cols.map(col => col.label);
            const rows = json.table.rows.map(row => {
                const obj = {};
                row.c.forEach((cell, index) => {
                    obj[headers[index]] = cell ? cell.v : '';
                });
                return obj;
            });
            
            profissionaisData = rows.map(row => ({
                nome: row['Nome'] || '',
                unidade: row['Unidades de Saúde'] || '',
                equipe: row['Equipes'] || '',
                funcao: row['Função'] || '',
                cargaHoraria: row['Carga Horária'] || '',
                turno: row['Turno'] || '',
                situacaoFuncional: row['Situação Funcional'] || '',
                situacaoAtual: row['Situação atual'] || '',
                vinculo: row['Vinculo'] || '',
                status: 'Ativo'
            }));
            
            filteredData = [...profissionaisData];
            updateDashboard();
        }
    } catch (error) {
        console.error('Erro ao carregar dados do Google Sheets:', error);
        alert('Não foi possível carregar os dados da planilha. Verifique o link e as permissões de compartilhamento.');
    }
}

// Função para atualizar o painel
function updateDashboard() {
    updateFilters();
    applyFilters();
}

// Função para atualizar filtros
function updateFilters() {
    const unidades = [...new Set(profissionaisData.map(p => p.unidade))].filter(u => u).sort();
    const equipes = [...new Set(profissionaisData.map(p => p.equipe))].filter(e => e).sort();
    const funcoes = [...new Set(profissionaisData.map(p => p.funcao))].filter(f => f).sort();
    const cargasHorarias = [...new Set(profissionaisData.map(p => p.cargaHoraria))].filter(c => c).sort();
    const turnos = [...new Set(profissionaisData.map(p => p.turno))].filter(t => t).sort();
    const situacoesFuncionais = [...new Set(profissionaisData.map(p => p.situacaoFuncional))].filter(s => s).sort();
    const situacoesAtuais = [...new Set(profissionaisData.map(p => p.situacaoAtual))].filter(s => s).sort();
    const vinculos = [...new Set(profissionaisData.map(p => p.vinculo))].filter(v => v).sort();

    updateSelectOptions('unidadeFilter', unidades);
    updateSelectOptions('equipeFilter', equipes);
    updateSelectOptions('funcaoFilter', funcoes);
    updateSelectOptions('cargaHorariaFilter', cargasHorarias);
    updateSelectOptions('turnoFilter', turnos);
    updateSelectOptions('situacaoFuncionalFilter', situacoesFuncionais);
    updateSelectOptions('situacaoAtualFilter', situacoesAtuais);
    updateSelectOptions('vinculoFilter', vinculos);
}

function updateSelectOptions(selectId, options) {
    const select = document.getElementById(selectId);
    const currentValue = select.value;
    
    select.innerHTML = '<option value="">Todas</option>';
    
    options.forEach(option => {
        if (option) {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        }
    });
    
    if (options.includes(currentValue)) {
        select.value = currentValue;
    }
}

// Função para aplicar filtros
function applyFilters() {
    const filters = {
        unidade: document.getElementById('unidadeFilter').value,
        equipe: document.getElementById('equipeFilter').value,
        funcao: document.getElementById('funcaoFilter').value,
        cargaHoraria: document.getElementById('cargaHorariaFilter').value,
        turno: document.getElementById('turnoFilter').value,
        situacaoFuncional: document.getElementById('situacaoFuncionalFilter').value,
        situacaoAtual: document.getElementById('situacaoAtualFilter').value,
        vinculo: document.getElementById('vinculoFilter').value
    };

    filteredData = profissionaisData.filter(prof => {
        return Object.keys(filters).every(key => {
            return !filters[key] || prof[key] === filters[key];
        });
    });

    updateStats();
    renderCharts();
    renderTable();
}

// Função para atualizar estatísticas
function updateStats() {
    document.getElementById('totalProfissionais').textContent = filteredData.length;
    document.getElementById('totalUnidades').textContent = [...new Set(filteredData.map(p => p.unidade))].filter(u => u).length;
    document.getElementById('totalEquipes').textContent = [...new Set(filteredData.map(p => p.equipe))].filter(e => e).length;
    document.getElementById('totalFuncoes').textContent = [...new Set(filteredData.map(p => p.funcao))].filter(f => f).length;
}

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
        type: 'bar',
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
                    rotation: 0, // Legenda na horizontal
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

// Função para renderizar a tabela
function renderTable() {
    const tableBody = document.getElementById('profissionaisTable').querySelector('tbody');
    tableBody.innerHTML = '';

    filteredData.forEach(prof => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${prof.nome}</td>
            <td>${prof.unidade}</td>
            <td>${prof.equipe}</td>
            <td>${prof.funcao}</td>
            <td>${prof.cargaHoraria}</td>
            <td>${prof.turno}</td>
            <td>${prof.situacaoFuncional}</td>
            <td>${prof.situacaoAtual}</td>
            <td>${prof.vinculo}</td>
            <td><span class="badge badge-success">${prof.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Função auxiliar para contagem
function countBy(data, key) {
    return data.reduce((acc, item) => {
        const group = item[key] || 'Não informado';
        acc[group] = (acc[group] || 0) + 1;
        return acc;
    }, {});
}

// Função para limpar filtros
function clearFilters() {
    document.querySelectorAll('.filter-select').forEach(select => {
        select.value = '';
    });
    applyFilters();
}

// Função para baixar como Excel
function downloadExcel() {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Profissionais');
    XLSX.writeFile(workbook, 'profissionais_filtrados.xlsx');
}

// Função para atualizar dados (botão)
function updateData() {
    loadGoogleSheetsData();
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', applyFilters);
    });
    loadGoogleSheetsData();
});
