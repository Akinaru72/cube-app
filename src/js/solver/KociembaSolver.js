// test

class KociembaSolver {
  constructor(phase1, phase2) {
    this.phase1 = phase1;
    this.phase2 = phase2;

    this.best = Infinity;

    this.bestPhase1 = [];
    this.bestPhase2 = [];
    this.bestSolution = [];
  }
  updateBest(sol1, sol2) {
    this.best = sol1.length + sol2.length;

    this.bestPhase1 = [...sol1];
    this.bestPhase2 = [...sol2];

    this.bestSolution = [...sol1, ...sol2];
  }
  shouldRunPhase2(phase1Length, estimate) {
    return phase1Length + estimate < this.best;
  }
}
