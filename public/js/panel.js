const btnCreateRental = document.querySelector('.j-createRental');
const createRentalModal = document.querySelector('.j-modal-create');

function showCreateRentalModal(e) {
  createRentalModal.classList.add('show'); 
}

btnCreateRental.addEventListener('click', showCreateRentalModal);