const btnAddClient = document.querySelector('.j-addClient');
const addClientModal = document.querySelector('.j-modal-addClient');

function closeAddClientModal(e) {
  const clieckedTarget = e.target;
  if (clieckedTarget == addClientModal) {
    addClientModal.classList.remove('show');
  }
}

function showAddClientModal(e) {
  addClientModal.classList.add('show');
}

btnAddClient.addEventListener('click', showAddClientModal);
addClientModal.addEventListener('click', closeAddClientModal);