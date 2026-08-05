import { Solver } from './Solver.js';
import { CubeState } from './CubeState.js';
import { Phase2Solver } from './Phase2Solver.js';
import { OptimizedSolver } from './OptimizedSolver.js';

export async function solveCube(cubeState) {
  const response = await fetch(`${import.meta.env.BASE_URL}tables.json`);
  const tables = await response.json();
  const solver = new Solver(
    tables.coTable,
    tables.eoTable,
    tables.udsTable,
    tables.coPruning,
    tables.eoPruning,
    tables.udsPruning
  );

  solver.setPhase2Pruning(
    tables.cpPruning,
    tables.epPruning,
    tables.ePermPruning
  );
  // --------------------solution1-----------------------
  // scramble
  // cubeState.applyAlgorithm("R' D F L U");
  // cubeState.applyAlgorithm("U R B' R' D2 F2 D' R' B");
  // cubeState.applyAlgorithm("R2 U F2 D2 L2 U' B2 R2 D' B2 U L F U2 L' B'");
  // cubeState.applyAlgorithm(
  //   "R U2 F' L2 D B U' R2 F2 D' L U B2 R' U2 L2 D' F R B'"
  // );

  // Phase 1
  const solution1 = solver.solve(cubeState);
  console.log('solution1', solution1);
  const cubeG1 = cubeState.clone();
  cubeG1.applyAlgorithm(solution1);

  console.log('CO =', cubeG1.encodeCO());
  console.log('EO =', cubeG1.encodeEO());
  console.log('UDSlice =', cubeG1.encodeUDSlice());

  const cp = cubeG1.encodeCP();
  const ep = cubeG1.encodeEP();
  const ePerm = cubeG1.encodeEPerm();

  console.log('CP =', cp);
  console.log('EP =', ep);
  console.log('EPerm =', ePerm);

  const phase2 = new Phase2Solver(
    tables.cpTable,
    tables.epTable,
    tables.ePermTable,
    tables.cpPruning,
    tables.epPruning,
    tables.ePermPruning
  );

  console.log(
    'Estimate',
    phase2.estimate(cubeG1.encodeCP(), cubeG1.encodeEP(), cubeG1.encodeEPerm())
  );

  const solution2 = phase2.solve(cubeG1, 16);
  console.log('solution2', solution2);

  cubeG1.applyAlgorithm(solution2);

  console.log('CO =', cubeG1.encodeCO());
  console.log('EO =', cubeG1.encodeEO());
  console.log('UDSlice =', cubeG1.encodeUDSlice());

  console.log('CP =', cubeG1.encodeCP());
  console.log('EP =', cubeG1.encodeEP());
  console.log('EPerm =', cubeG1.encodeEPerm());

  const best = solution1.length + solution2.length;
  console.log('BEST =', best);
  const bestSolution = solution1.concat(solution2);
  console.log(bestSolution);
  return bestSolution;

  const optimized = new OptimizedSolver(
    tables.coTable,
    tables.eoTable,
    tables.udsTable,
    tables.coPruning,
    tables.eoPruning,
    tables.udsPruning,
    phase2
  );

  const top20 = optimized.solve(cubeState, best);

  console.log('TOP G1 =', top20.length);
  console.table(top20);

  let bestLength = best;

  console.log('Best', bestLength);

  let bestPhase1 = solution1;
  let bestPhase2 = solution2;
  let i = 0;

  for (const candidate of top20) {
    console.log('START', i);
    const cube = cubeState.clone();
    cube.applyAlgorithm(candidate.phase1);
    const limit = bestLength - candidate.phase1.length;
    console.log('limit', limit);

    // if (phase2.solve(cube, limit)) {
    const phase2Solution = phase2.solve(cube, limit);
    if (!phase2Solution) {
      console.log('skip');
      // console.log('skip');
      i++;
      continue;
    }
    console.log('phase2Solution', phase2Solution);
    // }

    // console.log(phase2Solution);
    console.log('END', i);
    const total = candidate.phase1.length + phase2Solution.length;
    console.log('Candidate', total, candidate.phase1, phase2Solution);

    if (total < bestLength) {
      bestLength = total;
      bestPhase1 = candidate.phase1;
      bestPhase2 = phase2Solution;
    }
    // i++;
  }

  console.log('FINAL BEST =', bestLength);
  console.log(bestPhase1.concat(bestPhase2));
  const solution = bestPhase1.concat(bestPhase2);
  console.log(solution);

  return {
    solution,
    bestLength,
  };
}
