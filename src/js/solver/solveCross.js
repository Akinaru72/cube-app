export function solveCross1(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  while (calcState.getCell('F', 1, 2).includes('W')) {
    while (calcState.getCell('D', 1, 2).includes('W')) {
      apply("D'");
    }
    apply("R'");
    apply("D'");
  }
  return solution;
}

export function solveCross2(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  let solution = [];
  const calcState = state.clone();

  while (calcState.getCell('R', 1, 2).includes('W')) {
    while (calcState.getCell('D', 2, 1).includes('W')) {
      apply("D'");
    }
    apply("B'");
    apply("D'");
  }
  return solution;
}

export function solveCross3(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  let solution = [];
  const calcState = state.clone();

  while (calcState.getCell('B', 1, 2).includes('W')) {
    while (calcState.getCell('D', 1, 0).includes('W')) {
      apply("D'");
    }
    apply("L'");
    apply("D'");
  }
  return solution;
}

export function solveCross4(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  let solution = [];
  const calcState = state.clone();

  while (calcState.getCell('L', 1, 2).includes('W')) {
    while (calcState.getCell('D', 0, 1).includes('W')) {
      apply("D'");
    }
    apply("F'");
    apply("D'");
  }
  return solution;
}

export function solveCross5(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  let solution = [];
  const calcState = state.clone();

  while (
    calcState.getCell('U', 0, 1).includes('W') ||
    calcState.getCell('U', 1, 0).includes('W') ||
    calcState.getCell('U', 1, 2).includes('W') ||
    calcState.getCell('U', 2, 1).includes('W')
  ) {
    while (!calcState.getCell('U', 1, 2).includes('W')) {
      apply('U');
    }
    while (calcState.getCell('D', 1, 2).includes('W')) {
      apply("D'");
    }
    apply("R'");
    apply("R'");
  }
  return solution;
}

export function solveCross6(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  let solution = [];
  const calcState = state.clone();

  while (
    calcState.getCell('D', 0, 1).slice(0, 1) !== 'W' ||
    calcState.getCell('D', 1, 0).slice(0, 1) !== 'W' ||
    calcState.getCell('D', 1, 2).slice(0, 1) !== 'W' ||
    calcState.getCell('D', 2, 1).slice(0, 1) !== 'W'
  ) {
    while (calcState.getCell('D', 1, 2).slice(1) !== 'W') {
      apply("D'");
    }
    apply('R');
    apply("D'");
    apply('F');
  }

  return solution;
}

export function solveCross7(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  let solution = [];
  const calcState = state.clone();

  while (calcState.getCell('D', 0, 1) !== 'WG') {
    apply("D'");
  }
  apply("F'");
  apply("F'");
  return solution;
}

export function solveCross8(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  let solution = [];
  const calcState = state.clone();

  while (calcState.getCell('D', 1, 2) !== 'WR') {
    apply("D'");
  }
  apply("R'");
  apply("R'");
  return solution;
}

export function solveCross9(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  let solution = [];
  const calcState = state.clone();

  while (calcState.getCell('D', 2, 1) !== 'WB') {
    apply("D'");
  }
  apply("B'");
  apply("B'");
  return solution;
}

export function solveCross10(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  let solution = [];
  const calcState = state.clone();

  while (calcState.getCell('D', 1, 0) !== 'WO') {
    apply("D'");
  }
  apply("L'");
  apply("L'");
  return solution;
}
