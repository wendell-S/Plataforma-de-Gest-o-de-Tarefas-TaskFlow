const $modal = document.getElementById('modal');
const $descriçaoInput = document.getElementById('descript')
const $prioridadeInput = document.getElementById('prioridade')
const $deadline = document.getElementById('deadline')

function abrirModal() {
    $modal.style.display = "flex"
}

function fecharModal() {
    $modal.style.display = "none"
}

function criarTask() {
    console.log($descriçaoInput.value)
    console.log($prioridadeInput.value)
    console.log($deadline.value)

    fecharModal()
}