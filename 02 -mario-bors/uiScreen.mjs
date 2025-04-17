// Node.JS// 


// aplicando lo aprendido en node 
// 1.1 expoortacion de modulos con .mjs 

// Asegúrate de exportar la función sumaScore
export function sumaScore() {
  // vamos a agarrar el div con el id score y le ponemos de froma dinamica el score
  const scoreElement = document.getElementById("score");
  scoreElement.innerText = score;
}

// aqui agrega mas funciones que necesites






// aqui agregamos las funciones como llaves en un objeto para destructuralo en el HTML y especificar exactamente de esta forma cual funcion de las que creamos queremos exportar
module.exports = {
  sumaScore,
};
