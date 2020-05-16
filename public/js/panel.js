const btnCreateRental = document.querySelector('.j-createRental');
const btnSaveRental = document.querySelector('.j-saveRental');
const btnFilterRentals = document.querySelector('.j-filter');
const btnShowFilteredRentals = document.querySelector('.j-searchRentals');
const createRentalModal = document.querySelector('.j-modal-create');
const filterRentalsModal = document.querySelector('.j-modal-filter');
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

function insertRentalCard() {
  const dashboard = document.querySelector('.j-panelDashboard');
  const carId = document.querySelector('select#car').value; 
  const cardContainer = document.createElement('div');
  const cardData = {
    car: document.querySelector(`select#car option[value="${carId}"]`),
    client: document.querySelector('select#client').value,
    creationDate: document.querySelector('input#creationDate').value,
    returnDate: document.querySelector('input#returnDate').value,
    createdBy: document.querySelector('select#createdBy').value
  };
  const cardImage = document.createElement('img');
  cardImage.src = cardData.car.dataset.image;
  cardContainer.classList.add('card');

  cardContainer.appendChild(cardImage);
  dashboard.appendChild(cardContainer);
  
}

function handleSavedRental(response) {
  const {rentalWasCreated} = response;
   
  if (rentalWasCreated) {
    insertRentalCard();
  } else {

  }
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
    .then(handleSavedRental);
}

function showFilterModal(e) {
  const filterModal = document.querySelector('.j-modal-filter');
  filterModal.classList.add('show');
}

function closeFilterRentalsModal(e) {
    const clieckedTarget = e.target;
    if (clieckedTarget == filterRentalsModal) {
      filterRentalsModal.classList.remove('show');
      filterRentalsModal.querySelectorAll('input').forEach(input => input.value="");
    }
}

function rentalMatchsFilter(rental, filter) {
  const rentalCarModel = rental.querySelector('.j-carModel').textContent.toLowerCase().trim(); 
  const rentalCarYear = rental.querySelector('.j-carYear').textContent; 
  const rentalClientName = rental.querySelector('.j-clientName').textContent.toLowerCase().trim(); 
  const rentalLicenseNumber = rental.querySelector('.j-licenseNumber').textContent; 

  return (
    (filter.carModel == '' || filter.carModel == rentalCarModel) &&
    (filter.carYear == '' || filter.carYear == rentalCarYear) &&
    (filter.clientName == '' || filter.clientName == rentalClientName) &&
    (filter.licenseNumber == '' || filter.licenseNumber == rentalLicenseNumber)
  ); 
  
}

function handleFilteredRentals(filteredRentals) {
  const allRentals = document.querySelectorAll('.j-card');
  allRentals.forEach(rental => {
    const isTheSame = filteredRentals.some(filtered => filtered == rental); 
    
    if (isTheSame) {
      rental.classList.remove('hide');
    } else {
      rental.classList.add('hide');
    }
  });
}

function filterRentals(e) {
  e.preventDefault();
  const allRentals = Array.from(document.querySelectorAll('.j-card'));
  const userFilter = {
    carModel: 
      document.querySelector('.j-form-filterRents [name=car_model]').value.toLowerCase().trim(),
    carYear: 
      document.querySelector('.j-form-filterRents [name=car_year]').value.trim(),
    clientName: 
      document.querySelector('.j-form-filterRents [name=client_name]').value.toLowerCase().trim(),
    licenseNumber: 
      document.querySelector('.j-form-filterRents [name=license_number]').value.trim()
  }

  const filteredRentals = allRentals.filter((rental) => {
    return rentalMatchsFilter(rental, userFilter)
  });

  handleFilteredRentals(filteredRentals)
}
btnCreateRental.addEventListener('click', showCreateRentalModal);
createRentalModal.addEventListener('click', closeCreateRentalModal);
btnSaveRental.addEventListener('click', saveRental);
btnFilterRentals.addEventListener('click', showFilterModal);
filterRentalsModal.addEventListener('click', closeFilterRentalsModal);
btnShowFilteredRentals.addEventListener('click', filterRentals);