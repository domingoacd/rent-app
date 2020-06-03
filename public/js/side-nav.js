(function() {
  const sideNav = document.getElementById('side-nav');
  let btnToogleSideNav = null;

  function toggleNav(e) {
    sideNav.classList.toggle('show');
  }

  if (sideNav) {
    btnToogleSideNav = document.getElementById('toggle-nav');
    btnToogleSideNav.addEventListener('click', toggleNav);
  }
})()