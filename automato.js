// Dimensões da grade
const tamanhoGrade = 20; // Define o tamanho da grade como 20x20
const tamanhoCelula = 25; // Cada célula tem 25x25 pixels
const canvas = document.getElementById('automatoCanvas'); // Obtém o elemento canvas do HTML
const ctx = canvas.getContext('2d'); // Obtém o contexto 2D para desenhar no canvas

// Inicializar a grade com células mortas (0)
let grade = criarGradeVazia(tamanhoGrade); // Cria uma grade vazia (todas as células mortas)

// Variável para armazenar o histórico das gerações
let historico = []; // Armazena as gerações anteriores
let geracaoAtual = 0; // Índice da geração atual no histórico

// Função para criar uma grade vazia (apenas células mortas)
function criarGradeVazia(tamanho) {
    let grade = new Array(tamanho); // Cria um array para a grade
    for (let i = 0; i < tamanho; i++) {
        grade[i] = new Array(tamanho).fill(0); // Preenche cada linha da grade com zeros (células mortas)
    }
    return grade; // Retorna a grade vazia
}

// Função para desenhar a grade no canvas
function desenharGrade(grade) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    for (let linha = 0; linha < tamanhoGrade; linha++) {
        for (let coluna = 0; coluna < tamanhoGrade; coluna++) {
            // Define a cor da célula: preta se viva, branca se morta
            ctx.fillStyle = grade[linha][coluna] === 1 ? 'black' : 'white'; 
            // Desenha a célula no canvas
            ctx.fillRect(coluna * tamanhoCelula, linha * tamanhoCelula, tamanhoCelula, tamanhoCelula);
            // Desenha o contorno da célula
            ctx.strokeRect(coluna * tamanhoCelula, linha * tamanhoCelula, tamanhoCelula, tamanhoCelula);
        }
    }
}

// Inicializa uma configuração de células vivas no meio da grade (exemplo)
function inicializarGrade(grade) {
    // Define algumas células vivas na grade
    grade[7][5] = 1;
    grade[6][6] = 1;
    grade[5][6] = 1;
    grade[6][8] = 1;
    grade[6][9] = 1;
    grade[7][7] = 1;
    grade[9][8] = 1;
    grade[9][9] = 1;
    grade[7][9] = 1;
    grade[8][7] = 1;
}

// Função para contar os vizinhos vivos (vizinhança de Moore, raio 1)
function contarVizinhosVivos(grade, x, y) {
    let vizinhosVivos = 0; // Inicializa o contador de vizinhos vivos
    for (let i = -1; i <= 1; i++) { // Loop para as linhas vizinhas
        for (let j = -1; j <= 1; j++) { // Loop para as colunas vizinhas
            if (i === 0 && j === 0) continue; // Ignora a própria célula

            // Verificar se a posição do vizinho está dentro dos limites da grade
            const nx = x + i; // Calcula a nova linha
            const ny = y + j; // Calcula a nova coluna
            
            // Verifica se o vizinho está dentro da grade
            if (nx >= 0 && nx < tamanhoGrade && ny >= 0 && ny < tamanhoGrade) {
                vizinhosVivos += grade[nx][ny]; // Soma o número de vizinhos vivos
            }
        }
    }
    return vizinhosVivos; // Retorna o número de vizinhos vivos
}

// Função para calcular a próxima geração com as novas regras
function proximaGeracao(gradeAtual) {
    let novaGrade = criarGradeVazia(tamanhoGrade); // Cria uma nova grade para a próxima geração
    
    // Itera sobre cada célula da grade atual
    for (let linha = 0; linha < tamanhoGrade; linha++) {
        for (let coluna = 0; coluna < tamanhoGrade; coluna++) {
            const vizinhosVivos = contarVizinhosVivos(gradeAtual, linha, coluna); // Conta os vizinhos vivos
            
            if (gradeAtual[linha][coluna] === 1) { // Se a célula está viva
                // Verifica as condições de morte ou sobrevivência
                if (vizinhosVivos === 1) {
                    novaGrade[linha][coluna] = 0; // Morre
                } else if (vizinhosVivos === 2 || vizinhosVivos === 4) {
                    novaGrade[linha][coluna] = 1; // Vive
                } else if (vizinhosVivos > 4) {
                    novaGrade[linha][coluna] = 0; // Morre
                }
            } else { // Se a célula está morta
                // Verifica se deve nascer uma nova célula
                if (vizinhosVivos === 3) {
                    novaGrade[linha][coluna] = 1; // Nasce
                }
            }
        }
    }
    return novaGrade; // Retorna a nova grade
}

// Função para avançar para a próxima geração
function atualizar() {
    // Salvar a geração atual no histórico antes de calcular a nova
    historico[geracaoAtual] = JSON.parse(JSON.stringify(grade)); // Faz uma cópia da grade atual no histórico
    geracaoAtual++; // Avança para a nova geração

    // Calcular a nova geração e desenhá-la
    grade = proximaGeracao(grade); // Atualiza a grade com a próxima geração
    desenharGrade(grade); // Desenha a nova geração no canvas
}

// Função para voltar uma geração no histórico
function voltarGeracao() {
    if (geracaoAtual > 0) { // Verifica se há gerações anteriores
        geracaoAtual--; // Volta uma geração
        grade = historico[geracaoAtual]; // Recupera a geração anterior do histórico
        desenharGrade(grade); // Desenha a geração anterior no canvas
    }
}

// Inicializar a grade com algumas células vivas
inicializarGrade(grade); // Chama a função para inicializar a grade

// Desenhar a grade inicial
desenharGrade(grade); // Desenha a grade inicial no canvas

// Adicionar um evento ao botão para avançar geração quando clicado
document.getElementById('nextGenButton').addEventListener('click', atualizar); // Evento para avançar geração

// Adicionar um evento ao botão para voltar uma geração quando clicado
document.getElementById('prevGenButton').addEventListener('click', voltarGeracao); // Evento para voltar geração