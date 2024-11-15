const $modal = document.getElementById('modal');
const $descriçaoInput = document.getElementById('descript')
const $prioridadeInput = document.getElementById('prioridade')
const $deadline = document.getElementById('deadline')
const $idInput = document.getElementById('idInput')

const $todoColumnBody = document.querySelector('#todoColumn .body')

let todoList = [];

function abrirModal(id) {
    $modal.style.display = "flex"

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
    $modal.style.display = "none"
    
    $idInput.value = "";
    $descriçaoInput.value = "";
    $prioridadeInput.value = "";
    $deadline.value = "";
}

function generateCards() {
    const todoListHtml = todoList.map(function(task){
        const formatarDate = moment(task.deadline).format('DD/MM/YYYY')
        return `
          <div class="card" ondblclick="abrirModal(${task.id})">
             <div class="info">
                <b>Descriçao</b>
                <span>${task.descriçao}</span>
             </div>
             
             <div class="info">
                <b>prioridade</b>
                <span>${task.prioridade}</span>
             </div>

             <div class="info">
                <b>prazo</b>
                <span>${formatarDate}</span>
             </div>
          </div>
        `;
    })

    $todoColumnBody.innerHTML = todoListHtml.join('')
}

function criarTask() {

    const newTask = {
        id: Math.floor(Math.random() * 999999),
        descriçao: $descriçaoInput.value,
        prioridade: $prioridadeInput.value,
        deadline: $deadline.value,
    }

    todoList.push(newTask)



    fecharModal()
    generateCards()
}

