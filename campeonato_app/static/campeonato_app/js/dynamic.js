function factorial(n) {
  return (n <= 1) ? 1 : n * factorial(n - 1);
}

function combinaciones(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function generarCombinaciones() {
  const equipos = 6;
  const partidos = combinaciones(equipos, 2);
  document.getElementById('resultadoCombinaciones').innerText =
    `Posibles partidos únicos entre ${equipos} equipos: ${partidos}`;
}

function buscarCaminoMasCorto() {
  const grafo = {
    A: ["B", "C"],
    B: ["D"],
    C: ["D", "E"],
    D: ["F"],
    E: ["F"],
    F: []
  };

  const bfs = (inicio, destino) => {
    const visitados = new Set();
    const cola = [[inicio]];

    while (cola.length > 0) {
      const camino = cola.shift();
      const nodo = camino[camino.length - 1];

      if (nodo === destino) return camino;
      if (!visitados.has(nodo)) {
        grafo[nodo].forEach(vecino => {
          cola.push([...camino, vecino]);
        });
        visitados.add(nodo);
      }
    }

    return null;
  };

  const camino = bfs("A", "F");
  document.getElementById('resultadoGrafo').innerText =
    `Camino más corto entre A y F: ${camino.join(" ➝ ")}`;
}
