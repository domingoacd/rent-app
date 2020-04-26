const btnAddClient = document.querySelector('.j-addClient');
const addClientModal = document.querySelector('.j-modal-addClient');
const btnSaveClient = document.querySelector('.j-saveClient');

function closeAddClientModal(e) {
  const clieckedTarget = e.target;
  if (clieckedTarget == addClientModal) {
    addClientModal.classList.remove('show');
  }
}

function InsertClientIntoTable(client) {
  const table_container = document.querySelector('.j-tbody');
  const table_row = document.createElement('tr');
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
  table_container.appendChild(table_row);
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

btnAddClient.addEventListener('click', showAddClientModal);
btnSaveClient.addEventListener('click', saveClient);
addClientModal.addEventListener('click', closeAddClientModal);