const btnAddCar = document.querySelector('.j-addCar');
const btnSaveCar = document.querySelector('.j-saveNewCar');
const fileInput = document.querySelector('input[type="file"]#image');
const modal = document.querySelector('.j-modal-add');
const deleteCarBtns = document.querySelectorAll('.j-delete-car');
const btnAcceptDeleteCar = document.querySelector('.j-accept-delete');
const btnCancelDeleteCar = document.querySelector('.j-cancel-delete');

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

function hideModal(e) {
  const clickTarget = e.target;
  if (clickTarget == modal) {
    modal.classList.remove('show');
  }
}

function showModal(e) {
  modal.classList.add('show');
}

function createCarCard(car) {
  const cardDIV = document.createElement('div');
  const car_imageHTML = car.image_name ? `<img src="/${car.image_name}" alt="">` :"No image";
  cardDIV.classList.add('card');
  cardDIV.setAttribute('data-carnumber', car.id);

  cardDIV.innerHTML = `
    ${car_imageHTML}
    <h3 class="car_model">${car.model}</h3>
    <p class="car_year">${car.year}</p>
    <p class="car_kilometers">${car.kilometers}</p>
    <div class="car_availability ${car.status}">${car.status}</div>
    <div class="delete-car j-delete-car ${car.status}">
            Delete Car
    </div>
    `;
  return cardDIV;
}

function setDeleteEvent() {
  const allDeleteBtns = document.querySelectorAll('.j-delete-car');
  allDeleteBtns.forEach(btn => btn.addEventListener('click', showDeleteModal));
}

function hanldeReceivedCars(data) {
  const carsContainer = document.querySelector('.j-carsDashboard');
  carsContainer.innerHTML = "";
  data.cars.forEach(car => {
    carsContainer.appendChild(createCarCard(car));
  });
  setDeleteEvent();
  modal.classList.remove('show');
  showMessageOfType('Car added', 'success');
}

function saveNewCar(e) {
  e.preventDefault();
  const url = '/async/saveNewCar';
  const data = new FormData(document.querySelector('.j-form-addCar'));
  fetch(url, {
    method: 'POST',
    body: data
  })
    .then(res => res.json())
    .catch(error => {
      showMessageOfType('There have been an error', 'error');
      console.error(error);
    })
    .then(hanldeReceivedCars);
}

function getImageAsData(image) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      resolve(fileReader.result);
    }

    fileReader.readAsDataURL(image);

  });

}

function manageImageInput(e) {
  const fileWasUploaded = fileInput.files.length > 0;
  const fileLabel = document.querySelector('.j-image-label');
  const textSpan = fileLabel.querySelector('span');

  if (fileWasUploaded) {
    getImageAsData(fileInput.files[0])
      .then((data)=> {
        fileLabel.style.backgroundImage = `url(${data})`;
        fileLabel.classList.add('uploaded')
        textSpan.textContent = "File added!"

      });
  } else {
    fileLabel.style.backgroundImage = `unset`;
    fileLabel.classList.remove('upload');
    textSpan.textContent = "Select file";
  }
}

function setCarInfoIntoModal(car, modal) {
  const carId = car.dataset.carnumber;
  const carImg = car.querySelector('img').cloneNode();
  const carModel = car.querySelector('.car_model').cloneNode(true);
  const carYear = car.querySelector('.car_year').cloneNode(true);
  const carKilometers = car.querySelector('.car_kilometers').cloneNode(true);

  modal.innerHTML = "";

  modal.setAttribute('data-carnumber', carId);
  modal.appendChild(carImg);
  modal.appendChild(carModel);
  modal.appendChild(carYear);
  modal.appendChild(carKilometers);
}

function showDeleteModal(e) {
  const deleteModal = document.getElementById('delete-modal');
  const modalContent = deleteModal.querySelector('.j-modal-carInfo');
  const carCard = this.parentNode;
  carCard.classList.add('selected');

  setCarInfoIntoModal(carCard, modalContent);
  deleteModal.classList.add('show');
}

function handleDeletedCarResponse(response) {
  const deleteModal = document.querySelector('#delete-modal');
  const carSelected = document.querySelector('.card.selected');
  deleteModal.classList.remove('show');
  if(response.car_deleted) {
    carSelected.remove();
    showMessageOfType('Car deleted', 'success');
  } else {
    showMessageOfType('There have been an error', 'error');
  }
}

function deleteCar(e) {
  const carId = document.querySelector('.j-modal-carInfo').dataset.carnumber;
  const url = '/async/deleteCar';
  fetch(url,
    {
      method: 'POST',
      body: JSON.stringify({carId}),
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then(res => res.json())
      .catch(err => showMessageOfType('There have been an error', 'error'))
      .then(handleDeletedCarResponse);
}

function cancelDelete(e) {
  const deleteModal = document.querySelector('#delete-modal');
  const selectedCar = document.querySelector('.card.selected');

  selectedCar.classList.remove('selected');
  deleteModal.classList.remove('show');
}

btnAddCar.addEventListener('click', showModal);
btnSaveCar.addEventListener('click', saveNewCar);
modal.addEventListener('click', hideModal);
fileInput.addEventListener('change', manageImageInput);
deleteCarBtns.forEach(btn => btn.addEventListener('click', showDeleteModal));
btnAcceptDeleteCar.addEventListener('click', deleteCar);
btnCancelDeleteCar.addEventListener('click', cancelDelete);