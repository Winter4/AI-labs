let plagues = [
  "Ларингит острый",
  "Ларингит хронический катаральный",
  "Ларингит хронический гипертрофический",
  "Ларингит хронический атрофический",
];

let symptomes = [
  "Общее недомогание",
  "Сухость, першение",
  "Кашель сначала сухой, затем мокрый",
  "Голос хриплый или беззвучный",
  "Иногда боль при глотании",
  "Головная боль",
  "Повышенная температура тела",
  "Быстрая утомляемость гортани",
  "Периодический кашель с мокротой",
  "Охриплость с афонией",
  "Ощущение дискомфорта в гортани",
  "Жжение в горле",
  "Кашель при обострении",
  "Сухой кашель",
  "Слизистая покрыта густой слизью",
  "Откашливание с прожилками крови",
];

let match = [
  [true, true, true, true],
  [true, true, false, true],
  [true, false, false, false],
  [true, true, false, true],
  [true, false, false, false],
  [true, false, false, false],
  [true, false, false, false],
  [false, true, false, false],
  [false, true, false, false],
  [false, false, true, false],
  [false, false, true, false],
  [false, false, true, false],
  [false, false, true, false],
  [false, false, false, true],
  [false, false, false, true],
  [false, false, false, true],
];

let coefs = [
  [
    [0.47, 0.12],
    [0.48, 0.13],
    [0.46, 0.06],
    [0.5, 0.11],
  ],
  [
    [0.43, 0.1],
    [0.4, 0.1],
    [0, 0],
    [0.42, 0.1],
  ],
  [
    [0.23, 0.03],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  [
    [0.53, 0.2],
    [0.5, 0.13],
    [0, 0],
    [0.5, 0.2],
  ],
  [
    [0.48, 0.3],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  [
    [0.46, 0.12],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  [
    [0.4, 0.41],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [0.52, 0.11],
    [0, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [0.5, 0.11],
    [0, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [0, 0],
    [0.47, 0.32],
    [0, 0],
  ],
  [
    [0, 0],
    [0, 0],
    [0.49, 0.16],
    [0, 0],
  ],
  [
    [0, 0],
    [0, 0],
    [0.48, 0.32],
    [0, 0],
  ],
  [
    [0, 0],
    [0, 0],
    [0.52, 0.12],
    [0, 0],
  ],
  [
    [0, 0],
    [0, 0],
    [0, 0],
    [0.46, 0.13],
  ],
  [
    [0, 0],
    [0, 0],
    [0, 0],
    [0.47, 0.09],
  ],
  [
    [0, 0],
    [0, 0],
    [0, 0],
    [0.17, 0.09],
  ],
];

function randomParams() {
  const trust = Math.random().toFixed(2);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_number_between_two_values
  const notrust = (Math.random() * trust).toFixed(2);
  return [trust, notrust];
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

/**
 *
 * @param {integer} s symptome = row number
 * @param {integer} p plague = column number
 */
function toggleMatch(s, p) {
  let newMatch = clone(match);

  newMatch[s][p] = !newMatch[s][p];

  if (deny(newMatch)) return;

  match = clone(newMatch);

  getTable();
}

function deny(data) {
  if (!checkData(data)) {
    alert("Обнаружено вхождение, редактирование запрещено");
    return true;
  }
}

function checkData(table) {
  // plagues number
  const plaguesNum = plagues.length;

  const rootContains = (rootIndex, compIndex) => {
    // in rows
    for (const k in table) {
      // root doesn't have this symp & comp has == root isn't containing
      if (!table[k][rootIndex] && table[k][compIndex]) return false;
    }
    return true;
  };

  // let's call the plague in the 'i' loop 'root plague'
  for (let i = 0; i < plaguesNum; i++) {
    // and 'j' loop contains 'compared plague'
    for (let j = 0; j < plaguesNum; j++) {
      /**
       * the idea of the algorithm is "compared plague shouldn't be contained by root plague"
       *
       * compared plague is allowed to contain root plague, because in the end
       * every plague in the pair would be both root & compared
       * and would be checked in both ways
       */

      // not comparing the same plague
      if (i === j) continue;

      if (rootContains(i, j)) return false;
    }
  }

  return true;
}

function getSelectedOptions(selector) {
  // get selected options
  const { options } = selector;
  const marked = [];
  for (let opt of options) {
    marked.push(opt.selected);
  }

  return marked;
}

function removePlague(id) {
  plagues.splice(id, 1);

  // remove plague from the match array
  for (let m of match) {
    m.splice(id, 1);
  }

  getTable();
}

function onPlagueAdd(e) {
  e.preventDefault();

  const name = document.getElementById("plague-name");

  for (const plag of plagues) {
    if (plag.toLowerCase() === name.value.toLowerCase()) {
      alert("Такая болезнь уже существует");
      return;
    }
  }

  if (!name.value) return;

  // get this plague symptomes
  const symptomes = getSelectedOptions(
    document.getElementById("plague-select")
  );
  // tmp table
  const newMatch = clone(match);
  // add new plague to potential match
  for (let i in newMatch) {
    newMatch[i].push(symptomes[i]);
  }
  // check, if new table is valid
  if (deny(newMatch)) return;

  // if new match is valid, save it

  // update plague array
  plagues.push(name.value);

  // add symptomes to match table
  match = clone(newMatch);

  // update coefs table
  for (let symp of coefs) {
    symp.push(randomParams());
  }

  getTable();
}

function removeSymptome(id) {
  let tmp = clone(match);

  // remove symptome from the match array
  tmp.splice(id, 1);

  if (deny(tmp)) return;

  match = clone(tmp);
  symptomes.splice(id, 1);

  getTable();
  getSelect();
}

function onSymptomeAdd(e) {
  e.preventDefault();

  const name = document.getElementById("symptome-name");

  if (!name.value) return;
  // validate
  for (const symp of symptomes) {
    if (symp.toLowerCase() === name.value.toLowerCase()) {
      alert("Такой симптом уже существует");
      return;
    }
  }

  // update array
  symptomes.push(name.value);
  match.push(new Array(plagues.length).fill(false));

  // update coefs table
  const symp = new Array(plagues.length).forEach((item) =>
    item.push(randomParams())
  );
  coefs.push(symp);

  getTable();
  getSelect();
}

function plaguesRow() {
  html = "<tr>";
  html +=
    "<td><img src='./monster.png'> <p class='my-0'>Click cell to edit</p></td>";

  for (let i in plagues) {
    html += `<th>${plagues[i]} <img src='./trash.png' class='clickable' onclick='removePlague(${i})'></th>`;
  }
  html += "</tr>";

  return html;
}

function getTable() {
  let html = "";

  // header data
  html += `<thead>${plaguesRow()}</thead>`;
  // header data //

  // body data
  html += "<tbody>";
  for (let i in symptomes) {
    html += "<tr>";

    html += `<th>${symptomes[i]} <img src='./trash.png' onclick='removeSymptome(${i})'></th>`;

    for (let j in match[i]) {
      html += `<td class='clickable' onclick='toggleMatch(${i}, ${j})'>`;
      html += match[i][j] ? `${coefs[i][j][0]} - ${coefs[i][j][1]}` : "";
      html += "</td>";
    }

    html += "<tr>";
  }
  html += "</tbody>";
  // body data //

  // footer data
  html += `<tfoot>${plaguesRow()}</tfoot>`;
  // footer data //

  document.getElementById("db").innerHTML = html;
}

function getSelect() {
  const selectors = document.querySelectorAll("select");
  for (s of selectors) {
    s.innerHTML = "";

    for (let i in symptomes) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = symptomes[i];

      s.appendChild(opt);
    }

    s.setAttribute("size", symptomes.length);
    s.setAttribute("multiple", "");
  }
}

function onTest() {
  // get selected options
  const marked = getSelectedOptions(document.getElementById("test-select"));

  // this doesn't work properly
  /*
  const closests = new Array(match[0].length).fill({
    trust: 0,
    notrust: 0,
    coef: 0,
    plague: "",
  });
  */

  // results
  const closests = [];
  console.log("BEGIN", JSON.stringify(closests));
  console.log("___________________");

  // using formulas to calculate the result
  for (let i in match[0]) {
    closests.push({
      trust: 0,
      notrust: 0,
      coef: 0,
      plague: plagues[i],
    });
    console.log("close length", closests.length);

    for (let j in marked) {
      if (match[j][i]) {
        closests[i].trust = coefs[j][i][0] * (1 - closests[i].trust);
        closests[i].notrust = coefs[j][i][1] * (1 - closests[i].notrust);
        closests[i].coef = closests[i].trust - closests[i].notrust;
      }
    }

    console.log("end", JSON.stringify(closests[i]));
    console.log("full in loop", JSON.stringify(closests));
  }

  console.log("___________________");
  console.log("result", JSON.stringify(closests));

  // sort the results
  closests.sort((one, two) => {
    if (one.coef < two.coef) return 1;
    else if (one.coef > two.coef) return -1;
    else return 0;
  });

  // get first 3 elements of the sorted array
  const mostClose = closests.slice(0, 3);
  let text = "";
  for (plag of mostClose) {
    text += `
Болезнь: ${plag.plague}
Мера доверия: ${plag.trust.toFixed(5)}
Мера недоверия: ${plag.notrust.toFixed(5)}
К-нт уверенности: ${plag.coef.toFixed(5)}
`;
  }

  alert(text);
}

document.addEventListener("DOMContentLoaded", () => {
  getTable();
  getSelect();

  document
    .getElementById("symptome-submit")
    .addEventListener("click", onSymptomeAdd);

  document
    .getElementById("plague-submit")
    .addEventListener("click", onPlagueAdd);

  document.getElementById("test-button").addEventListener("click", onTest);
});
