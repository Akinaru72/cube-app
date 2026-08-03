export function solveMiddle1(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  if (
    calcState.getCell('B', 1, 0) === 'BR' ||
    calcState.getCell('B', 1, 0).includes('Y')
  ) {
    return solution;
  }
  console.log('solveMiddle1', calcState.getCell('B', 2, 1).includes('Y'));
  while (!calcState.getCell('B', 2, 1).includes('Y')) {
    apply('D');
  }
  apply('D');
  apply('R');
  apply("D'");
  apply("R'");
  apply("D'");
  apply("B'");
  apply('D');
  apply('B');
  return solution;
}

export function solveMiddle2(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  if (
    calcState.getCell('R', 1, 0) === 'RG' ||
    calcState.getCell('R', 1, 0).includes('Y')
  ) {
    return solution;
  }
  console.log('solveMiddle1', calcState.getCell('R', 2, 1).includes('Y'));
  while (!calcState.getCell('R', 2, 1).includes('Y')) {
    apply('D');
  }
  apply('D');
  apply('F');
  apply("D'");
  apply("F'");
  apply("D'");
  apply("R'");
  apply('D');
  apply('R');
  return solution;
}

export function solveMiddle3(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  if (
    calcState.getCell('F', 1, 0) === 'GO' ||
    calcState.getCell('F', 1, 0).includes('Y')
  ) {
    return solution;
  }
  console.log('solveMiddle1', calcState.getCell('F', 2, 1).includes('Y'));
  while (!calcState.getCell('F', 2, 1).includes('Y')) {
    apply('D');
  }
  apply('D');
  apply('L');
  apply("D'");
  apply("L'");
  apply("D'");
  apply("F'");
  apply('D');
  apply('F');
  return solution;
}

export function solveMiddle4(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  if (
    calcState.getCell('L', 1, 0) === 'OB' ||
    calcState.getCell('L', 1, 0).includes('Y')
  ) {
    return solution;
  }
  console.log('solveMiddle1', calcState.getCell('L', 2, 1).includes('Y'));
  while (!calcState.getCell('L', 2, 1).includes('Y')) {
    apply('D');
  }
  apply('D');
  apply('B');
  apply("D'");
  apply("B'");
  apply("D'");
  apply("L'");
  apply('D');
  apply('L');
  return solution;
}

export function solveMiddle5(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  if (calcState.getCell('B', 1, 0) === 'BR') {
    return solution;
  }

  while (
    !calcState.getCell('B', 2, 1).includes('B') ||
    !calcState.getCell('B', 2, 1).includes('R')
  ) {
    apply('D');
  }
  if (calcState.getCell('B', 2, 1) === 'BR') {
    apply('D');
    apply('R');
    apply("D'");
    apply("R'");
    apply("D'");
    apply("B'");
    apply('D');
    apply('B');
  } else {
    apply("D'");
    apply("D'");
    apply("B'");
    apply('D');
    apply('B');
    apply("R'");
    apply('B');
    apply('R');
    apply("B'");
  }

  return solution;
}

export function solveMiddle6(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  if (calcState.getCell('R', 1, 0) === 'RG') {
    return solution;
  }

  while (
    !calcState.getCell('R', 2, 1).includes('R') ||
    !calcState.getCell('R', 2, 1).includes('G')
  ) {
    apply('D');
  }
  if (calcState.getCell('R', 2, 1) === 'RG') {
    apply('D');
    apply('F');
    apply("D'");
    apply("F'");
    apply("D'");
    apply("R'");
    apply('D');
    apply('R');
  } else {
    apply("D'");
    apply("D'");
    apply("R'");
    apply('D');
    apply('R');
    apply("F'");
    apply('R');
    apply('F');
    apply("R'");
  }

  return solution;
}

export function solveMiddle7(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  if (calcState.getCell('F', 1, 0) === 'GO') {
    return solution;
  }

  while (
    !calcState.getCell('F', 2, 1).includes('G') ||
    !calcState.getCell('F', 2, 1).includes('O')
  ) {
    apply('D');
  }
  if (calcState.getCell('F', 2, 1) === 'GO') {
    apply('D');
    apply('L');
    apply("D'");
    apply("L'");
    apply("D'");
    apply("F'");
    apply('D');
    apply('F');
  } else {
    apply("D'");
    apply("D'");
    apply("F'");
    apply('D');
    apply('F');
    apply("L'");
    apply('F');
    apply('L');
    apply("F'");
  }

  return solution;
}

export function solveMiddle8(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  if (calcState.getCell('L', 1, 0) === 'OB') {
    return solution;
  }

  while (
    !calcState.getCell('L', 2, 1).includes('O') ||
    !calcState.getCell('L', 2, 1).includes('B')
  ) {
    apply('D');
  }
  if (calcState.getCell('L', 2, 1) === 'OB') {
    apply('D');
    apply('B');
    apply("D'");
    apply("B'");
    apply("D'");
    apply("L'");
    apply('D');
    apply('L');
  } else {
    apply("D'");
    apply("D'");
    apply("L'");
    apply('D');
    apply('L');
    apply("B'");
    apply('L');
    apply('B');
    apply("L'");
  }

  return solution;
}
