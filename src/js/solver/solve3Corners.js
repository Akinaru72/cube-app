export function solve3Corners1(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];
  let nextStep = false;
  if (
    !calcState.getCell('D', 0, 0).includes('G') ||
    !calcState.getCell('D', 0, 0).includes('O')
  ) {
    while (!nextStep) {
      if (
        calcState.getCell('D', 0, 2).includes('G') &&
        calcState.getCell('D', 0, 2).includes('R')
      ) {
        apply("D'");
        nextStep = true;
      } else if (
        calcState.getCell('D', 2, 2).includes('R') &&
        calcState.getCell('D', 2, 2).includes('B')
      ) {
        apply('D');
        apply('D');
        nextStep = true;
      } else if (
        calcState.getCell('D', 2, 0).includes('B') &&
        calcState.getCell('D', 2, 0).includes('O')
      ) {
        apply('D');
        nextStep = true;
      } else {
        apply("R'");
        apply("B'");
        apply("L'");
        apply('B');
        apply('R');
        apply("B'");
        apply('L');
        apply('B');
      }
    }
  }

  while (
    !calcState
      .getCell('D', 0, 2)
      .includes(calcState.getCell('D', 0, 1).slice(1))
  ) {
    apply("R'");
    apply("B'");
    apply("L'");
    apply('B');
    apply('R');
    apply("B'");
    apply('L');
    apply('B');
  }

  while (calcState.getCell('D', 0, 1) !== 'YG') {
    apply('D');
  }

  return solution;
}

export function solve3Corners2(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  for (let i = 0; i < 4; i++) {
    if (calcState.getCell('D', 2, 2).slice(1, 2) === 'Y') {
      apply("B'");
      apply('R');
      apply('B');
      apply("R'");
      apply("B'");
      apply('R');
      apply('B');
      apply("R'");
      apply('D');
    } else if (calcState.getCell('D', 2, 2).slice(2) === 'Y') {
      apply('R');
      apply("B'");
      apply("R'");
      apply('B');
      apply('R');
      apply("B'");
      apply("R'");
      apply('B');
      apply('D');
    } else {
      apply('D');
    }
  }

  return solution;
}
