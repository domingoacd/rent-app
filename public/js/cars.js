const btnAddCar = document.querySelector('.j-addCar');
const btnSaveCar = document.querySelector('.j-saveNewCar');
const fileInput = document.querySelector('input[type="file"]#image');
const  modal = document.querySelector('.j-modal-add');

function hideModal(e) {
  const clickTarget = e.target;
  if (clickTarget == modal) {
    modal.classList.remove('show');
  }
}

function showModal(e) {
  modal.classList.add('show');
}

function hanldeReceivedCars(cars) {
  console.log(cars);
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
    .catch(error => console.error(error))
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

btnAddCar.addEventListener('click', showModal);
btnSaveCar.addEventListener('click', saveNewCar);
modal.addEventListener('click', hideModal);
fileInput.addEventListener('change', manageImageInput);