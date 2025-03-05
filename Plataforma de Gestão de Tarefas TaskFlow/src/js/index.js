const $modal = document.getElementById('modal');
const $descriçaoInput = document.getElementById('descript');
const $prioridadeInput = document.getElementById('prioridade');
const $deadline = document.getElementById('deadline');
const $idInput = document.getElementById('idInput');

const $todoColumnBody = document.querySelector('#todoColumn .body');
const $inProgressColumnBody = document.querySelector('#inProgressColumn .body');
const $doneColumnBody = document.querySelector('#doneColumn .body');
const $archivedColumnBody = document.querySelector('#archivedColumn .body');

let todoList = [];

function salvarTarefas() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
}

function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem('todoList');
    if (tarefasSalvas) {
        todoList = JSON.parse(tarefasSalvas);
        generateCards();
    }
}

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

function fecharModal() {
    $modal.style.display = "none";
    
    $idInput.value = "";
    $descriçaoInput.value = "";
    $prioridadeInput.value = "";
    $deadline.value = "";
}

function generateCards() {
    const todoListHtml = todoList.map(function(task){
        const formatarDate = moment(task.deadline).format('DD/MM/YYYY');
        return `
          <div class="card" draggable="true" ondragstart="drag(event)" id="task-${task.id}">
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
             <button class="delete-btn" onclick="deletarTask(${task.id})">Deletar</button>
          </div>
        `;
    });

    $todoColumnBody.innerHTML = todoListHtml.join('');
    $inProgressColumnBody.innerHTML = '';
    $doneColumnBody.innerHTML = '';
    $archivedColumnBody.innerHTML = '';
}

function criarTask() {
    const newTask = {
        id: Math.floor(Math.random() * 999999),
        descriçao: $descriçaoInput.value,
        prioridade: $prioridadeInput.value,
        deadline: $deadline.value,
    };

    todoList.push(newTask);

    fecharModal();
    generateCards();
    salvarTarefas();
}

function deletarTask(id) {
    todoList = todoList.filter(function(task) {
        return task.id !== id;
    });
    generateCards();
    salvarTarefas();
}

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
    event.target.closest('.body').appendChild(taskElement);
}

// Carregar tarefas ao iniciar
carregarTarefas();

