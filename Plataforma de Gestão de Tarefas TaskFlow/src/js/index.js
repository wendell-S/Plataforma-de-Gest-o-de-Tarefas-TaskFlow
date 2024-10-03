const $modal = document.getElementById('modal');
const $descriçaoInput = document.getElementById('descript')
const $prioridadeInput = document.getElementById('prioridade')
const $deadline = document.getElementById('deadline')

const $todoColumnBody = document.querySelector('#todoColumn .body')

let todoList = [];

function abrirModal() {
    $modal.style.display = "flex"
}

function fecharModal() {
    $modal.style.display = "none"
}

function generateCards() {
    const todoListHtml = todoList.map(function(task){
        const formatarDate = moment(task.deadline).format('DD/MM/YYYY')
        return `
          <div class="card">
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
        descriçao: $descriçaoInput.value,
        prioridade: $prioridadeInput.value,
        deadline: $deadline.value,
    }

    todoList.push(newTask)



    fecharModal()
    generateCards()
}

