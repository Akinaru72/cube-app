// function getCell(face, r, c) {
//   return this.faces[face][r][c];
// }

export function solve1Corners1(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  console.log('solve1Corners1', calcState.getCell('U', 2, 2).includes('W'));
  while (
    calcState.getCell('U', 0, 0).includes('W') ||
    calcState.getCell('U', 0, 2).includes('W') ||
    calcState.getCell('U', 2, 0).includes('W') ||
    calcState.getCell('U', 2, 2).includes('W')
  ) {
    console.log('ECNM');
    while (!calcState.getCell('U', 2, 2).includes('W')) {
      apply('U');
    }
    while (calcState.getCell('D', 0, 0).includes('W')) {
      apply("D'");
    }
    apply("R'");
    apply('D');
    apply('R');
  }

  while (calcState.getCell('U', 2, 1) !== 'WG') {
    apply('U');
  }

  while (
    !calcState.getCell('D', 0, 2).includes('R') ||
    !calcState.getCell('D', 0, 2).includes('G') ||
    !calcState.getCell('D', 0, 2).includes('W')
  ) {
    apply('D');
  }

  if (calcState.getCell('D', 0, 2).slice(0, 1) === 'R') {
    apply("R'");
    apply("D'");
    apply('R');
  } else if (calcState.getCell('D', 0, 2).slice(0, 1) === 'G') {
    apply('F');
    apply('D');
    apply("F'");
  } else {
    apply("R'");
    apply("D'");
    apply("D'");
    apply('R');
    apply('D');
    apply("R'");
    apply("D'");
    apply('R');
  }
  // console.log('EXIt');
  return solution;
}

export function solve1Corners2(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  // console.log('solve1Corners2', calcState.getCell('D', 2, 2).includes('W'));

  while (
    !calcState.getCell('D', 2, 2).includes('B') ||
    !calcState.getCell('D', 2, 2).includes('R') ||
    !calcState.getCell('D', 2, 2).includes('W')
  ) {
    apply('D');
  }

  if (calcState.getCell('D', 2, 2).slice(0, 1) === 'B') {
    apply("B'");
    apply("D'");
    apply('B');
  } else if (calcState.getCell('D', 2, 2).slice(0, 1) === 'R') {
    apply('R');
    apply('D');
    apply("R'");
  } else {
    apply("B'");
    apply("D'");
    apply("D'");
    apply('B');
    apply('D');
    apply("B'");
    apply("D'");
    apply('B');
  }
  // console.log('EXIt');
  return solution;
}

export function solve1Corners3(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  // console.log('solve1Corners2', calcState.getCell('D', 2, 2).includes('W'));

  while (
    !calcState.getCell('D', 2, 0).includes('O') ||
    !calcState.getCell('D', 2, 0).includes('B') ||
    !calcState.getCell('D', 2, 0).includes('W')
  ) {
    apply('D');
  }

  if (calcState.getCell('D', 2, 0).slice(0, 1) === 'O') {
    apply("L'");
    apply("D'");
    apply('L');
  } else if (calcState.getCell('D', 2, 0).slice(0, 1) === 'B') {
    apply('B');
    apply('D');
    apply("B'");
  } else {
    apply("L'");
    apply("D'");
    apply("D'");
    apply('L');
    apply('D');
    apply("L'");
    apply("D'");
    apply('L');
  }
  // console.log('EXIt');
  return solution;
}

export function solve1Corners4(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  // console.log('solve1Corners2', calcState.getCell('D', 2, 2).includes('W'));

  while (
    !calcState.getCell('D', 0, 0).includes('G') ||
    !calcState.getCell('D', 0, 0).includes('O') ||
    !calcState.getCell('D', 0, 0).includes('W')
  ) {
    apply('D');
  }

  if (calcState.getCell('D', 0, 0).slice(0, 1) === 'G') {
    apply("F'");
    apply("D'");
    apply('F');
  } else if (calcState.getCell('D', 0, 0).slice(0, 1) === 'O') {
    apply('L');
    apply('D');
    apply("L'");
  } else {
    apply("F'");
    apply("D'");
    apply("D'");
    apply('F');
    apply('D');
    apply("F'");
    apply("D'");
    apply('F');
  }
  // console.log('EXIt');
  return solution;
}
