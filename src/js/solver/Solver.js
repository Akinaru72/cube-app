// Solver.js

import { MOVE_NAMES } from './constantsSolver';

export class Solver {
  constructor(coTable, eoTable, udsTable, coPruning, eoPruning, udsPruning) {
    this.coTable = coTable;
    this.eoTable = eoTable;
    this.udsTable = udsTable;

    this.coPruning = coPruning;
    this.eoPruning = eoPruning;
    this.udsPruning = udsPruning;

    this.cpPruningPhase2 = null;
    this.epPruningPhase2 = null;
    this.ePermPruningPhase2 = null;

    this.bestLength = Infinity;
    this.bestPhase1 = [];
    this.bestPhase2 = [];
    this.solution = [];
  }

  heuristic(co, eo, uds) {
    return Math.max(
      this.coPruning[co],
      this.eoPruning[eo],
      this.udsPruning[uds]
    );
  }

  setPhase2Pruning(cp, ep, ePerm) {
    this.cpPruningPhase2 = cp;
    this.epPruningPhase2 = ep;
    this.ePermPruningPhase2 = ePerm;
  }

  solve(cube) {
    const co = cube.encodeCO();
    const eo = cube.encodeEO();
    const uds = cube.encodeUDSlice();

    this.bestLength = Infinity;
    this.bestPhase1 = [];
    this.bestPhase2 = [];

    let depth = this.heuristic(co, eo, uds);

    while (true) {
      console.log('depth =', depth);
      this.solution = [];

      if (this.search(co, eo, uds, depth, -1, -1, cube)) {
        return [...this.solution];
      }

      depth++;
    }
  }

  search(co, eo, uds, depth, lastMove, prevMove, cube) {
    const h = this.heuristic(co, eo, uds);
    if (h > depth) return false;
    if (depth === 0) {
      if (!(co === 0 && eo === 0 && uds === 0)) {
        return false;
      }

      const cubeG1 = cube.clone();

      cubeG1.applyAlgorithm(this.solution);

      const cp = cubeG1.encodeCP();
      const ep = cubeG1.encodeEP();
      const ePerm = cubeG1.encodeEPerm();

      const h2 = Math.max(
        this.cpPruningPhase2[cp],
        this.epPruningPhase2[ep],
        this.ePermPruningPhase2[ePerm]
      );

      console.log('G1', this.solution.length, 'Phase2 estimate =', h2);
      return true;
    }
    for (let move = 0; move < 18; move++) {
      const face = Math.floor(move / 3);
      const nextCO = this.coTable[co][move];
      const nextEO = this.eoTable[eo][move];
      const nextUDS = this.udsTable[uds][move];
      const lastFace = lastMove === -1 ? -1 : Math.floor(lastMove / 3);
      const prevFace = prevMove === -1 ? -1 : Math.floor(prevMove / 3);

      if (face === lastFace) continue;
      const opposite = [3, 4, 5, 0, 1, 2];

      if (face === prevFace && lastFace === opposite[face]) continue;
      this.solution.push(MOVE_NAMES[move]);

      if (
        this.search(nextCO, nextEO, nextUDS, depth - 1, move, lastMove, cube)
      ) {
        return true;
      }
      this.solution.pop();
    }

    return false;
  }
}
