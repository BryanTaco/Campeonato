// Basic JavaScript for Campeonato app

document.addEventListener('DOMContentLoaded', function() {
  console.log('Campeonato app JS loaded');

  // Modal elements
  const createEquipoModal = document.getElementById('createEquipoModal');
  const openCreateEquipoModalBtn = document.getElementById('openCreateEquipoModal');
  const closeCreateEquipoModalBtn = document.getElementById('closeCreateEquipoModal');
  const createEquipoForm = document.getElementById('createEquipoForm');
  const createEquipoMessage = document.getElementById('createEquipoMessage');

  const createJugadorModal = document.getElementById('createJugadorModal');
  const openCreateJugadorModalBtn = document.getElementById('openCreateJugadorModal');
  const closeCreateJugadorModalBtn = document.getElementById('closeCreateJugadorModal');
  const createJugadorForm = document.getElementById('createJugadorForm');
  const createJugadorMessage = document.getElementById('createJugadorMessage');

  // Open and close modal functions
  if (openCreateEquipoModalBtn) {
    openCreateEquipoModalBtn.addEventListener('click', () => {
      createEquipoModal.style.display = 'block';
    });
  }
  if (closeCreateEquipoModalBtn) {
    closeCreateEquipoModalBtn.addEventListener('click', () => {
      createEquipoModal.style.display = 'none';
      createEquipoMessage.innerHTML = '';
      createEquipoForm.reset();
    });
  }

  if (openCreateJugadorModalBtn) {
    openCreateJugadorModalBtn.addEventListener('click', () => {
      createJugadorModal.style.display = 'block';
    });
  }
  if (closeCreateJugadorModalBtn) {
    closeCreateJugadorModalBtn.addEventListener('click', () => {
      createJugadorModal.style.display = 'none';
      createJugadorMessage.innerHTML = '';
      createJugadorForm.reset();
    });
  }

  // Close modals when clicking outside modal content
  window.addEventListener('click', (event) => {
    if (event.target == createEquipoModal) {
      createEquipoModal.style.display = 'none';
      createEquipoMessage.innerHTML = '';
      createEquipoForm.reset();
    }
    if (event.target == createJugadorModal) {
      createJugadorModal.style.display = 'none';
      createJugadorMessage.innerHTML = '';
      createJugadorForm.reset();
    }
  });

  // AJAX form submission for creating Equipo
  if (createEquipoForm) {
    createEquipoForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const formData = new FormData(createEquipoForm);
      fetch('/equipos/crear/', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          createEquipoMessage.innerHTML = '<p style="color:green;">Equipo creado exitosamente.</p>';
          // Optionally, refresh the page or update the equipos list dynamically
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          createEquipoMessage.innerHTML = '<p style="color:red;">Error: ' + data.error + '</p>';
        }
      })
      .catch(error => {
        createEquipoMessage.innerHTML = '<p style="color:red;">Error en la solicitud.</p>';
      });
    });
  }

  // AJAX form submission for creating Jugador
  if (createJugadorForm) {
    createJugadorForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const formData = new FormData(createJugadorForm);
      fetch('/jugadores/crear/', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          createJugadorMessage.innerHTML = '<p style="color:green;">Jugador creado exitosamente.</p>';
          // Optionally, refresh the page or update the jugadores list dynamically
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          createJugadorMessage.innerHTML = '<p style="color:red;">Error: ' + data.error + '</p>';
        }
      })
      .catch(error => {
        createJugadorMessage.innerHTML = '<p style="color:red;">Error en la solicitud.</p>';
      });
    });
  }
});
