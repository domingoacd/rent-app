const btnCreateRental = document.querySelector('.j-createRental');
const createRentalModal = document.querySelector('.j-modal-create');
const carSelect = document.querySelector('select#car');
const clientSelect = document.querySelector('select#client');

function insertCarsIntoSelect(carsObj) {
  const { cars } = carsObj;
  const noCarsAvailable = cars.length == 0; 
  carSelect.innerHTML = "";
  
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

function showCreateRentalModal(e) {
  getCarsToInsert();
  getClientsToInsert();
  createRentalModal.classList.add('show');
}

btnCreateRental.addEventListener('click', showCreateRentalModal);