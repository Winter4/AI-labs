const descriptions = [
  { id: 0, data: "Мокрое" },
  { id: 1, data: "Живое" },
  { id: 2, data: "Человек" },
  { id: 3, data: "Больше человека" },
];

const targets = ["Виктор Цой", "Слон", "Золотая рыбка", "Планета"];

// numbers are the descriptions IDs
const match = [
  [1, 2],
  [1, 3],
  [0, 1],
  [3, 4],
];

const handler = {
  // global descriptions array
  descriptions: [],

  // current description
  current: null,

  // 'yes' mentioned descriptions
  yes: [],
};

// needed such logic and couldn't access google
function descriptionsHas(name) {
  for (const desc of descriptions) {
    if (desc.data.toLowerCase() === name.toLowerCase()) return true;
  }

  return false;
}

function targetsHas(name) {
  for (const t of targets) {
    if (t.toLowerCase() === name.toLowerCase()) return true;
  }

  return false;
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

// check if answers match to any target
function matches(answers) {
  if (answers.length === 2) {
    for (const i in match) {
      if (
        (match[i][0] == answers[0].id && match[i][1] == answers[1].id) ||
        (match[i][1] == answers[0].id && match[i][0] == answers[1].id)
      ) {
        return targets[i];
      }
    }

    return false;
  }
}

function hide(element) {
  element.classList.add("hidden");
}

function show(element) {
  element.classList.remove("hidden");
}

function onTest() {
  // descriptions queue
  handler.descriptions = clone(descriptions).sort(() => Math.random() - 0.5);

  // clear the values
  handler.yes = [];
  handler.current = null;
  document.getElementById("result-text").innerHTML = "";

  // set the question block
  show(document.getElementById("test"));
  hide(document.getElementById("test-button"));
  hide(document.getElementById("result"));
  hide(document.getElementById("target-input"));

  // begin asking
  ask(handler.descriptions);
}

function ask(queue) {
  // get the next question
  handler.current = queue.shift();
  document.getElementById("description").innerHTML = handler.current.data;
}

// answer button handler
function onAnswer(value) {
  // 'yes' button pressed
  if (value) {
    handler.yes.push(handler.current);
  }

  // 2 positive answers
  if (handler.yes.length === 2) {
    const result = matches(handler.yes);
    if (result) return showResult(result);

    return newTarget(handler.yes.length);
  }

  // no more questions left
  if (handler.descriptions.length === 0) {
    return newTarget(handler.yes.length);
  }

  return ask(handler.descriptions);
}

function showResult(result) {
  document.getElementById("result-text").innerHTML = result;
  show(document.getElementById("result"));
  hide(document.getElementById("test"));
  show(document.getElementById("test-button"));
}

// handle 'new target' flow
function newTarget(positiveAnswersNum) {
  // descriptions to fill
  const descToFill = 2 - positiveAnswersNum;

  // hide the question
  hide(document.getElementById("test"));

  // show the inputs
  show(document.getElementById("target-label-1"));
  show(document.getElementById("target-label-2"));
  show(document.getElementById("target-label-name"));

  // freeze the inputs
  document.getElementById("target-input-1").disabled = false;
  document.getElementById("target-input-2").disabled = false;

  // unfreeze if needed
  if (descToFill === 2) {
    document.getElementById("target-input-1").disabled = false;
    document.getElementById("target-input-2").disabled = false;
  }

  if (descToFill === 1) {
    const input = document.getElementById("target-input-1");
    input.value = handler.yes[0].data;
    input.disabled = true;
  }

  if (descToFill === 0) {
    const inputs = [];
    inputs.push(document.getElementById("target-input-1"));
    inputs.push(document.getElementById("target-input-2"));

    inputs[0].value = handler.yes[0].data;
    inputs[1].value = handler.yes[1].data;

    inputs[0].disabled = true;
    inputs[1].disabled = true;
  }

  show(document.getElementById("target-input"));
}

// target adding handler
function onAddTarget() {
  const inputs = [];
  inputs.push(document.getElementById("target-input-1"));
  inputs.push(document.getElementById("target-input-2"));
  const target = document.getElementById("target-input-name").value;

  if (!inputs[0].value || !inputs[1].value || !target) {
    alert("Пустой инпут запрещён");
    return;
  }

  // check descriptions collissions
  for (const i of inputs) {
    if (!i.disabled && descriptionsHas(i.value)) {
      alert("Характеристика " + i.data + " уже существует");
      return;
    }
  }

  // check target collisions
  if (targetsHas(target)) {
    alert("Объект " + target + " уже существует");
    return;
  }

  // add new data
  const thisDescs = clone(handler.yes);
  for (const i of inputs) {
    if (!i.disabled) {
      const desc = {
        id: descriptions.length,
        data: i.value,
      };

      descriptions.push(desc);
      thisDescs.push(desc);
    }
  }
  targets.push(target);
  match.push([thisDescs[0].id, thisDescs[1].id]);

  hide(document.getElementById("target-input"));
  show(document.getElementById("test-button"));
  alert("Добавлено");

  // clear the values
  inputs[0].value =
    inputs[1].value =
    document.getElementById("target-input-name").value =
      "";

  console.log(match);
}
