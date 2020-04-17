const btnAddCar = document.querySelector('.j-addCar');
const fileInput = document.querySelector('input[type="file"]#image');

function addCar(e) {
  const  modal = document.querySelector('.j-modal-add');
  modal.classList.add('show');
}

function manageImageInput(e) {
  const fileUploaded = fileInput.files.length > 0;
  const fileLabel = document.querySelector('.j-image-label');
  const textSpan = fileLabel.querySelector('span');
  const fileReader = new FileReader();

  if (fileUploaded) {

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

btnAddCar.addEventListener('click', addCar);
fileInput.addEventListener('change', manageImageInput);