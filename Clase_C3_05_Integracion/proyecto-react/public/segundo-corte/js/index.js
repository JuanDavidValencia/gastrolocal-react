import { comidas } from "./comidas.js"

//input del buscador
const buscador = document.querySelector("input");

// Obtengo el contenedor de comidas
const contenedor = document.querySelector(".tarjetas");


function mostrarComidas(comidas){

  for (let comida of comidas){

    contenedor.innerHTML += `
      <section class="tarjeta">
        <div>
            <h3>${comida.nombre}</h3>
            <p>${comida.restaurante}</p>
            <img src=${comida.imagen}>
            <p>Precio: ${comida.precio}</p>
            <div class="tarjeta-accion">
                <span>¡Pídelo Ya!</span>
                <button>Ordenar</button>
            </div>
        </div>
      </section>
    `
  }
}

// Creo la función para buscar
function buscar() {
  
  const texto = buscador.value.toLowerCase();

  const comidasFiltradas = comidas.filter(comida => comida.nombre.toLowerCase().includes(texto))

  contenedor.innerHTML = ""

  if (comidasFiltradas.length === 0){
    mostrarComidas(comidas)
  } else {
    mostrarComidas(comidasFiltradas)
  }

}

mostrarComidas(comidas)

// Cada vez que el usuario escribe, ejecuto la función buscar
buscador.addEventListener("input", buscar);