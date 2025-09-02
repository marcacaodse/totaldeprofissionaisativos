// Registrar plugin do Chart.js
Chart.register(ChartDataLabels);

// URL da planilha do Google Sheets
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1RGc_C7ABlb5hsGrVLgpZWmpdKjelyd6t06M1Ddl-VvU/gviz/tq?tqx=out:json';

let profissionaisData = [];
let filteredData = [];
let charts = {};
let choicesInstances = {}; // Armazena as instâncias dos filtros Choices.js

// Função para inicializar os filtros de múltipla seleção
function initializeChoices( ) {
    const filterElements = document.querySelectorAll('.filter-select');
    filterElements.forEach(selectElement => {
        choicesInstances[selectElement.id] = new Choices(selectElement, {
            removeItemButton: true,
            placeholder: true,
            placeholderValue: 'Selecione uma ou mais opções',
            allowHTML: true,
        });
        // Adiciona o evento de mudança para aplicar os filtros
        selectElement.addEventListener('change', applyFilters);
    });
}

// Função para carregar dados do Google Sheets
async function loadGoogleSheetsData() {
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
                cargaHoraria: String(row['Carga Horária']) || '', // Garante que seja string
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

// Função para atualizar as opções dos filtros
function updateFilters() {
    const filterKeys = ['unidade', 'equipe', 'funcao', 'cargaHoraria', 'turno', 'situacaoFuncional', 'situacaoAtual', 'vinculo'];
    
    filterKeys.forEach(key => {
        const selectId = `${key}Filter`;
        const options = [...new Set(profissionaisData.map(p => p[key]))].filter(Boolean).sort();
        const choicesInstance = choicesInstances[selectId];
        
        if (choicesInstance) {
            choicesInstance.clearStore(); // Limpa opções antigas
            const choicesOptions = options.map(option => ({ value: option, label: option }));
            choicesInstance.setChoices(choicesOptions, 'value', 'label', false);
        }
    });
}

// Função para aplicar filtros (MODIFICADA PARA MÚLTIPLA SELEÇÃO)
function applyFilters() {
    const filters = {};
    Object.keys(choicesInstances).forEach(id => {
        const key = id.replace('Filter', '');
        // Pega os valores selecionados do Choices.js
        filters[key] = choicesInstances[id].getValue(true);
    });

    filteredData = profissionaisData.filter(prof => {
        return Object.keys(filters).every(key => {
            const selectedValues = filters[key];
            // Se não há seleção, não filtra por essa chave
            if (selectedValues.length === 0) {
                return true;
            }
            // Verifica se o valor do profissional está incluído nos valores selecionados
            return selectedValues.includes(prof[key]);
        });
    });

    updateStats();
    renderCharts();
    renderTable();
    document.getElementById('tableSearch').value = '';
}

// Função para limpar filtros (MODIFICADA)
function clearFilters() {
    Object.values(choicesInstances).forEach(instance => {
        instance.clearInput();
        instance.removeActiveItems();
    });
    // A função applyFilters() já será chamada pelo evento 'change'
}

// Função para atualizar estatísticas
function updateStats() {
    document.getElementById('totalProfissionais').textContent = filteredData.length;
    document.getElementById('totalUnidades').textContent = [...new Set(filteredData.map(p => p.unidade))].filter(Boolean).length;
    document.getElementById('totalEquipes').textContent = [...new Set(filteredData.map(p => p.equipe))].filter(Boolean).length;
    document.getElementById('totalFuncoes').textContent = [...new Set(filteredData.map(p => p.funcao))].filter(Boolean).length;
}

// Função para renderizar gráficos (sem alterações na lógica interna)
function renderCharts() {
    Object.values(charts).forEach(chart => { if (chart) chart.destroy(); });
    const chartColors = ['#1e3a8a', '#dc2626', '#059669', '#d97706', '#7c3aed', '#0891b2'];
    const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: true }, datalabels: { anchor: 'center', align: 'center', color: '#fff', font: { weight: 'bold', size: 15 }, formatter: (value) => value > 0 ? value : '' } }, scales: { y: { beginAtZero: true } } };
    const unidadeData = countBy(filteredData, 'unidade');
    charts.unidade = new Chart(document.getElementById('unidadeChart'), { type: 'bar', data: { labels: Object.keys(unidadeData), datasets: [{ data: Object.values(unidadeData), backgroundColor: chartColors[0] }] }, options: { ...commonOptions, indexAxis: 'y' } });
    const vinculoData = countBy(filteredData, 'vinculo');
    charts.vinculo = new Chart(document.getElementById('vinculoChart'), { type: 'bar', data: { labels: Object.keys(vinculoData), datasets: [{ label: 'Total por Vínculo', data: Object.values(vinculoData), backgroundColor: '#059669' }] }, options: { ...commonOptions, scales: { x: { beginAtZero: true, ticks: { maxRotation: 45, minRotation: 45 } }, y: { beginAtZero: true } } } });
    const funcaoData = countBy(filteredData, 'funcao');
    charts.funcao = new Chart(document.getElementById('funcaoChart'), { type: 'bar', data: { labels: Object.keys(funcaoData), datasets: [{ data: Object.values(funcaoData), backgroundColor: chartColors[1] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: true }, datalabels: { anchor: 'center', align: 'center', rotation: 0, color: '#fff', font: { weight: 'bold', size: 16 }, formatter: (value) => value > 0 ? value : '' } }, scales: { x: { beginAtZero: true, ticks: { maxRotation: 45, minRotation: 45 } }, y: { beginAtZero: true } } } });
    const cargaHorariaData = countBy(filteredData, 'cargaHoraria');
    charts.cargaHoraria = new Chart(document.getElementById('cargaHorariaChart'), { type: 'bar', data: { labels: Object.keys(cargaHorariaData), datasets: [{ data: Object.values(cargaHorariaData), backgroundColor: chartColors }] }, options: { ...commonOptions, plugins: { ...commonOptions.plugins, legend: { display: true, position: 'bottom', labels: { font: { size: 16 } } } } } });
    const turnoData = countBy(filteredData, 'turno');
    charts.turno = new Chart(document.getElementById('turnoChart'), { type: 'doughnut', data: { labels: Object.keys(turnoData), datasets: [{ data: Object.values(turnoData), backgroundColor: chartColors }] }, options: { ...commonOptions, plugins: { ...commonOptions.plugins, legend: { display: true, position: 'bottom', labels: { font: { size: 16 } } } } } });
    const situacaoFuncionalData = countBy(filteredData, 'situacaoFuncional');
    charts.situacaoFuncional = new Chart(document.getElementById('situacaoFuncionalChart'), { type: 'bar', data: { labels: Object.keys(situacaoFuncionalData), datasets: [{ data: Object.values(situacaoFuncionalData), backgroundColor: chartColors[4] }] }, options: commonOptions });
    const situacaoAtualData = countBy(filteredData, 'situacaoAtual');
    charts.situacaoAtual = new Chart(document.getElementById('situacaoAtualChart'), { type: 'bar', data: { labels: Object.keys(situacaoAtualData), datasets: [{ data: Object.values(situacaoAtualData), backgroundColor: chartColors[5] }] }, options: commonOptions });
}

// Função para renderizar a tabela
function renderTable() {
    const tableBody = document.getElementById('profissionaisTable').querySelector('tbody');
    tableBody.innerHTML = '';
    filteredData.forEach(prof => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${prof.nome}</td><td>${prof.unidade}</td><td>${prof.equipe}</td><td>${prof.funcao}</td><td>${prof.cargaHoraria}</td><td>${prof.turno}</td><td>${prof.situacaoFuncional}</td><td>${prof.situacaoAtual}</td><td>${prof.vinculo}</td><td><span class="badge badge-success">${prof.status}</span></td>`;
        tableBody.appendChild(row);
    });
}

// Função para filtrar a tabela com base na pesquisa
function filterTable() {
    const searchTerm = document.getElementById('tableSearch').value.toLowerCase();
    const tableRows = document.getElementById('profissionaisTable').querySelector('tbody').querySelectorAll('tr');
    tableRows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(searchTerm) ? '' : 'none';
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
    initializeChoices(); // Inicia os filtros de múltipla seleção
    document.getElementById('tableSearch').addEventListener('keyup', filterTable);
    loadGoogleSheetsData();
});
