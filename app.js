let ramosData = [];
let ramosAprobados = JSON.parse(localStorage.getItem("ramosAprobados")) || [];

async function cargarRamos() {
  const res = await fetch("ramos.json");
  const data = await res.json();
  ramosData = data;
  renderMalla();
}

function renderMalla() {
  const contenedor = document.getElementById("malla");
  contenedor.innerHTML = "";

  const semestres = {};

  // Organizar ramos por semestre
  ramosData.forEach(ramo => {
    if (!semestres[ramo.semestre]) {
      semestres[ramo.semestre] = [];
    }
    semestres[ramo.semestre].push(ramo);
  });

  // Generar bloques de semestres
  Object.keys(semestres).sort((a, b) => a - b).forEach(semestreNum => {
    const bloque = document.createElement("div");
    bloque.className = "semestre";
    bloque.innerHTML = `<h2>Semestre ${semestreNum}</h2>`;

    semestres[semestreNum].forEach(ramo => {
      const btn = document.createElement("button");
      btn.textContent = ramo.nombre;
      btn.className = "ramo";
      btn.dataset.nombre = ramo.nombre;

      // Verifica si está aprobado
      if (ramosAprobados.includes(ramo.nombre)) {
        btn.classList.add("aprobado");
      } else if (ramo.prerequisitos.length > 0 && !prerequisitosCumplidos(ramo)) {
        btn.classList.add("bloqueado");
      } else {
        btn.classList.add("pendiente");
      }

      btn.addEventListener("click", () => {
        if (!btn.classList.contains("bloqueado")) {
          aprobarRamo(ramo.nombre);
        }
      });

      bloque.appendChild(btn);
    });

    contenedor.appendChild(bloque);
  });
}

function prerequisitosCumplidos(ramo) {
  return ramo.prerequisitos.every(nombre => ramosAprobados.includes(nombre));
}

function aprobarRamo(nombre) {
  if (!ramosAprobados.includes(nombre)) {
    ramosAprobados.push(nombre);
    localStorage.setItem("ramosAprobados", JSON.stringify(ramosAprobados));
    renderMalla(); // Redibujar con cambios
  }
}

cargarRamos();
