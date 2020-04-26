const btnAddClient = document.querySelector('.j-addClient');
const btnSaveClient = document.querySelector('.j-saveClient');
const btnAcceptDeleteClient = document.querySelector('.j-accept-delete');
const btnCancelDeleteClient = document.querySelector('.j-cancel-delete');
const allBtnDeleteClient = document.querySelectorAll('.j-deleteClient');
const addClientModal = document.querySelector('.j-modal-addClient');
const deleteClientModal = document.querySelector('.j-modal-deleteClient');

function closeAddClientModal(e) {
  const clieckedTarget = e.target;
  if (clieckedTarget == addClientModal) {
    addClientModal.classList.remove('show');
  }
}

function InsertClientIntoTable(client) {
  const table_container = document.querySelector('.j-tbody');
  const table_row = document.createElement('tr');
  const table_first_child = table_container.firstChild;
  const keys = Object.keys(client); 

  table_row.classList.add('tr');
  table_row.setAttribute('data-clientId', client.id);

  for (let index = 1; index <= 4; index++) {
    const td = document.createElement('td');
    td.classList.add('td');

    if (index < 4) {
      td.textContent = client[keys[index]];
    } else {
      td.innerHTML = "<button class='btn deleteClient j-deleteClient'>Delete</div>";
    }
    table_row.appendChild(td);
  }
  table_container.insertBefore(table_row, table_first_child);
  addClientModal.classList.remove('show');
}

function handleClientSavedResponse(response) {
  const { client_info } = response; 
  console.log(client_info);
  if (response.client_added) {
    InsertClientIntoTable(client_info);
  } else {

  }
}

function saveClient(e) {
  e.preventDefault();
  const url = '/async/saveClient';
  const data = {
      full_name: document.querySelector('#name').value,
      license: document.querySelector('#license').value,
      phone_number: document.querySelector('#phone').value
    }
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .catch(error => console.error(error))
    .then(handleClientSavedResponse);
}

function showAddClientModal(e) {
  addClientModal.classList.add('show');
}

function handleClientToDelete(e) {
  const rowClientId = e.target.parentNode.parentNode.dataset.clientid;
  deleteClientModal.setAttribute('data-clientToDelete', rowClientId);
  deleteClientModal.classList.add('show');
}

function removeClientFromTable() {
  const clientId = deleteClientModal.dataset.clienttodelete;
  const clientRow  = document.querySelector(`.j-tbody .tr[data-clientid="${clientId}"]`)
  clientRow.remove();
  closeDeleteClientModal();
}

function handleDeletedClient(response) {
  if (response.clientDeleted) {
    removeClientFromTable();
  } else {

  }
}

function deleteClient(e) {
  const clientId = deleteClientModal.dataset.clienttodelete;
  const url = '/async/deleteClient';
  const data = {id: Number(clientId)}
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .catch(err => console.error(err))
    .then(handleDeletedClient);
}

function closeDeleteClientModal(e) {
  deleteClientModal.removeAttribute('data-clientToDelete');
  deleteClientModal.classList.remove('show');
}

btnAddClient.addEventListener('click', showAddClientModal);
btnSaveClient.addEventListener('click', saveClient);
addClientModal.addEventListener('click', closeAddClientModal);
allBtnDeleteClient.forEach(btn => btn.addEventListener('click', handleClientToDelete));
btnAcceptDeleteClient.addEventListener('click', deleteClient);
btnCancelDeleteClient.addEventListener('click', closeDeleteClientModal);