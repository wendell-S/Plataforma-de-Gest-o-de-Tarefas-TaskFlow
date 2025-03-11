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
const $calendario = document.getElementById('calendario');
const $calendarioBody = document.getElementById('calendario-body');
const $calendarioMesAno = document.getElementById('calendario-mes-ano');

let todoList = [];
let mesAtual = moment();

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
    $todoColumnBody.innerHTML = '';
    $inProgressColumnBody.innerHTML = '';
    $doneColumnBody.innerHTML = '';
    $archivedColumnBody.innerHTML = '';

    todoList.forEach(function(task) {
        const formatarDate = moment(task.deadline).format('DD/MM/YYYY');
        const daysLeft = moment(task.deadline).diff(moment(), 'days');
        let urgencyClass = '';

        if (daysLeft <= 3) {
            urgencyClass = 'urgent';
        } else if (daysLeft <= 7) {
            urgencyClass = 'warning';
        }

        const prioridadeClass = task.prioridade.toLowerCase();
        const concluidaClass = task.concluida ? 'concluida' : '';

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
             <button class="edit-btn" onclick="editarTask(${task.id})">Editar</button>
             <button class="delete-btn" onclick="deletarTask(${task.id})">Deletar</button>
             <button class="concluida-btn" onclick="marcarConcluida(${task.id})">Concluir</button>
          </div>
        `;

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

function editarTask(id) {
    abrirModal(id);
}

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

function marcarConcluida(id) {
    const taskIndex = todoList.findIndex(task => task.id === id);
    todoList[taskIndex].concluida = !todoList[taskIndex].concluida;
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
    const coluna = event.target.closest('.coluna').id;

    const taskId = parseInt(data.split('-')[1]);
    const taskIndex = todoList.findIndex(task => task.id === taskId);
    todoList[taskIndex].coluna = coluna.replace('Column', '');

    event.target.closest('.body').appendChild(taskElement);
    salvarTarefas();
    updateTaskCounts(); // Atualiza a contagem de tarefas em tempo real
}

function filtrarTarefas(prioridade) {
    const tarefasFiltradas = todoList.filter(task => task.prioridade === prioridade);
}

function adicionarNotificacao(task) {
    const daysLeft = moment(task.deadline).diff(moment(), 'days');
    if (daysLeft <= 1) {
        alert(`A tarefa "${task.descriçao}" está próxima do prazo!`);
    }
}

function buscarTarefas() {
    const termo = $searchInput.value.toLowerCase();
    const tarefasFiltradas = todoList.filter(task => task.descriçao.toLowerCase().includes(termo));
}

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

function updateTaskCounts() {
    document.getElementById('todoCount').innerText = $todoColumnBody.children.length;
    document.getElementById('inProgressCount').innerText = $inProgressColumnBody.children.length;
    document.getElementById('doneCount').innerText = $doneColumnBody.children.length;
    document.getElementById('archivedCount').innerText = $archivedColumnBody.children.length;
}

function exibirCalendario() {
    $calendario.style.display = "block";
    atualizarCalendario();
}

function atualizarCalendario() {
    $calendarioBody.innerHTML = ""; // Limpa o conteúdo anterior
    $calendarioMesAno.innerText = mesAtual.format('MMMM YYYY');

    const diasNoMes = mesAtual.daysInMonth();
    const primeiroDia = mesAtual.startOf('month').day();
    const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    let calendarioHtml = "<table><thead><tr>";
    diasDaSemana.forEach(dia => {
        calendarioHtml += `<th>${dia}</th>`;
    });
    calendarioHtml += "</tr></thead><tbody><tr>";

    for (let i = 0; i < primeiroDia; i++) {
        calendarioHtml += "<td></td>";
    }
    for (let dia = 1; dia <= diasNoMes; dia++) {
        if ((dia + primeiroDia - 1) % 7 === 0) {
            calendarioHtml += "</tr><tr>";
        }
        calendarioHtml += `<td onclick="selecionarData(${dia})">${dia}</td>`;
    }
    calendarioHtml += "</tr></tbody></table>";

    $calendarioBody.innerHTML = calendarioHtml;
}

function mudarMes(direcao) {
    mesAtual.add(direcao, 'months');
    atualizarCalendario();
}

function selecionarData(dia) {
    const dataSelecionada = mesAtual.date(dia).format('YYYY-MM-DD');
    $deadline.value = dataSelecionada;
    fecharCalendario();
}

function fecharCalendario() {
    $calendario.style.display = "none";
}

carregarTarefas();

