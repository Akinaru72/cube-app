export function solve3Cross1(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];

  while (
    calcState.getCell('D', 0, 1).slice(0, 1) !== 'Y' ||
    calcState.getCell('D', 1, 0).slice(0, 1) !== 'Y' ||
    calcState.getCell('D', 1, 2).slice(0, 1) !== 'Y' ||
    calcState.getCell('D', 2, 1).slice(0, 1) !== 'Y'
  ) {
    if (
      calcState.getCell('D', 0, 1).slice(0, 1) !== 'Y' &&
      calcState.getCell('D', 1, 0).slice(0, 1) !== 'Y' &&
      calcState.getCell('D', 1, 2).slice(0, 1) !== 'Y' &&
      calcState.getCell('D', 2, 1).slice(0, 1) !== 'Y'
    ) {
      apply('B');
      apply('R');
      apply('D');
      apply("R'");
      apply("D'");
      apply("B'");
      // console.log('TRUE-*');
    } else if (
      calcState.getCell('D', 0, 1).slice(0, 1) ===
        calcState.getCell('D', 2, 1).slice(0, 1) ||
      calcState.getCell('D', 1, 0).slice(0, 1) ===
        calcState.getCell('D', 1, 2).slice(0, 1)
    ) {
      if (
        calcState.getCell('D', 0, 1).slice(0, 1) === 'Y' &&
        calcState.getCell('D', 2, 1).slice(0, 1) === 'Y'
      ) {
        apply('D');
      } else {
        apply('B');
        apply('R');
        apply('D');
        apply("R'");
        apply("D'");
        apply("B'");
        // console.log('ON PLACE-||');
      }
    } else {
      if (
        calcState.getCell('D', 0, 1).slice(0, 1) === 'Y' &&
        calcState.getCell('D', 1, 2).slice(0, 1) === 'Y'
      ) {
        apply('D');
        apply('D');
        apply('D');
      } else if (
        calcState.getCell('D', 1, 2).slice(0, 1) === 'Y' &&
        calcState.getCell('D', 2, 1).slice(0, 1) === 'Y'
      ) {
        apply('D');
        apply('D');
      } else if (
        calcState.getCell('D', 2, 1).slice(0, 1) === 'Y' &&
        calcState.getCell('D', 1, 0).slice(0, 1) === 'Y'
      ) {
        apply('D');
      } else {
        apply('B');
        apply('D');
        apply('R');
        apply("D'");
        apply("R'");
        apply("B'");
        // console.log('ON PLACE-Г');
      }
    }
  }

  return solution;
}

export function solve3Cross2(state) {
  function apply(move) {
    calcState.move(move);
    solution.push(move);
  }
  const calcState = state.clone();
  let solution = [];
  const colorArrow = 'OGRBOGRBO';

  let testStr =
    calcState.getCell('D', 0, 1).slice(1) +
    calcState.getCell('D', 1, 2).slice(1) +
    calcState.getCell('D', 2, 1).slice(1) +
    calcState.getCell('D', 1, 0).slice(1);

  while (!colorArrow.includes(testStr)) {
    if (
      colorArrow.includes(
        calcState.getCell('D', 1, 2).slice(1) +
          calcState.getCell('D', 2, 1).slice(1)
      )
    ) {
      apply('D');
      apply('D');
      apply('D');
    } else if (
      colorArrow.includes(
        calcState.getCell('D', 2, 1).slice(1) +
          calcState.getCell('D', 1, 0).slice(1)
      )
    ) {
      apply('D');
      apply('D');
    } else if (
      colorArrow.includes(
        calcState.getCell('D', 1, 0).slice(1) +
          calcState.getCell('D', 0, 1).slice(1)
      )
    ) {
      apply('D');
    }
    apply('R');
    apply('D');
    apply("R'");
    apply('D');
    apply('R');
    apply('D');
    apply('D');
    apply("R'");
    testStr = '';
    testStr =
      calcState.getCell('D', 0, 1).slice(1) +
      calcState.getCell('D', 1, 2).slice(1) +
      calcState.getCell('D', 2, 1).slice(1) +
      calcState.getCell('D', 1, 0).slice(1);
  }
  while (calcState.getCell('D', 0, 1) !== 'YG') {
    apply('D');
  }

  return solution;
}
