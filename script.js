<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Distrito Sanitário Eldorado - Total de Profissionais Ativos nas Unidades</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <style>
        :root {
            --primary-color: #2c3e50;
            --secondary-color: #3498db;
            --accent-color: #e74c3c;
            --success-color: #27ae60;
            --warning-color: #f39c12;
            --light-gray: #f8f9fa;
            --dark-gray: #6c757d;
        }

        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100% );
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }

        .dashboard-container {
            background: rgba(255, 255, 255, 0.98);
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            padding: 30px;
            max-width: 1400px;
            margin: 0 auto;
            backdrop-filter: blur(10px);
        }

        .header-section {
            background: linear-gradient(135deg, #1a2b3c 0%, #2a7abf 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
        }

        .header-section::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .header-content {
            position: relative;
            z-index: 2;
        }

        .main-title {
            font-size: 2.2rem;
            font-weight: bold;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .subtitle {
            font-size: 1.1rem;
            margin: 10px 0;
            opacity: 0.9;
        }

        .director-info {
            font-size: 1rem;
            margin: 10px 0;
            font-weight: 600;
        }

        .signature {
            font-size: 0.85rem;
            color: #bdc3c7;
            margin-top: 15px;
            font-style: italic;
        }

        .filters-section {
            background: white;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            border: 1px solid #e9ecef;
        }

        .filter-group {
            margin-bottom: 20px;
        }

        .filter-label {
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 8px;
            display: block;
        }

        .filter-select {
            width: 100%;
            padding: 10px 15px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            background: white;
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }

        .filter-select:focus {
            outline: none;
            border-color: var(--secondary-color);
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .btn-action {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            cursor: pointer;
            color: white;
        }

        .btn-update {
            background: var(--secondary-color);
            color: white;
        }

        .btn-clear {
            background: var(--warning-color);
            color: white;
        }

        .btn-download {
            background: var(--success-color);
            color: white;
        }

        .btn-action:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            color: white;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            border: 1px solid #e9ecef;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 0.9rem;
            color: var(--dark-gray);
            font-weight: 500;
        }

        .charts-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }

        .chart-container {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            border: 1px solid #e9ecef;
        }

        .chart-full-width {
            grid-column: 1 / -1;
        }

        .chart-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 20px;
            text-align: center;
        }

        .chart-wrapper {
            position: relative;
            height: 400px;
            width: 100%;
        }

        .chart-large {
            height: 500px;
        }

        .data-table {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            border: 1px solid #e9ecef;
            margin-bottom: 30px;
        }

        .table-header {
            background: var(--primary-color);
            color: white;
            padding: 20px;
            font-size: 1.2rem;
            font-weight: 600;
        }

        .table-content {
            padding: 20px;
        }

        .table-wrapper {
            overflow-x: auto;
            max-height: 600px;
            overflow-y: auto;
            border: 1px solid #e9ecef;
            border-radius: 8px;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
            min-width: 1000px;
        }

        .table th {
            background: var(--light-gray);
            color: var(--primary-color);
            font-weight: 600;
            border: 1px solid #e9ecef;
            padding: 12px;
            text-align: left;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .table td {
            padding: 10px 12px;
            border: 1px solid #e9ecef;
            white-space: nowrap;
        }

        .table tbody tr:hover {
            background: rgba(52, 152, 219, 0.05);
        }

        .badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .badge-success {
            background: var(--success-color);
            color: white;
        }

        .badge-warning {
            background: var(--warning-color);
            color: white;
        }

        .badge-danger {
            background: var(--accent-color);
            color: white;
        }

        @media print {
            body {
                background: white !important;
                padding: 0 !important;
            }
            
            .dashboard-container {
                box-shadow: none !important;
                border-radius: 0 !important;
                padding: 20px !important;
            }
            
            .header-section::before {
                display: none !important;
            }
        }

        @media (max-width: 1200px) {
            .charts-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .main-title {
                font-size: 1.8rem;
            }
            
            .dashboard-container {
                padding: 20px;
                margin: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Header -->
        <div class="header-section">
            <div class="header-content">
                <h1 class="main-title">Distrito Sanitário Eldorado</h1>
                <p class="subtitle">Total de Profissionais Ativos nas Unidades</p>
                <p class="director-info">Diretora: Wandha Karine dos Santos</p>
                <div class="signature">
                    Painel Criado por Ana P. A. Silva Matr. 201704/ Ref. Vivver / Distrito Sanitário Eldorado
                </div>
            </div>
        </div>

        <!-- Filtros -->
        <div class="filters-section">
            <h3 class="mb-4"><i class="fas fa-filter"></i> Filtros de Dados</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="filter-group">
                    <label class="filter-label">Unidades de Saúde:</label>
                    <select class="filter-select" id="unidadeFilter">
                        <option value="">Todas as Unidades</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Equipes:</label>
                    <select class="filter-select" id="equipeFilter">
                        <option value="">Todas as Equipes</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Função:</label>
                    <select class="filter-select" id="funcaoFilter">
                        <option value="">Todas as Funções</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Carga Horária:</label>
                    <select class="filter-select" id="cargaHorariaFilter">
                        <option value="">Todas as Cargas Horárias</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Turno:</label>
                    <select class="filter-select" id="turnoFilter">
                        <option value="">Todos os Turnos</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Situação Funcional:</label>
                    <select class="filter-select" id="situacaoFuncionalFilter">
                        <option value="">Todas as Situações</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Situação Atual:</label>
                    <select class="filter-select" id="situacaoAtualFilter">
                        <option value="">Todas as Situações</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label class="filter-label">Vínculo:</label>
                    <select class="filter-select" id="vinculoFilter">
                        <option value="">Todos os Vínculos</option>
                    </select>
                </div>
            </div>
            <div class="action-buttons">
                <button class="btn-action btn-update" onclick="updateData()">
                    <i class="fas fa-sync-alt"></i> Atualizar Painel
                </button>
                <button class="btn-action btn-clear" onclick="clearFilters()">
                    <i class="fas fa-eraser"></i> Limpar Filtros
                </button>
                <button class="btn-action btn-download" onclick="downloadExcel()">
                    <i class="fas fa-download"></i> Baixar Excel
                </button>
            </div>
        </div>

        <!-- Estatísticas Gerais -->
        <div class="stats-grid" id="statsGrid">
            <div class="stat-card">
                <div class="stat-number" id="totalProfissionais">...</div>
                <div class="stat-label">Total de Profissionais Ativos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="totalUnidades">...</div>
                <div class="stat-label">Total de Unidades de Saúde</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="totalEquipes">...</div>
                <div class="stat-label">Total de Equipes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="totalFuncoes">...</div>
                <div class="stat-label">Total de Funções Diferentes</div>
            </div>
        </div>

        <!-- Gráficos -->
        <div class="charts-grid">
            <div class="chart-container">
                <div class="chart-title">Total de Profissionais por Unidade de Saúde</div>
                <div class="chart-wrapper">
                    <canvas id="unidadeChart"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Total de Profissionais Ativos por Carga Horária</div>
                <div class="chart-wrapper">
                    <canvas id="cargaHorariaChart"></canvas>
                </div>
            </div>
        </div>

        <div class="charts-grid">
            <div class="chart-container">
                <div class="chart-title">Total de Profissionais Ativos por Turno</div>
                <div class="chart-wrapper">
                    <canvas id="turnoChart"></canvas>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-title">Total de Profissionais Ativos por Situação Funcional</div>
                <div class="chart-wrapper">
                    <canvas id="situacaoFuncionalChart"></canvas>
                </div>
            </div>
        </div>

        <div class="charts-grid">
            <div class="chart-container">
                <div class="chart-title">Total de Profissionais Ativos por Situação Atual</div>
                <div class="chart-wrapper">
                    <canvas id="situacaoAtualChart"></canvas>
                </div>
            </div>
        </div>

        <div class="charts-grid">
            <div class="chart-container chart-full-width chart-large">
                <div class="chart-title">Total de Profissionais Ativos por Função</div>
                <div class="chart-wrapper">
                    <canvas id="funcaoChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Tabela de Dados -->
        <div class="data-table">
            <div class="table-header">
                <i class="fas fa-table"></i> Dados Completos dos Profissionais de Saúde
            </div>
            <div class="table-content">
                <div class="table-wrapper">
                    <table class="table" id="profissionaisTable">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Unidade de Saúde</th>
                                <th>Equipe</th>
                                <th>Função</th>
                                <th>Carga Horária</th>
                                <th>Turno</th>
                                <th>Situação Funcional</th>
                                <th>Situação Atual</th>
                                <th>Vínculo</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Conteúdo será gerado pelo JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
