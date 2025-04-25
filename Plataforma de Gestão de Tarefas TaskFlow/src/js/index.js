// Seletores de elementos do DOM
const $modal = document.getElementById('modal');
const $descriçaoInput = document.getElementById('descript');
const $prioridadeInput = document.getElementById('prioridade');
const $deadline = document.getElementById('deadline');
const $idInput = document.getElementById('idInput');
const $searchInput = document.getElementById('search');

const $todoColumnBody = document.querySelector('#todoColumn .body');
const $inProgressColumnBody = document.querySelector('#inProgressColumn .body');
const $doneColumnBody = document.querySelector('#doneColumn .body');
const $archivedColumnBody = document.querySelector('#archivedColumn .body');

// Lista de tarefas e data atual
let todoList = [];
let mesAtual = moment();

// Função para salvar tarefas no localStorage
function salvarTarefas() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}

// Função para carregar tarefas do localStorage
function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem('todoList');
    if (tarefasSalvas) {
        todoList = JSON.parse(tarefasSalvas);
        generateCards();
    }
}

// Função para abrir o modal (criação ou edição de tarefa)
function abrirModal(id) {
    $modal.style.display = "flex";

    if (id) {
        const index = todoList.findIndex(function (task) {
            return task.id == id;
        });

        const task = todoList[index];

        $idInput.value = task.id;
        $descriçaoInput.value = task.descriçao;
        $prioridadeInput.value = task.prioridade;
        $deadline.value = task.deadline;
    } 
}

// Função para fechar o modal
function fecharModal() {
    $modal.style.display = "none";
    
    $idInput.value = "";
    $descriçaoInput.value = "";
    $prioridadeInput.value = "";
    $deadline.value = "";
}

// Função para gerar os cartões de tarefas
function generateCards() {
    // Limpa as colunas antes de adicionar os cartões
    $todoColumnBody.innerHTML = '';
    $inProgressColumnBody.innerHTML = '';
    $doneColumnBody.innerHTML = '';
    $archivedColumnBody.innerHTML = '';

    // Adiciona cada tarefa à coluna correspondente
    todoList.forEach(function(task) {
        const formatarDate = moment(task.deadline).format('DD/MM/YYYY');
        const daysLeft = moment(task.deadline).diff(moment(), 'days');
        let urgencyClass = '';

        // Define a classe de urgência com base no prazo
        if (daysLeft <= 3) {
            urgencyClass = 'urgent';
        } else if (daysLeft <= 7) {
            urgencyClass = 'warning';
        }

        const prioridadeClass = task.prioridade.toLowerCase();
        const concluidaClass = task.concluida ? 'concluida' : '';

        // HTML do cartão de tarefa
        const taskHtml = `
          <div class="card ${urgencyClass} ${prioridadeClass} ${concluidaClass}" draggable="true" ondragstart="drag(event)" id="task-${task.id}">
             <div class="info">
                <b>Descrição</b>
                <span>${task.descriçao}</span>
             </div>
             <div class="info">
                <b>Prioridade</b>
                <span>${task.prioridade}</span>
             </div>
             <div class="info">
                <b>Prazo</b>
                <span>${formatarDate}</span>
             </div>
             <div class="buttons">
                <button class="options-btn" onclick="toggleOptions(${task.id})">Opções</button>
                <div class="options-menu" id="options-${task.id}">
                    <button class="edit-btn" onclick="editarTask(${task.id})">Editar</button>
                    <button class="delete-btn" onclick="deletarTask(${task.id})">Deletar</button>
                    <button class="concluida-btn" onclick="marcarConcluida(${task.id})">Concluir</button>
                </div>
             </div>
          </div>
        `;

        // Adiciona o cartão à coluna correspondente
        switch (task.coluna) {
            case 'todo':
                $todoColumnBody.innerHTML += taskHtml;
                break;
            case 'inProgress':
                $inProgressColumnBody.innerHTML += taskHtml;
                break;
            case 'done':
                $doneColumnBody.innerHTML += taskHtml;
                break;
            case 'archived':
                $archivedColumnBody.innerHTML += taskHtml;
                break;
        }
    });

    updateTaskCounts();
}

// Função para alternar o menu de opções de uma tarefa
function toggleOptions(id) {
    const optionsMenu = document.getElementById(`options-${id}`);
    optionsMenu.style.display = optionsMenu.style.display === 'block' ? 'none' : 'block';
}

// Função para criar uma nova tarefa
function criarTask() {
    const newTask = {
        id: Math.floor(Math.random() * 999999),
        descriçao: $descriçaoInput.value,
        prioridade: $prioridadeInput.value,
        deadline: $deadline.value,
        coluna: 'todo',
        concluida: false
    };

    todoList.push(newTask);

    fecharModal();
    generateCards();
    salvarTarefas();
}

// Função para editar uma tarefa existente
function editarTask(id) {
    abrirModal(id);
}

// Função para deletar uma tarefa
function deletarTask(id) {
    const taskIndex = todoList.findIndex(task => task.id === id);
    const taskElement = document.getElementById(`task-${id}`);

    if (taskElement) {
        taskElement.classList.add('desintegrar');
        setTimeout(() => {
            todoList.splice(taskIndex, 1);
            generateCards();
            salvarTarefas();
        }, 500);
    }
}

// Função para marcar uma tarefa como concluída
function marcarConcluida(id) {
    const taskIndex = todoList.findIndex(task => task.id === id);
    todoList[taskIndex].concluida = !todoList[taskIndex].concluida;
    generateCards();
    salvarTarefas();
}

// Funções para arrastar e soltar tarefas entre colunas
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const taskElement = document.getElementById(data);
    const coluna = event.target.closest('.coluna').id;

    const taskId = parseInt(data.split('-')[1]);
    const taskIndex = todoList.findIndex(task => task.id === taskId);
    todoList[taskIndex].coluna = coluna.replace('Column', '');

    event.target.closest('.body').appendChild(taskElement);
    salvarTarefas();
    updateTaskCounts(); // Atualiza a contagem de tarefas em tempo real
}

// Função para filtrar tarefas por prioridade
function filtrarTarefas(prioridade) {
    const tarefasFiltradas = todoList.filter(task => task.prioridade === prioridade);
}

// Função para adicionar notificações de prazo
function adicionarNotificacao(task) {
    const daysLeft = moment(task.deadline).diff(moment(), 'days');
    if (daysLeft <= 1) {
        alert(`A tarefa "${task.descriçao}" está próxima do prazo!`);
    }
}

// Função para buscar tarefas por termo
function buscarTarefas() {
    const termo = $searchInput.value.toLowerCase();
    const tarefasFiltradas = todoList.filter(task => task.descriçao.toLowerCase().includes(termo));
}

// Função para ordenar tarefas por critério
function ordenarTarefas(criterio) {
    todoList.sort((a, b) => {
        if (criterio === 'data') {
            return new Date(a.deadline) - new Date(b.deadline);
        } else if (criterio === 'prioridade') {
            const prioridades = ['baixa', 'media', 'alta'];
            return prioridades.indexOf(a.prioridade.toLowerCase()) - prioridades.indexOf(b.prioridade.toLowerCase());
        }
    });
    generateCards();
}

// Função para atualizar a contagem de tarefas em cada coluna
function updateTaskCounts() {
    document.getElementById('todoCount').innerText = $todoColumnBody.children.length;
    document.getElementById('inProgressCount').innerText = $inProgressColumnBody.children.length;
    document.getElementById('doneCount').innerText = $doneColumnBody.children.length;
    document.getElementById('archivedCount').innerText = $archivedColumnBody.children.length;
}

// Carrega as tarefas ao iniciar
carregarTarefas();

