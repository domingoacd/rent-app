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

function saveNewCar(e) {
  e.preventDefault();
  const url = '/async/saveNewCar';
  const data = {
    "model" : document.getElementById('model').value,
    "year" : document.getElementById('year').value,
    "kilometers" : document.getElementById('kilometers').value,
    "image" : document.getElementById('image').value
  };
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json'
    }
  })
    .then(res => res.json())
    .catch(error => console.error(error))
    .then(wewe => console.log(wewe));
}

function manageImageInput(e) {
  const fileWasUploaded = fileInput.files.length > 0;
  const fileLabel = document.querySelector('.j-image-label');
  const textSpan = fileLabel.querySelector('span');
  const fileReader = new FileReader();

  if (fileWasUploaded) {
    
    fileReader.onload = () => {
      fileLabel.style.backgroundImage = `url(${fileReader.result})`;
      fileLabel.classList.add('uploaded')
      textSpan.textContent = "File added!"
    };

    fileReader.readAsDataURL(fileInput.files[0]);
  } else {

    fileLabel.style.backgroundImage = `url(${fileReader.result})`;
    fileLabel.classList.remove('upload');
    textSpan.textContent = "Select file";
  }
}

btnAddCar.addEventListener('click', showModal);
btnSaveCar.addEventListener('click', saveNewCar);
modal.addEventListener('click', hideModal);
fileInput.addEventListener('change', manageImageInput);