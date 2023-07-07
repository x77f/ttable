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

  const vars = getVars(expr);
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
        states[`state_${i + 1}`]["inputs"][String.fromCharCode(97+j)] = cases[i][j];
      }

      states[`state_${i + 1}`]["output"] = `${logic(...cases[i])}`;
    }

    return states;
  }

  return Tabulize(cases, expr);
}
