const saveBtn = document.querySelector('.j-save');

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
  .then(response => console.log('Success!', response));

  // const request = new XMLHttpRequest();
  // const json = JSON.stringify({"test":"test", "test2":"test2"});
  // request.open('POST', '/changeUsersStatus', true);
  // request.setRequestHeader('Content-Type', 'application/json');
  // request.send(json);
}

function formatUser(user) {
  const userId = user.dataset.id;
  const user_registration_status = user.querySelector('select[name="registration_status"]').value;
  return {
    user_id: userId,
    user_registration_status: user_registration_status
  }
}

function notPendingUses(user) {
  const registration_status = user.querySelector('select[name="registration_status"]').value;
  return registration_status != 'pending';
}

function handleUsersApproval(e) {
  const usersListed = Array.from(document.querySelectorAll('.j-user'));
  const modifiedUsers = usersListed.filter(notPendingUses);
  const usersData = modifiedUsers.map(formatUser);
  if (modifiedUsers.length > 0) {
    sendData(usersData);
  }
}

saveBtn.addEventListener('click', handleUsersApproval);