const btnCreateRental = document.querySelector('.j-createRental');
const btnSaveRental = document.querySelector('.j-saveRental');
const btnFilterRentals = document.querySelector('.j-filter');
const btnShowFilteredRentals = document.querySelector('.j-searchRentals');
const btnDeleteRental = document.querySelectorAll('.j-delete-car');
const createRentalModal = document.querySelector('.j-modal-create');
const filterRentalsModal = document.querySelector('.j-modal-filter');
const carSelect = document.querySelector('select#car');
const clientSelect = document.querySelector('select#client');
const sortRentalsSelect = document.querySelector('#sort');

function showMessageOfType(message, type) {
  const messageContainer = document.querySelector('.j-message-box');
  messageContainer.classList.add(type, 'show');
  messageContainer.textContent = message;
  setTimeout(() => {
    messageContainer.classList.remove('show');
  }, 2000);
  setTimeout(() => {
    messageContainer.classList.remove(type);
  }, 2500);
}
function resetModalOptions() {
  carSelect.innerHTML = "<option disabled selected value=''>Select a car</option>";
  clientSelect.innerHTML = "<option disabled selected value=''>Select a client</option>";
}

function closeCreateRentalModal(e) {
  const clieckedTarget = e.target;
  if (clieckedTarget == createRentalModal) {
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
  resetModalOptions();
  getCarsToInsert();
  getClientsToInsert();
  insertCurrentDate();
  createRentalModal.classList.add('show');
}

function setCarInfoIntoCard(info, card) {
  const carInfo = info.car.textContent.split('-');
  let kilometers = '';

  for(let index = 0; index < carInfo.length; index++) {
    let infoContainer = '';

    if (index == 0) {
      infoContainer = document.createElement('h3');
      infoContainer.classList.add('car_model', 'j-carModel');
      infoContainer.textContent = carInfo[index];
    } else if (index == 1) {
      kilometers = carInfo[index].toLowerCase().replace('km', '')
      infoContainer = document.createElement('p');
      infoContainer.classList.add('car_kilometers');
      infoContainer.innerHTML = `Kilometers: <span>${kilometers}</span>`;

    } else {
      infoContainer = document.createElement('p');
      infoContainer.classList.add('car_year');
      infoContainer.innerHTML = `Year: <span class="j-carYear">${carInfo[index]}</span>`;
    }
    card.appendChild(infoContainer);
  }
}
function setClientInfoIntoCard(info, card) {
  const clientInfo = info.client.textContent.split('-');
  let licenseNumber = '';
  for (let index = 0; index < clientInfo.length; index++) {
    const infoContainer = document.createElement('p');
    if (index ==0) {
      infoContainer.classList.add('client_name');
      infoContainer.innerHTML = `Client: <span class='j-clientName'>${clientInfo[index]}</span>`
    } else {
      licenseNumber = clientInfo[index].split(':')[1];
      infoContainer.classList.add('license_number')
      infoContainer.innerHTML = `License: <span class='j-licenseNumber'>${licenseNumber}</span>`;
    }
    
    card.appendChild(infoContainer);
  }
}

function setDatesIntoCard(data, card) {
  const returnDateContainer = document.createElement('p');
  const creationDateContainer = document.createElement('p');
  let {returnDate, creationDate} = data;

  returnDate = `${returnDate.split('-')[2]}-${returnDate.split('-')[1]}-${returnDate.split('-')[0]}`;
  creationDate = 
    `${creationDate.split('/')[0]}-${creationDate.split('/')[1]}-${creationDate.split('/')[2]}`;

    creationDateContainer.classList.add('rental_date');
    returnDateContainer.classList.add('return_date');

    creationDateContainer.innerHTML =`Rental date: <span class="j-returnDate">${creationDate}</span>`;
    returnDateContainer.innerHTML =`Return: <span class="j-returnDate">${returnDate}</span>`;

  card.appendChild(returnDateContainer);
  card.appendChild(creationDateContainer);
}

function insertRentalCard(rentalId) {
  const dashboard = document.querySelector('.j-cardsContainer');
  const carId = document.querySelector('select#car').value; 
  const clientId = document.querySelector('select#client').value; 
  const cardContainer = document.createElement('div');
  const cardData = {
    car: document.querySelector(`select#car option[value="${carId}"]`),
    client: document.querySelector(`select#client option[value="${clientId}"]`),
    creationDate: document.querySelector('input#creationDate').value,
    returnDate: document.querySelector('input#returnDate').value,
    createdBy: document.querySelector('select#createdBy').value
  };
  const cardImage = document.createElement('img');
  
  cardImage.src = cardData.car.dataset.image;
  cardContainer.classList.add('card', 'j-card');
  cardContainer.setAttribute('data-rentalnumber', rentalId);

  cardContainer.appendChild(cardImage);
  setCarInfoIntoCard(cardData, cardContainer);
  setClientInfoIntoCard(cardData, cardContainer);
  setDatesIntoCard(cardData, cardContainer);
  
  dashboard.insertBefore(cardContainer, dashboard.firstChild);
  createRentalModal.classList.remove('show');
}

function handleSavedRental(response) {
  const {rentalWasCreated, rentalId} = response;
   
  if (rentalWasCreated) {
    insertRentalCard(rentalId);
    showMessageOfType('New rental added!', 'success');
  } else {
    showMessageOfType(`Error, rental wasn't created, 'error`);
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

function getCardWithSmallerDate(card1, card2, dateField) {
  const firstDate = card1.querySelector(`${dateField}`).textContent.split('-').map(el => Number(el));
  const secondDate = 
          card2 ? 
          card2.querySelector(`${dateField}`).textContent.split('-').map(el => Number(el)) 
          : false;
  let cardWithSmallerDate = '';
  if (secondDate) {
    if(firstDate[2] > secondDate[2]) {
      cardWithSmallerDate = card2;
    } else if (secondDate[2] > firstDate[2] ) {
      cardWithSmallerDate = card1;
    } else {
      if (firstDate[1] > secondDate[1]) {
        cardWithSmallerDate = card2;
      } else if (secondDate[1] > firstDate[1]) {
        cardWithSmallerDate = card1;
      } else {
        if (firstDate[0] > secondDate[0]) {
          cardWithSmallerDate = card2;
        } else {
          cardWithSmallerDate = card1;
        }
      }
    }
  } else {
    cardWithSmallerDate = card1;
  }
  return cardWithSmallerDate;
}

function insertSortedRentals(rentals) {
  const container = document.querySelector('.j-cardsContainer');
  rentals.forEach(rental => {
    container.appendChild(rental)
  });
}
function sortRentals(e) {
  const sortBy = e.target.value; 
  const rentals = Array.from(document.querySelectorAll('.j-card'));
  const sortParams = {
    return_date: '.j-returnDate',
    creation_date: '.j-rentalDate'
  };
  const dateToCompare = sortParams[sortBy];
  let sortedCards = [];
  let currentCard = '';
  let nextCard = '';
  rentals.forEach(rental => rental.remove());

  for (let currentPosition = 0; currentPosition < rentals.length; currentPosition) {
    currentCard = rentals[currentPosition];
    for (let nextPosition = currentPosition + 1; nextPosition <= rentals.length; nextPosition++) {
      nextCard = rentals[nextPosition];
      currentCard = getCardWithSmallerDate(currentCard, nextCard, dateToCompare);
      if (nextPosition == rentals.length -1 || rentals.length == 1) {
        sortedCards.push(currentCard);
        rentals.splice(rentals.indexOf(currentCard), 1);
        currentPosition = 0;
      }
    }
  }
  
  insertSortedRentals(sortedCards);
}

function removeRental (rentalId) {
  const rental = document.querySelector(`.j-card[data-rentalnumber="${rentalId}"]`);
  rental.remove();
}

function handleDeletedRental(response) {
  const {rentalWasDeleted, id} = response;

  if (rentalWasDeleted) {
    removeRental(id);
    showMessageOfType('Rental deleted!', 'success');
  } else {
    showMessageOfType(`Error, rental couldn't be deleted, 'error`);
  }
}

function deleteRental(e) {
  const rentalToDelete = {rental: this.parentNode.dataset.rentalnumber};
  const url = '/async/deleteRental';
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify(rentalToDelete)
  })
  .then(data => data.json())
  .catch(err => console.log(err))
  .then(handleDeletedRental);
}

btnCreateRental.addEventListener('click', showCreateRentalModal);
createRentalModal.addEventListener('click', closeCreateRentalModal);
btnSaveRental.addEventListener('click', saveRental);
btnFilterRentals.addEventListener('click', showFilterModal);
filterRentalsModal.addEventListener('click', closeFilterRentalsModal);
btnShowFilteredRentals.addEventListener('click', filterRentals);
sortRentalsSelect.addEventListener('change', sortRentals);
btnDeleteRental.forEach(rental => rental.addEventListener('click', deleteRental));