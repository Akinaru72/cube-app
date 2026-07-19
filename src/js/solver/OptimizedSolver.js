// Phase1Enumerator.js

import { MOVE_NAMES } from './constantsSolver';

export class OptimizedSolver {
  constructor(
    coTable,
    eoTable,
    udsTable,
    coPruning,
    eoPruning,
    udsPruning,
    phase2
  ) {
    this.coTable = coTable;
    this.eoTable = eoTable;
    this.udsTable = udsTable;

    this.coPruning = coPruning;
    this.eoPruning = eoPruning;
    this.udsPruning = udsPruning;

    this.phase2 = phase2;
    this.best = Infinity;
    this.solution = [];

    this.g1Set = new Set();
    this.maxG1 = 20;
  }

  heuristic(co, eo, uds) {
    return Math.max(
      this.coPruning[co],
      this.eoPruning[eo],
      this.udsPruning[uds]
    );
  }

  solve(cube, best) {
    this.best = best;
    this.g1List = [];
    const co = cube.encodeCO();
    const eo = cube.encodeEO();
    const uds = cube.encodeUDSlice();

    let depth = this.heuristic(co, eo, uds);

    while (true) {
      console.log('depth =', depth);

      this.solution = [];

      this.search(co, eo, uds, depth, -1, -1, cube);

      if (this.g1List.length >= this.maxG1) {
        return this.g1List;
      }

      depth++;
    }
  }

  search(co, eo, uds, depth, lastMove, prevMove, cube) {
    const h = this.heuristic(co, eo, uds);

    if (h > depth) return false;
    if (co === 0 && eo === 0 && uds === 0) {
      console.log('FOUND G1 AT DEPTH', depth, this.solution.join(' '));
    }
    if (depth === 0) {
      if (!(co === 0 && eo === 0 && uds === 0)) return false;

      const cubeG1 = cube.clone();
      cubeG1.applyAlgorithm(this.solution);

      const cp = cubeG1.encodeCP();
      const ep = cubeG1.encodeEP();
      const ePerm = cubeG1.encodeEPerm();

      const estimate = this.phase2.estimate(cp, ep, ePerm);
      const total = this.solution.length + estimate;

      console.log({
        phase1: this.solution.length,
        estimate,
        total,
      });
      // saveCandidate(candidate);

      this.saveCandidate({
        phase1: [...this.solution],
        cp,
        ep,
        ePerm,
        estimate,
        total,
      });

      return false;
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

  saveCandidate(candidate) {
    const key = `${candidate.cp}_${candidate.ep}_${candidate.ePerm}`;

    if (this.g1Set.has(key)) {
      return;
    }

    this.g1Set.add(key);
    this.g1List.push(candidate);
    console.log('g1List', this.g1List);

    this.g1List.sort((a, b) => a.total - b.total);

    if (this.g1List.length > this.maxG1) {
      this.g1List.pop();
    }

    // this.best = this.g1List[0].total;
  }
}
