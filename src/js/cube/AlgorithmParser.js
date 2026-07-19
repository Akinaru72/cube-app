// import { MOVES } from './constants';

export class AlgorithmParser {
  constructor(moves) {
    // this.moves = MOVES;
    // console.log(this.moves);
  }
  parse(sequence) {
    const result = [];
    const tokens = sequence.trim().split(/\s+/);
    for (let token of tokens) {
      let count = 1;

      if (token.endsWith('2')) {
        count = 2;
        token = token.slice(0, -1);
      }

      if (token.endsWith("'")) {
        token = token.slice(0, -1) + 'Prime';
      }
      for (let i = 0; i < count; i++) {
        const validMoves = [
          'R',
          'RPrime',
          'L',
          'LPrime',
          'U',
          'UPrime',
          'D',
          'DPrime',
          'F',
          'FPrime',
          'B',
          'BPrime',
        ];

        if (!validMoves.includes(token)) {
          throw new Error(`Unknown move: ${token}`);
        }

        result.push(token);
      }
    }
    return result;
  }
}
