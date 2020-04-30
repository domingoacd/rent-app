const btnCreateRental = document.querySelector('.j-createRental');
const btnSaveRental = document.querySelector('.j-saveRental');
const createRentalModal = document.querySelector('.j-modal-create');
const carSelect = document.querySelector('select#car');
const clientSelect = document.querySelector('select#client');

function resetModalOptions() {
  carSelect.innerHTML = "<option disabled selected value=''>Select a car</option>";
  clientSelect.innerHTML = "<option disabled selected value=''>Select a client</option>";
}

function closeCreateRentalModal(e) {
  const clieckedTarget = e.target;
  if (clieckedTarget == createRentalModal) {
    resetModalOptions();
    createRentalModal.classList.remove('show');
  }
}

function insertCarsIntoSelect(carsObj) {
  const { cars } = carsObj;
  const noCarsAvailable = cars.length == 0; 
  // carSelect.innerHTML = "";
  
  if (noCarsAvailable) {
    
  } else {
    cars.forEach(car => {
      const optionEl = document.createElement('option');
      optionEl.value = car.id;
      optionEl.setAttribute('data-image', car.image_name);
      optionEl.textContent = `${car.model} - ${car.kilometers}Km - ${car.year}`;
      carSelect.appendChild(optionEl);
    });
  }
  
}

function insertClients(clientsObj) {
  const { clients } = clientsObj;
  const thereAreNoClients = clients.length == 0;

  if (thereAreNoClients) {

  } else {
    clients.forEach(client => {
      const optionEl = document.createElement('option');
      optionEl.value = client.id;
      optionEl.textContent = `${client.full_name} - license: ${client.license_number}`;
      clientSelect.appendChild(optionEl);
    });
  }
}

function getCarsToInsert() {
  const url = '/async/getNotRentedCars';
  fetch(url)
    .then(data => data.json())
    .catch(err => console.log(err))
    .then(insertCarsIntoSelect);
}

function getClientsToInsert() {
  const url = '/async/getClients';
  fetch(url)
    .then(data => data.json())
    .catch(err => console.log(err))
    .then(insertClients);
}

function insertCurrentDate() {
  const dateInput = document.querySelector('#creationDate');
  const currentDate = new Date().toLocaleDateString();

  dateInput.value = currentDate;
}

function showCreateRentalModal(e) {
  getCarsToInsert();
  getClientsToInsert();
  insertCurrentDate();
  createRentalModal.classList.add('show');
}

function handdleSavedRental(savedRental) {
  console.log(savedRental);
}

function saveRental(e) {
  e.preventDefault();
  const url = '/async/createRental';
  const data = {
    car: document.querySelector('select#car').value,
    client: document.querySelector('select#client').value,
    creationDate: document.querySelector('input#creationDate').value,
    returnDate: document.querySelector('input#returnDate').value,
    createdBy: document.querySelector('select#createdBy').value
  }
  console.log(data);
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(data => data.json())
    .catch(err => console.log(err))
    .then(handdleSavedRental);
}

btnCreateRental.addEventListener('click', showCreateRentalModal);
createRentalModal.addEventListener('click', closeCreateRentalModal);
btnSaveRental.addEventListener('click', saveRental);