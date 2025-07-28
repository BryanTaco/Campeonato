document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form");
  forms.forEach(form => {
    form.addEventListener("submit", e => {
      if (!form.checkValidity()) {
        e.preventDefault();
        alert("Por favor, completa todos los campos correctamente.");
      }
    });
  });
});
