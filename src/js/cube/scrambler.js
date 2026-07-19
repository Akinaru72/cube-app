const FACES = ['U', 'D', 'L', 'R', 'F', 'B'];

const MODIFIERS = ['', "'", '2'];

const OPPOSITE = {
  U: 'D',
  D: 'U',
  L: 'R',
  R: 'L',
  F: 'B',
  B: 'F',
};

export class Scrambler {
  static generate(length = 20) {
    const scramble = [];

    while (scramble.length < length) {
      const face = FACES[Math.floor(Math.random() * FACES.length)];
      const modifier = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];

      const move = face + modifier;

      const last = scramble[scramble.length - 1];
      const prev = scramble[scramble.length - 2];

      // правило 1
      if (last && last[0] === face) {
        continue;
      }

      // правило 2
      if (prev && last && prev[0] === face && last[0] === OPPOSITE[face]) {
        continue;
      }

      scramble.push(move);
    }

    return scramble;
  }
}

// export function scramble(count = 20) {
//   let lastMove = null;
//   let prevMove = null;

//   for (let i = 0; i < count; i++) {
//     let move;

//     do {
//       const randomIndex = Math.floor(Math.random() * this.moves.length);
//       move = this.moves[randomIndex];

//       const face = move[0];

//       if (lastMove && face === lastMove[0]) {
//         move = null;
//         continue;
//       }

//       if (
//         prevMove &&
//         lastMove &&
//         face === prevMove[0] &&
//         lastMove[0] === OPPOSITE[face]
//       ) {
//         move = null;
//         continue;
//       }
//     } while (!move);

//     this[move]();

//     prevMove = lastMove;
//     lastMove = move;
//   }
// }
