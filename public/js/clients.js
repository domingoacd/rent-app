const btnAddClient = document.querySelector('.j-addClient');
const addClientModal = document.querySelector('.j-modal-addClient');
const btnSaveClient = document.querySelector('.j-saveClient');

function closeAddClientModal(e) {
  const clieckedTarget = e.target;
  if (clieckedTarget == addClientModal) {
    addClientModal.classList.remove('show');
  }
}

function saveClient(e) {
  e.preventDefault();
  const url = '/async/saveClient';
  const data =
  fetch(url, {
    body: {
      full_name: document.querySelector('#name').value,
      license: document.querySelector('#license').value,
      phone_number: document.querySelector('#phone').value
    }
  })
  .then(res => res.json())
  .catch(error => console.error(error))
  .then(data => console.log(data))
}

function showAddClientModal(e) {
  addClientModal.classList.add('show');
}

btnAddClient.addEventListener('click', showAddClientModal);
btnSaveClient.addEventListener('click', saveClient);
addClientModal.addEventListener('click', closeAddClientModal);