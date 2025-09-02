# Painel de Profissionais de Saúde - Distrito Sanitário Eldorado

Um painel interativo para visualização e análise dos dados de profissionais de saúde do Distrito Sanitário Eldorado, sincronizado automaticamente com planilha do Google Sheets.

## 📊 Funcionalidades

- **Sincronização Automática**: Carrega dados diretamente da planilha do Google Sheets
- **Filtros Interativos**: Filtragem por unidade, equipe, função, carga horária, turno, situação funcional, situação atual e vínculo
- **Visualizações Gráficas**: Gráficos de barras, pizza e rosca para análise visual dos dados
- **Tabela Completa**: Visualização detalhada de todos os profissionais com filtros aplicados
- **Exportação Excel**: Download dos dados filtrados em formato Excel
- **Design Responsivo**: Interface adaptável para desktop e mobile

## 🚀 Como Usar

### 1. Configuração da Planilha Google Sheets

Para que o painel funcione corretamente, sua planilha deve:

1. **Estar compartilhada publicamente** (qualquer pessoa com o link pode visualizar)
2. **Ter as seguintes colunas** (exatamente com estes nomes):
   - `Unidades de Saúde`
   - `Equipes`
   - `Nome`
   - `Função`
   - `Carga Horária`
   - `Turno`
   - `Situação Funcional`
   - `Situação atual`
   - `Vinculo`

### 2. Configuração do Código

No arquivo `script.js`, localize a linha:

```javascript
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1RGc_C7ABlb5hsGrVLgpZWmpdKjelyd6t06M1Ddl-VvU/gviz/tq?tqx=out:json';
```

Substitua o ID da planilha (`1RGc_C7ABlb5hsGrVLgpZWmpdKjelyd6t06M1Ddl-VvU`) pelo ID da sua planilha.

**Como encontrar o ID da planilha:**
- URL da planilha: `https://docs.google.com/spreadsheets/d/[ID_DA_PLANILHA]/edit`
- O ID é a parte entre `/d/` e `/edit`

### 3. Hospedagem

Você pode hospedar este painel de várias formas:

#### GitHub Pages (Gratuito)
1. Faça upload dos arquivos para um repositório GitHub
2. Vá em Settings > Pages
3. Selecione a branch `main` como source
4. Seu painel estará disponível em `https://seuusuario.github.io/nome-do-repositorio`

#### Netlify (Gratuito)
1. Conecte seu repositório GitHub ao Netlify
2. O deploy será automático a cada commit

#### Vercel (Gratuito)
1. Conecte seu repositório GitHub ao Vercel
2. Deploy automático com cada push

## 📁 Estrutura do Projeto

```
painel-profissionais-saude/
├── index.html          # Estrutura principal do painel
├── style.css           # Estilos CSS do painel
├── script.js           # Lógica JavaScript do painel
├── README.md           # Este arquivo
└── .gitignore         # Arquivos ignorados pelo Git
```

## 🔧 Personalização

### Alterando Cores
No arquivo `style.css`, localize a seção `:root` para alterar as cores:

```css
:root {
    --primary-color: #2c3e50;      /* Cor principal */
    --secondary-color: #3498db;    /* Cor secundária */
    --accent-color: #e74c3c;       /* Cor de destaque */
    --success-color: #27ae60;      /* Cor de sucesso */
    --warning-color: #f39c12;      /* Cor de aviso */
}
```

### Alterando Título e Informações
Localize a seção `header-section` no HTML para alterar:
- Título principal
- Subtítulo
- Nome da diretora
- Assinatura

## 🐛 Solução de Problemas

### Dados não carregam
1. **Verifique se a planilha está compartilhada publicamente**
2. **Confirme se o ID da planilha está correto na URL**
3. **Verifique se os nomes das colunas estão exatos**
4. **Abra o console do navegador (F12) para ver erros**

### Gráficos não aparecem
1. **Verifique se há dados na planilha**
2. **Confirme se as colunas têm dados válidos**
3. **Teste com dados de exemplo primeiro**

### Filtros não funcionam
1. **Verifique se os dados estão sendo carregados**
2. **Confirme se não há células vazias nas colunas de filtro**

## 📱 Compatibilidade

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móveis (iOS/Android)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Créditos

- **Desenvolvido por**: Ana P. A. Silva (Matrícula 201704)
- **Referência**: Vivver
- **Distrito**: Sanitário Eldorado
- **Diretora**: Wandha Karine dos Santos

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos issues do GitHub ou pelo email institucional.

---

**Última atualização**: Janeiro 2025

