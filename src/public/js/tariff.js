document.addEventListener("DOMContentLoaded", () => {
  // Load header.html
  fetch('header.html')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(data => {
      const container = document.getElementById('header-container');
      container.innerHTML = data;

      // ===== Initialize Navbar Toggle AFTER header is loaded =====
      const navbarToggler = container.querySelector(".navbar-toggler");
      if (navbarToggler) {
        const togglerIcon = navbarToggler.querySelector(".toggler-icon");
        const navbarCollapse = container.querySelector("#navbarNav");

        if (navbarCollapse && togglerIcon) {
          // Listen for Bootstrap collapse events
          navbarCollapse.addEventListener("show.bs.collapse", () => {
            togglerIcon.classList.add("active"); // menu opening → X
          });
          navbarCollapse.addEventListener("hide.bs.collapse", () => {
            togglerIcon.classList.remove("active"); // menu closing → ☰
          });
        }
      }
    })
    .catch(err => console.error('Error loading header:', err));
});
