export function solve3Corners1(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];
  // console.log(calcState.getCell('D', 0, 0));
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
        // console.log('Corner2 in PLACE');
        apply("D'");
        nextStep = true;
      } else if (
        calcState.getCell('D', 2, 2).includes('R') &&
        calcState.getCell('D', 2, 2).includes('B')
      ) {
        // console.log('Corner3 in PLACE');
        apply('D');
        apply('D');
        nextStep = true;
      } else if (
        calcState.getCell('D', 2, 0).includes('B') &&
        calcState.getCell('D', 2, 0).includes('O')
      ) {
        // console.log('Corner4 in PLACE');
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
        // console.log('MOVE ');
      }
    }
  }
  // console.log('NEXT STEP');
  // console.log(
  //   calcState.getCell('D', 0, 2).includes(calcState.getCell('D', 0, 1).slice(1))
  // );

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

  // console.log('fullname', calcState.getCell('D', 2, 2));
  // console.log('right', calcState.getCell('D', 2, 2).slice(1, 2));
  // console.log('down', calcState.getCell('D', 2, 2).slice(2));

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
      // console.log('MoveLeft');
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
      // console.log('MoveUP');
    } else {
      apply('D');
    }
  }

  return solution;
}
