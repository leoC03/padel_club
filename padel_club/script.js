const horariosBase = [];
for (let i = 9; i <= 23; i++) {
  horariosBase.push((i < 10 ? '0' : '') + i + ':00');
}

// Variables para elementos DOM
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const reservasSection = document.getElementById('reservas-section');
const operatorDashboard = document.getElementById('operator-dashboard');

window.onload = () => {
  cargarHorariosYReservas();
  loginSection.classList.remove('hidden');
  registerSection.classList.add('hidden');
  reservasSection.classList.add('hidden');
  operatorDashboard.classList.add('hidden');
};

function getUsuarioActivo() {
  return sessionStorage.getItem('usuarioActivo');
}

function cargarHorariosYReservas() {
  ['1', '2', '3'].forEach(cancha => {
    fetch(`get_reservations.php?cancha=${cancha}`)
      .then(response => response.json())
      .then(data => {
        const select = document.getElementById('horario' + cancha);
        select.innerHTML = '';
        horariosBase.forEach(hora => {
          const option = document.createElement('option');
          option.value = hora;
          option.textContent = hora;
          if (data.reservations.includes(hora)) option.disabled = true;
          select.appendChild(option);
        });
        const btn = document.getElementById('btn' + cancha);
        btn.disabled = horariosBase.every(h => data.reservations.includes(h));
        mostrarListaReservas(cancha);
      });
  });
  if (getUsuarioActivo() && localStorage.getItem('role_' + getUsuarioActivo()) === 'operador') {
    cargarReservasOperador();
  }
}

function mostrarListaReservas(cancha) {
  fetch(`get_reservations.php?cancha=${cancha}&user=${getUsuarioActivo()}`)
    .then(response => response.json())
    .then(data => {
      const lista = document.getElementById('lista' + cancha);
      lista.innerHTML = '';
      data.reservations.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r.time;
        lista.appendChild(li);
      });
    });
}

function reservar(cancha) {
  const select = document.getElementById('horario' + cancha);
  if (!select.value) return alert('Selecciona un horario');
  fetch('reserve.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `cancha=${cancha}&hora=${select.value}&user=${getUsuarioActivo()}`
  }).then(() => {
    cargarHorariosYReservas();
    alert(`Reserva realizada en Cancha ${cancha} a las ${select.value}`);
  });
}

function login() {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  if (!user || !pass) return alert('Completa usuario y contraseña');
  fetch('login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${user}&password=${pass}`
  }).then(response => response.json())
    .then(data => {
      if (data.success) {
        sessionStorage.setItem('usuarioActivo', user);
        localStorage.setItem('role_' + user, data.role);
        loginSection.classList.add('hidden');
        registerSection.classList.add('hidden');
        reservasSection.classList.remove('hidden');
        if (data.role === 'operador') operatorDashboard.classList.remove('hidden');
        cargarHorariosYReservas();
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    });
}

function showRegister() {
  loginSection.classList.add('hidden');
  registerSection.classList.remove('hidden');
}

function hideRegister() {
  registerSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
}

function register() {
  const user = document.getElementById('newUsername').value.trim();
  const pass = document.getElementById('newPassword').value.trim();
  if (!user || !pass) return alert('Completa usuario y contraseña');
  fetch('register.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${user}&password=${pass}&role=cliente`
  }).then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Usuario creado. Ahora inicia sesión.');
        hideRegister();
      } else {
        alert('El usuario ya existe');
      }
    });
}

function logout() {
  sessionStorage.removeItem('usuarioActivo');
  reservasSection.classList.add('hidden');
  operatorDashboard.classList.add('hidden');
  loginSection.classList.remove('hidden');
}

function cargarReservasOperador() {
  fetch('get_all_reservations.php')
    .then(response => response.json())
    .then(data => {
      const tbody = document.getElementById('reservations-body');
      tbody.innerHTML = '';
      data.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${r.user}</td>
          <td>Cancha ${r.court}</td>
          <td>${r.time}</td>
          <td><button class="delete-btn" onclick="eliminarReserva(${r.id})">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
      });
    });
}

function eliminarReserva(id) {
  if (confirm('¿Estás seguro de eliminar esta reserva?')) {
    fetch(`delete_reservation.php?id=${id}`, { method: 'POST' })
      .then(() => cargarReservasOperador())
      .then(() => cargarHorariosYReservas());
  }
  function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    if (!user || !pass) return alert('Completa usuario y contraseña');
    fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${user}&password=${pass}`
    }).then(response => response.json())
        .then(data => {
            if (data.success) {
                sessionStorage.setItem('usuarioActivo', user);
                localStorage.setItem('role_' + user, data.role);
                loginSection.classList.add('hidden');
                registerSection.classList.add('hidden');
                reservasSection.classList.remove('hidden');
                if (data.role === 'operador') operatorDashboard.classList.remove('hidden');
                cargarHorariosYReservas();
            } else {
                alert(data.error || 'Usuario o contraseña incorrectos');
            }
        })
        .catch(error => alert('Error de conexión: ' + error));
}
}