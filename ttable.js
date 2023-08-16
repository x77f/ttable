function TruthTable(str) {
  const expr = str
    .toLowerCase()
    .trim()
    .replaceAll(/(xor)/g, "^")
    .replaceAll(/(not)|~/g, "!")
    .replaceAll(/(and)|[.]/g, "&")
    .replaceAll(/(or)|[+]/g, "|");

  function getVars(logic) {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const vars = [];

    let last = "";

    for (let i = 0; i < letters.length; i++) {
      for (let j = 0; j < logic.length; j++) {
        if (logic[j] === letters[i]) {
          if (logic[j] === last) continue;
          vars.push(logic[j]);
          last = logic[j];
        }
      }
    }

    return vars;
  }

  let vars = getVars(expr);

  if (vars.length < 0 || vars.length > 4) {
    throw new Error(
      `The expression ''${expr}' containes either no variable or more than 4 variables.`,
      { cause: { code: "LimitError" } },
    );
  }

  if (vars.length === 1 && expr.search(/[\^\&\|]+/g) !== -1) {
    throw new Error(
      `The expression '${expr}' contains only one variable but one or more binary operators.`,
      { cause: { code: "OperatorError" } },
    );
  }

  const logic = Function(vars, `return ${expr}`);

  function inputsFor(rows, columns) {
    const inputLines = [];

    for (let i = 0; i < rows; i++) {
      let bits = i.toString(2);

      if (bits.length < columns) {
        bits = [...String(bits).padStart(columns, "0")];
      }
      const numBits = [];
      for (let i = 0; i < bits.length; i++) {
        numBits[i] = Number(bits[i]);
      }

      inputLines.push(numBits);
    }

    return inputLines;
  }

  const columns = vars.length;
  const rows = 2 ** columns;

  const cases = inputsFor(rows, columns);

  function Tabulize(cases, expr) {
    const states = {};
    for (let i = 0; i < rows; i++) {
      states[`state_${i + 1}`] = {
        logic: expr,
        inputs: {},
      };

      for (let j = 0; j < columns; j++) {
        states[`state_${i + 1}`]["inputs"][String.fromCharCode(97 + j)] =
          cases[i][j];
      }

      states[`state_${i + 1}`]["output"] = Number(`${logic(...cases[i])}`);
    }

    return states;
  }

  return Tabulize(cases, expr);
}

// This section is for testing.
// Recommended Runtime: Node.js

try {
  console.log(TruthTable("a xor b and c or d"));
} catch (err) {
  console.log(`${err.cause.code}: ${err.message}`);
}
