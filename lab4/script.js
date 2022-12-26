const StartPrecision = 0.01;
let chromosomes = [];
let chromosomeLength = 0;
let segmentsCount = 0;
let accuracy = 0;

function idel(id) {
  return document.getElementById(id);
}

function idval(id) {
  return document.getElementById(id).value;
}

function f(x) {
  //return 20 * Math.cos(x / 22) - 150;
  return (x - 10) * (x - 10) + 20;
}

function addChromosome(chr) {
  const start = idval("start");
  const x = +start + parseInt(chr, 2) * accuracy;
  chromosomes.push({
    binary: chr,
    x: x,
    y: f(x),
  });
}

function compare(a, b) {
  if (a.y < b.y) return -1;
  if (a.y > b.y) return 1;
  return 0;
}

function generateTable() {
  const table = idel("chromosomes-table");
  let html = "";

  html += `<thead><th>Хромосома</th> <th>x</th> <th>f(x)</th></thead>`;

  html += "<tbody>";
  for (let i = 0; i < chromosomes.length; i++) {
    html += "<tr>";
    html += `<td>${chromosomes[i].binary}</td>`;
    html += `<td>${chromosomes[i].x}</td>`;
    html += `<td>${chromosomes[i].y}</td>`;
    html += "</tr>";
  }
  html += "</tbody>";

  table.innerHTML = html;
}

function validateInputs() {
  const start = idval("start");
  const end = idval("end");
  const mutation = idval("mutation");
  const chromosomesCount = idval("chromosomes-count");
  const iterationsCount = idval("iterations-count");

  if (start >= end) {
    alert("Конец интервала должен быть больше его начала");
    return false;
  }
  if (mutation < 0 || mutation > 1) {
    alert("Мутация имеет интервал [0; 1]");
    return false;
  }
  if (chromosomesCount < 5 || mutation > 100) {
    alert("Количество хромосом имеет интервал [5; 100]");
    return false;
  }
  if (iterationsCount < 1 || iterationsCount > 100) {
    alert("Количество итерация имеет интервал [1; 100]");
    return false;
  }

  return true;
}

function choose() {
  let sum = 0;
  for (let i in chromosomes) sum += i + 1;

  let num = 0;
  const ch = Math.random();

  for (let i in chromosomes) {
    num += parseFloat((chromosomes.length - 1) / sum);
    if (ch <= num) return i;
  }

  return 0;
}

function generatePopulation() {
  if (!validateInputs()) return;

  const start = idval("start");
  const end = idval("end");

  segmentsCount = Math.floor((end - start) / StartPrecision);
  chromosomeLength = Math.ceil(Math.log2(segmentsCount));
  segmentsCount = Math.pow(2, chromosomeLength);

  accuracy = (end - start) / (segmentsCount - 1);

  chromosomes = [];
  const chromosomesCount = idval("chromosomes-count");
  for (let i = 0; i < chromosomesCount; i++) {
    let chr = "";
    for (let j = 0; j < chromosomeLength; j++) {
      if (Math.random() < 0.5) chr += "0";
      else chr += "1";
    }

    addChromosome(chr);
  }
  chromosomes.sort(compare);

  generateTable();
  document.getElementById("iterate").removeAttribute("disabled");
}

function crossingover(chr1, chr2) {
  const k = Math.floor(1 + Math.random() * (chromosomeLength - 1));

  const child1 = chr1.substring(0, k) + chr2.substring(k);
  const child2 = chr2.substring(0, k) + chr1.substring(k);

  return [child1, child2];
}

function mutation(chr) {
  const chance = idval("mutation");

  if (Math.random() < +chance) {
    const k = Math.floor(Math.random() * chromosomeLength);

    let arr = chr.split("");
    if (arr[k] == 0) arr[k] = 1;
    else arr[k] = 0;
    chr = arr.join("");
  }

  return chr;
}

function reduction() {
  let newChromosomes = [];

  const chromosomesCount = idval("chromosomes-count");
  for (let i = 0; i < chromosomesCount; i++) {
    let index = choose();
    newChromosomes.push(chromosomes[index]);
    chromosomes.splice(index, 1);
  }
  chromosomes = newChromosomes;
  chromosomes.sort(compare);
}

function iterate() {
  if (!validateInputs()) return;

  const iterationsCount = idval("iterations-count");

  for (let l = 0; l < iterationsCount; l++) {
    const parent1 = chromosomes[choose()];
    const parent2 = chromosomes[choose()];

    let [child1, child2] = crossingover(parent1.binary, parent2.binary);

    child1 = mutation(child1);
    child2 = mutation(child2);

    addChromosome(child1);
    addChromosome(child2);

    chromosomes.sort(compare);

    reduction();

    generateTable();
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  idel("generate").onclick = generatePopulation;
  idel("iterate").onclick = iterate;

  function disableIterate() {
    //idel('iterate').attributes.
    $("#iterate").attr("disabled", "disabled");
  }

  idel("start").onchange = disableIterate;
  idel("end").onchange = disableIterate;
  idel("mutation").onchange = disableIterate;

  idel("chromosomes-count").onchange = function () {
    idel("chromosomes-count-span").innerHTML = idel("chromosomes-count").value;
    disableIterate();
  };

  idel("iterations-count").onchange = function () {
    idel("iterations-count-span").innerHTML = idel("iterations-count").value;
    disableIterate();
  };
});
