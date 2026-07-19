// creareTables.js

import { CubeState } from './solver/CubeState';

export function createTables() {
  const state = new CubeState();

  console.time('Phase1 Tables');

  const coTable = state.createCOMoveTable();
  const eoTable = state.createEOMoveTable();
  const udsTable = state.createUDSliceMoveTable();

  const coPruning = state.createPruningTable(coTable);
  const eoPruning = state.createPruningTable(eoTable);
  const udsPruning = state.createPruningTable(udsTable);

  console.timeEnd('Phase1 Tables');

  console.time('Phase2 Tables');

  const cpTable = state.createCPMoveTable();
  const epTable = state.createEPMoveTable();
  const ePermTable = state.createEPermMoveTable();

  const cpPruning = state.createPruningTable(cpTable);
  const epPruning = state.createPruningTable(epTable);
  const ePermPruning = state.createPruningTable(ePermTable);

  console.timeEnd('Phase2 Tables');

  return {
    coTable,
    eoTable,
    udsTable,

    coPruning,
    eoPruning,
    udsPruning,

    cpTable,
    epTable,
    ePermTable,

    cpPruning,
    epPruning,
    ePermPruning,
  };
}
