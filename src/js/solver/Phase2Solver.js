// const PHASE2_MOVES = [
//   0,
//   1,
//   2, // U U2 U'
//   4, // R2
//   7, // F2
//   9,
//   10,
//   11, // D D2 D'
//   13, // L2
//   16, // B2
// ];

import { PHASE2_MOVE_NAMES, MOVE_NAMES } from './constantsSolver';

export class Phase2Solver {
  constructor(
    cpTable,
    epTable,
    ePermTable,
    cpPruning,
    epPruning,
    ePermPruning
  ) {
    this.cpTable = cpTable;
    this.epTable = epTable;
    this.ePermTable = ePermTable;

    this.cpPruning = cpPruning;
    this.epPruning = epPruning;
    this.ePermPruning = ePermPruning;

    this.solution = [];
  }

  heuristic(cp, ep, ePerm) {
    return Math.max(
      this.cpPruning[cp],
      this.epPruning[ep],
      this.ePermPruning[ePerm]
    );
  }

  solve(cube, maxDepth = 15) {
    this.nodes = 0;

    const cp = cube.encodeCP();
    const ep = cube.encodeEP();
    const ePerm = cube.encodeEPerm();

    for (
      let depth = this.heuristic(cp, ep, ePerm);
      depth <= maxDepth;
      depth++
    ) {
      this.nodes = 0;
      const start = performance.now();

      this.solution = [];

      if (this.search(cp, ep, ePerm, depth, -1)) {
        console.log(
          `Depth ${depth} | time ${(performance.now() - start).toFixed(1)} ms | nodes ${this.nodes}`
        );
        return [...this.solution];
      }

      console.log(
        `Depth ${depth} | time ${(performance.now() - start).toFixed(1)} ms | nodes ${this.nodes}`
      );
    }

    return null;
  }

  search(cp, ep, ePerm, depth, lastMove) {
    this.nodes++;

    const h = this.heuristic(cp, ep, ePerm);

    if (h > depth) return false;

    if (depth === 0) {
      return cp === 0 && ep === 0 && ePerm === 0;
    }

    for (let move = 0; move < 10; move++) {
      const face = PHASE2_MOVE_NAMES[move][0];

      if (lastMove !== -1) {
        const lastFace = PHASE2_MOVE_NAMES[lastMove][0];

        if (face === lastFace) continue;
      }

      const nextCP = this.cpTable[cp][move];
      const nextEP = this.epTable[ep][move];
      const nextEPerm = this.ePermTable[ePerm][move];

      this.solution.push(PHASE2_MOVE_NAMES[move]);

      if (this.search(nextCP, nextEP, nextEPerm, depth - 1, move)) {
        return true;
      }

      this.solution.pop();
    }

    return false;
  }

  estimate(cp, ep, ePerm) {
    return Math.max(
      this.cpPruning[cp],
      this.epPruning[ep],
      this.ePermPruning[ePerm]
    );
  }

  // solve(cube) {
  //   this.nodes = 0;

  //   const cp = cube.encodeCP();
  //   const ep = cube.encodeEP();
  //   const ePerm = cube.encodeEPerm();

  //   // console.log('START', cp, ep, ePerm);

  //   for (let depth = this.heuristic(cp, ep, ePerm); depth <= 18; depth++) {
  //     // console.log('Depth =', depth);

  //     this.solution = [];

  //     if (this.search(cp, ep, ePerm, depth, -1)) {
  //       // console.log('Nodes =', this.nodes);
  //       return [...this.solution];
  //     }
  //   }

  //   return null;
  // }

  // solve(cube) {
  //   const cp = cube.encodeCP();
  //   const ep = cube.encodeEP();
  //   const ePerm = cube.encodeEPerm();

  //   console.log(cp, ep, ePerm);

  //   this.nodes = 0;

  //   const h = this.heuristic(cp, ep, ePerm);

  //   console.log('Initial heuristic =', h);

  //   for (let depth = h; depth <= 18; depth++) {
  //     this.solution = [];

  //     console.log('Depth =', depth);

  //     if (this.search(cp, ep, ePerm, depth, -1, -1)) {
  //       console.log('Nodes =', this.nodes);
  //       return this.solution;
  //     }
  //   }
  // }

  // search(cp, ep, ePerm, depth, lastMove, prevMove) {
  //   this.nodes++;
  //   const h = this.heuristic(cp, ep, ePerm);

  //   if (depth <= 1) {
  //     console.log({
  //       depth,
  //       h,
  //       cp,
  //       ep,
  //       ePerm,
  //       cpH: this.cpPruning[cp],
  //       epH: this.epPruning[ep],
  //       ePermH: this.ePermPruning[ePerm],
  //     });
  //   }

  //   if (h > depth) return false;
  //   if (depth === 0) {
  //     return cp === 0 && ep === 0 && ePerm === 0;
  //   }

  //   for (const move of PHASE2_MOVES) {
  //     const face = Math.floor(move / 3);

  //     const lastFace = lastMove === -1 ? -1 : Math.floor(lastMove / 3);

  //     const prevFace = prevMove === -1 ? -1 : Math.floor(prevMove / 3);

  //     if (face === lastFace) continue;

  //     const opposite = [3, 4, 5, 0, 1, 2];

  //     if (face === prevFace && lastFace === opposite[face]) continue;

  //     const nextCP = this.cpTable[cp][move];
  //     const nextEP = this.epTable[ep][move];
  //     const nextEPerm = this.ePermTable[ePerm][move];

  //     this.solution.push(MOVE_NAMES[move]);

  //     if (this.search(nextCP, nextEP, nextEPerm, depth - 1, move, lastMove)) {
  //       return true;
  //     }

  //     this.solution.pop();
  //   }
  // }
}
