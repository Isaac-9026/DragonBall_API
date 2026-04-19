let personajes = [];
let listaFiltrada = [];
let personajeSeleccionado = null;

document.addEventListener("DOMContentLoaded", function () {
  const selectRaza = document.getElementById("selectRaza");
  const btnMostrar = document.getElementById("btnMostrar");
  const tbody = document.getElementById("tbodyPersonajes");

  fetch("https://dragonball-api.com/api/characters?limit=100")
    .then((res) => res.json())
    .then((data) => {
      personajes = data.items || data;

      const razas = [...new Set(personajes.map((p) => p.race))];

      selectRaza.innerHTML = '<option value="">-- Seleccionar --</option>';

      razas.forEach((r) => {
        if (r) {
          selectRaza.innerHTML += `<option value="${r}">${r}</option>`;
        }
      });
    })
    .catch((err) => console.error("Error al cargar personajes:", err));

  btnMostrar.addEventListener("click", function () {
    const raza = selectRaza.value;

    if (!raza) {
      alert("Selecciona una raza");
      return;
    }

    listaFiltrada = personajes.filter((p) => p.race === raza);

    tbody.innerHTML = "";

    listaFiltrada.forEach((p, i) => {
      const fila = document.createElement("tr");

      fila.innerHTML = `
                <td>${i + 1}</td>
                <td>${p.name}</td>
                <td>${p.ki}</td>
                <td>${p.gender}</td>
                <td><button class="btnImagen">Ver imagen</button></td>
                <td><button class="btnDetalles">Ver</button></td>
            `;
      fila
        .querySelector(".btnImagen")
        .addEventListener("click", () => verImagen(p.image, p.name));

      fila
        .querySelector(".btnDetalles")
        .addEventListener("click", () => verDetalles(i));

      tbody.appendChild(fila);
    });
  });

  document
    .getElementById("btnVerTransformacion")
    .addEventListener("click", function () {
      const index = document.getElementById("selectTransformaciones").value;

      if (index === "") return;

      const t = personajeSeleccionado.transformations[index];

      document.getElementById("imgTransformacion").src = t.image;

      document.getElementById("descTransformacion").innerText =
        `Transformación: ${t.name} | Ki: ${t.ki}`;
    });
});

function verImagen(url, nombre) {
  document.getElementById("seccionTransformaciones").style.display = "block";

  document.getElementById("nombrePersonaje").innerText = nombre;
  document.getElementById("imgTransformacion").src = url;

  document.getElementById("descPersonaje").style.display = "none";
  document.getElementById("descTransformacion").style.display = "none";
  document.getElementById("selectTransformaciones").style.display = "none";
  document.getElementById("btnVerTransformacion").style.display = "none";
}

function verDetalles(index) {
  const personaje = listaFiltrada[index];

  fetch(`https://dragonball-api.com/api/characters/${personaje.id}`)
    .then((res) => res.json())
    .then((data) => {
      personajeSeleccionado = data;

      document.getElementById("seccionTransformaciones").style.display =
        "block";

      document.getElementById("nombrePersonaje").innerText = data.name;
      document.getElementById("imgTransformacion").src = data.image;

      document.getElementById("descPersonaje").style.display = "block";
      document.getElementById("descPersonaje").innerText = data.description;

      document.getElementById("descTransformacion").style.display = "block";
      document.getElementById("descTransformacion").innerText = "";

      document.getElementById("selectTransformaciones").style.display =
        "inline";
      document.getElementById("btnVerTransformacion").style.display = "inline";

      const select = document.getElementById("selectTransformaciones");
      select.innerHTML = '<option value="">-- Seleccionar transformacion --</option>';

      if (!data.transformations || data.transformations.length === 0) {
        document.getElementById("descTransformacion").innerText =
          "No tiene transformaciones";
        return;
      }

      data.transformations.forEach((t, i) => {
        select.innerHTML += `<option value="${i}">${t.name}</option>`;
      });
    })
    .catch((err) => console.error("Error al obtener detalles:", err));
}
