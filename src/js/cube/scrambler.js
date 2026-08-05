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

      if (last && last[0] === face) {
        continue;
      }

      if (prev && last && prev[0] === face && last[0] === OPPOSITE[face]) {
        continue;
      }

      scramble.push(move);
    }

    return scramble;
  }
}
