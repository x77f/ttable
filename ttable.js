function preprocess(expression) {
  const cleanExpression = expression
    .toLowerCase()
    .trim()
    .replaceAll(/(xor)/g, "^")
    .replaceAll(/(not)|[!]/g, "~")
    .replaceAll(/(and)|[.]/g, "&")
    .replaceAll(/(or)|[+]/g, "|");

  return cleanExpression;
}

function evaulate(expression) {
  const letters = "abcdefghijklmnopqrstuvwxyz";

  const variables = [];

  let last = "";

  for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < expression.length; j++) {
      if (expression[j] === letters[i]) {
        if (expression[j] === last) continue;
        variables.push(expression[j]);
        last = expression[j];
      }
    }
  }

  const columns = variables.length;
  const rows = 2 ** columns;

  const inputs = [];

  for (let i = 0; i < rows; i++) {
    let bits = i.toString(2);

    if (bits.length < columns) {
      bits = [...String(bits).padStart(columns, "0")];
    }

    const numBits = [];

    for (let i = 0; i < bits.length; i++) {
      numBits[i] = Number(bits[i]);
    }

    inputs.push(numBits);
  }

  const operator = Function(variables, `return ${expression}`);

  const states = {
    boolean_logic: expression,
    variables: columns,
    states: rows,
  };

  for (let i = 0; i < rows; i++) {
    states[`state_${i + 1}`] = {
      inputs: {},
    };

    for (let j = 0; j < columns; j++) {
      states[`state_${i + 1}`]["inputs"][String.fromCharCode(97 + j)] =
        inputs[i][j];
    }

    states[`state_${i + 1}`]["output"] = Number(`${operator(...inputs[i])}`);
  }

  return states;
}

const input = document.getElementById("input");

const button = document.getElementById("submit");

button.addEventListener("click", () => {
  let inp = input.textContent;
  const obj = evaulate(preprocess(String(inp)));
  const out = JSON.stringify(obj, null, 4);

  document.getElementById(
    "logic"
  ).innerHTML = `<h2>LOGIC: <code style="color:red;">${obj.boolean_logic}</code></h2>`;
  document.getElementById("table").innerHTML = `<h2>TABLE:</h2>`;

  document.getElementById("board").innerText = `${out}`;
});
