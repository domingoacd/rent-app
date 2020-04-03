function handleFormFields(e) {
  const selected_account_type = e.target.value;
  const fields_to_show = document.querySelector(`.fields-container[data-fields=${selected_account_type}]`);
  const fields_to_hide = document.querySelector('.fields-container.show');
  
  if (fields_to_hide) {
    fields_to_hide.classList.remove('show');
    fields_to_hide.querySelectorAll('input').forEach(input => input.removeAttribute('required'));
  }
  
  fields_to_show.classList.add('show');
  fields_to_show.querySelectorAll('input').forEach(input => input.setAttribute('required', 'required'));
}


function handleSignUpInput() {
  const account_type_select = document.querySelector('select[name="account_type"]');
  account_type_select.addEventListener('change', handleFormFields);
}

handleSignUpInput();