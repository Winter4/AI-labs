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

/**
 *
 * @param {integer} s symptome = row number
 * @param {integer} p plague = column number
 */
function toggleMatch(s, p) {
  let newMatch = match.slice();

  newMatch[s][p] = !newMatch[s][p];

  if (deny(newMatch)) return;

  match = newMatch.slice();

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
  }

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

  if (!name.value) return;
  // validate
  for (const plag of plagues) {
    if (plag.toLowerCase() === name.value.toLowerCase()) {
      alert('Такая болезнь уже существует');
      return;
    }
  }

  // get this plague symptomes
  const symptomes = getSelectedOptions(
    document.getElementById("plague-select")
  );
  // tmp table
  const newMatch = match.slice();
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
  match = newMatch.slice();

  getTable();
}

function removeSymptome(id) {
  let tmp = match.slice();

  // remove symptome from the match array
  tmp.splice(id, 1);

  if (deny(tmp)) return;

  match = tmp.slice();
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
      alert('Такой симптом уже существует');
      return;
    }
  }

  // update array
  symptomes.push(name.value);
  match.push(new Array(plagues.length).fill(false));

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

    html += `<th>${symptomes[i]} <img src='./trash.png' class='clickable' onclick='removeSymptome(${i})'></th>`;

    for (let j in match[i]) {
      html += `<td class="clickable" onclick='toggleMatch(${i}, ${j})'>`;
      html += match[i][j] ? "+" : "";
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
  console.log("marked", marked);

  const checkPlague = (id) => {
    for (let i in match) {
      // compare DB and selected
      if (match[i][id] !== marked[i]) {
        return false;
      }
    }

    return true;
  };

  // for all plagues
  for (let i in plagues) {
    if (checkPlague(i)) {
      alert(`Ваша болезнь - ${plagues[i]}`);
      return;
    }
  }

  alert("Ваша болезнь нам незнакома");
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
