const saveBtn = document.querySelector('.j-save');
const refreshBtn = document.querySelector('.j-refresh');

function toggleLoadingView() {
  const modalLoading = document.querySelector('.modal.modal--loading');
  modalLoading.classList.toggle('show')
}

function handleReceivedUsers(users) {
  const pendingUsers = users ? users.pendingUsers : false;
  const usersContainer = document.querySelector('#users_table .j-tbody ');
  
  usersContainer.innerHTML = '';

  if (pendingUsers) {
    pendingUsers.forEach(user => {
      const user_row = document.createElement('div');
      const userProperties = [user.full_name, user.email, user.registration_status, user.registration_date];
      
      user_row.classList.add('tr', 'j-user')
      user_row.setAttribute('data-id', user.id);
  
      userProperties.forEach((property, index) => {
        const property_field = document.createElement('td');
        property_field.classList.add('td');
        let property_HTML = "";
        if (index === 2) {  
          property_HTML = 
            `<select name="registration_status">
              <option value="${property}">${property}</option>  
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
            </select>`
        } else {
          property_HTML = property;
        }
  
        property_field.innerHTML = property_HTML;
        user_row.appendChild(property_field);
      });
      usersContainer.appendChild(user_row);
    });

  } else {
    console.log("ERROR");
  }
  toggleLoadingView();
}

function sendData(data) {
  const url = '/changeUsersStatus';
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json'
    }
  }).then(res => res.json())
  .catch(error => console.error(error))
  .then(handleReceivedUsers);
}

function formatUser(user) {
  const userId = user.dataset.id;
  const user_registration_status = user.querySelector('select[name="registration_status"]').value;
  return {
    user_id: userId,
    user_registration_status: user_registration_status
  }
}

function notPendingUsers(user) {
  const registration_status = user.querySelector('select[name="registration_status"]').value;
  return registration_status != 'pending';
}

function handleUsersApproval(e) {
  const usersListed = Array.from(document.querySelectorAll('.j-user'));
  const modifiedUsers = usersListed.filter(notPendingUsers);
  const usersData = modifiedUsers.map(formatUser);
  if (modifiedUsers.length > 0) {
    toggleLoadingView();
    sendData(usersData);
  }
}

function refreshUsersTable(e) {
  fetch('/getPendingUsers')
  .then(response => response.json())
  .catch(error => console.error(error))
  .then((data) => {
    toggleLoadingView();
    handleReceivedUsers(data);
  });
}

saveBtn.addEventListener('click', handleUsersApproval);
refreshBtn.addEventListener('click', refreshUsersTable);