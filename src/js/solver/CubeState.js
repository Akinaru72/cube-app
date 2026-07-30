// CubeState.js;
import { permToIndex, indexToPerm, factorial } from './permutation.js';

import {
  PHASE2_MOVE_NAMES,
  SLICE_ORDER,
  movesCubeState,
  MOVE_TABLE,
  MOVE_NAMES,
  CORNER_NAMES,
  PHASE2_EDGES,
  SOLVED_CORNERS,
  CORNER_REFERENCE,
  SOLVED_EDGES,
  CORNER_CO_DELTA,
  ORIENTATION_TRANSFORM,
} from './constantsSolver.js';

import { SpotLight } from 'three';

export class CubeState {
  constructor() {
    this.corners = [
      { id: 'URF', orientation: 0, co: 0 },
      { id: 'UFL', orientation: 2, co: 0 },
      { id: 'ULB', orientation: 0, co: 0 },
      { id: 'UBR', orientation: 2, co: 0 },

      { id: 'DFR', orientation: 2, co: 0 },
      { id: 'DLF', orientation: 0, co: 0 },
      { id: 'DBL', orientation: 2, co: 0 },
      { id: 'DRB', orientation: 0, co: 0 },
    ];
    this.edges = [
      { id: 'UR', orientation: 1, eo: 0 },
      { id: 'UF', orientation: 1, eo: 0 },
      { id: 'UL', orientation: 1, eo: 0 },
      { id: 'UB', orientation: 1, eo: 0 },

      { id: 'DR', orientation: 1, eo: 0 },
      { id: 'DF', orientation: 1, eo: 0 },
      { id: 'DL', orientation: 1, eo: 0 },
      { id: 'DB', orientation: 1, eo: 0 },

      { id: 'FR', orientation: 2, eo: 0 },
      { id: 'FL', orientation: 2, eo: 0 },
      { id: 'BL', orientation: 2, eo: 0 },
      { id: 'BR', orientation: 2, eo: 0 },
    ];
    this.moveTable = MOVE_TABLE;
    this.faces = {
      U: [
        ['W', 'W', 'W'],
        ['W', 'W', 'W'],
        ['W', 'W', 'W'],
      ],

      F: [
        ['G', 'G', 'G'],
        ['G', 'G', 'G'],
        ['G', 'G', 'G'],
      ],

      R: [
        ['R', 'R', 'R'],
        ['R', 'R', 'R'],
        ['R', 'R', 'R'],
      ],

      B: [
        ['B', 'B', 'B'],
        ['B', 'B', 'B'],
        ['B', 'B', 'B'],
      ],

      L: [
        ['O', 'O', 'O'],
        ['O', 'O', 'O'],
        ['O', 'O', 'O'],
      ],

      D: [
        ['Y', 'Y', 'Y'],
        ['Y', 'Y', 'Y'],
        ['Y', 'Y', 'Y'],
      ],
    };
    // this.moveCounter = 0;
  }

  print() {
    console.table(this.corners);
    console.table(this.edges);
  }
  printCompact() {
    console.log(this.corners.map(c => c.id).join(' '));

    console.log(this.edges.map(e => e.id).join(' '));
  }

  // move(name, reverse = false) {
  //   const move = this.moveTable[name];

  //   this.updateOrientation(move);
  //   this.updateEO(name, move);
  //   this.updateCO(name);

  //   this.cycle(this.corners, move.corners, reverse);
  //   this.cycle(this.edges, move.edges, reverse);
  // }

  applyMove(cube, move) {
    for (let i = 0; i < move.turns; i++) {
      cube.move(move.face, move.reverse);
    }
  }

  move(moveName, reverse = false) {
    // Старый вызов:
    // move("R", true)

    if (moveName.length === 1) {
      const move = this.moveTable[moveName];

      this.updateOrientation(move);
      this.updateEO(moveName, move);
      this.updateCO(moveName);

      this.cycle(this.corners, move.corners, reverse);
      this.cycle(this.edges, move.edges, reverse);
      return;
    }

    // Новый вызов:
    // move("R")
    // move("R'")
    // move("R2")

    const face = moveName[0];

    let turns = 1;
    let rev = false;

    if (moveName.endsWith('2')) {
      turns = 2;
    } else if (moveName.endsWith("'")) {
      turns = 3;
    }

    for (let i = 0; i < turns; i++) {
      const move = this.moveTable[face];

      this.updateOrientation(move);
      this.updateEO(face, move);
      this.updateCO(face);

      this.cycle(this.corners, move.corners, rev);
      this.cycle(this.edges, move.edges, rev);
    }
  }

  // move(moveName) {
  //   let turns = 1;

  //   if (moveName.endsWith('2')) turns = 2;
  //   else if (moveName.endsWith("'")) turns = 3;
  //   console.log('Hello');
  //   for (let i = 0; i < turns; i++) {
  //     this.applyMove(moveName);
  //   }
  // }

  // applyMove(moveOrFace) {
  //   console.log('moveOrFace =', moveOrFace, typeof moveOrFace);

  //   let face;

  //   if (typeof moveOrFace === 'string') {
  //     face = moveOrFace[0]; // "R2" -> "R", "R'" -> "R"
  //   } else {
  //     face = moveOrFace; // если уже "R"
  //   }
  //   console.log('face =', face);
  //   console.log('table =', this.moveTable[face]);
  //   const move = this.moveTable[face];

  //   this.updateOrientation(move);
  //   this.updateEO(face, move);
  //   this.updateCO(face);

  //   this.cycle(this.corners, move.corners);
  //   this.cycle(this.edges, move.edges);
  // }

  cycle(array, indexes) {
    // if (!reverse) {
    const temp = array[indexes[indexes.length - 1]];

    for (let i = indexes.length - 1; i > 0; i--) {
      array[indexes[i]] = array[indexes[i - 1]];
    }

    array[indexes[0]] = temp;
    // } else {
    //   const temp = array[indexes[0]];

    //   for (let i = 0; i < indexes.length - 1; i++) {
    //     array[indexes[i]] = array[indexes[i + 1]];
    //   }

    //   array[indexes[indexes.length - 1]] = temp;
    // }
  }

  updateEO(name, move) {
    if (name !== 'F' && name !== 'B') return;

    for (const index of move.edges) {
      this.edges[index].eo ^= 1;
    }
  }

  updateCO(name) {
    const delta = CORNER_CO_DELTA[name];

    if (!delta) return;

    for (let i = 0; i < 8; i++) {
      this.corners[i].co = (this.corners[i].co + delta[i]) % 3;
    }
  }

  rotate(move) {}

  isSolved() {
    return (
      this.encodeCO() === 0 &&
      this.encodeEO() === 0 &&
      this.encodeUDSlice() === 0 &&
      this.encodeCP() === 0 &&
      this.encodeEP() === 0 &&
      this.encodeEPerm() === 0
    );
  }
  // isSolved() {
  //   const cornersSolved = this.corners.every((corner, index) => {
  //     return (
  //       corner.id === SOLVED_CORNERS[index].id &&
  //       corner.orientation === SOLVED_CORNERS[index].orientation
  //     );
  //   });

  //   const edgesSolved = this.edges.every((edge, index) => {
  //     return (
  //       edge.id === SOLVED_EDGES[index].id &&
  //       edge.orientation === SOLVED_EDGES[index].orientation
  //     );
  //   });

  //   return cornersSolved && edgesSolved;
  // }

  updateOrientation(move) {
    for (const index of move.corners) {
      const corner = this.corners[index];

      corner.orientation = ORIENTATION_TRANSFORM[move.axis][corner.orientation];
    }

    for (const index of move.edges) {
      const edge = this.edges[index];

      edge.orientation = ORIENTATION_TRANSFORM[move.axis][edge.orientation];
    }
  }

  clone() {
    const cube = new CubeState();

    cube.corners = structuredClone(this.corners);
    cube.edges = structuredClone(this.edges);

    return cube;
  }

  serialize() {
    const corners = this.corners
      .map(corner => `${corner.id}${corner.orientation}`)
      .join('|');

    const edges = this.edges
      .map(edge => `${edge.id}${edge.orientation}`)
      .join('|');
    console.log(`${corners}#${edges}`);
    return `${corners}#${edges}`;
  }

  encodeCO() {
    let value = 0;

    for (let i = 0; i < 7; i++) {
      value = value * 3 + this.corners[i].co;
    }

    return value;
  }

  decodeCO(v) {
    const array = new Array(8);
    let sum = 0;
    for (let i = 6; i >= 0; i--) {
      const a = v % 3;
      array[i] = a;
      sum += a;
      v = Math.floor(v / 3);
    }
    array[7] = (3 - (sum % 3)) % 3;
    return array;
  }

  encodeEO() {
    let value = 0;

    for (let i = 0; i < 11; i++) {
      value = (value << 1) | this.edges[i].eo;
    }

    return value;
  }

  decodeEO(index) {
    const result = new Array(12);
    let parity = 0;

    for (let i = 10; i >= 0; i--) {
      result[i] = index & 1;
      parity ^= result[i];
      index >>= 1;
    }

    result[11] = parity;

    return result;
  }

  setEO(index) {
    const eo = this.decodeEO(index);

    for (let i = 0; i < 12; i++) {
      this.edges[i].eo = eo[i];
    }
  }

  encodeEP() {
    return this.encodeLehmer(this.getEdgePermutation());
  }

  encodeCP() {
    return this.encodeLehmer(this.getCornerPermutation());
  }

  getCornerPermutation() {
    return this.corners.map(corner =>
      SOLVED_CORNERS.findIndex(solved => solved.id === corner.id)
    );
  }

  getEdgePermutation() {
    return this.edges.map(edge =>
      SOLVED_EDGES.findIndex(solved => solved.id === edge.id)
    );
  }

  getUDEdgePermutation() {
    const ids = ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB'];
    return this.edges
      .filter(edge => ids.includes(edge.id))
      .map(edge => ids.indexOf(edge.id));
  }

  encodeUDEP() {
    return this.encodeLehmer(this.getUDEdgePermutation());
  }

  setUDEP() {
    const ids = ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB'];
    const permutation = this.decodeLehmer(id);
    for (let i = 0; i < 8; i++) {
      this.edges[i].id = ids[permutation[i]];
    }
  }

  encodeLehmer(array) {
    let result = 0;

    for (let i = 0; i < array.length; i++) {
      let count = 0;

      for (let j = i + 1; j < array.length; j++) {
        if (array[i] > array[j]) {
          count++;
        }
      }

      result += count * factorial(array.length - 1 - i);
    }
    result;

    return result;
  }

  decodeLehmer(v, l) {
    const array = new Array(l);
    for (let i = 0; i < l; i++) {
      const a = Math.floor(v / factorial(l - i - 1));
      array[i] = a;

      v %= factorial(l - i - 1);
    }
    // console.log(array);

    const arrayTemp = Array.from({ length: l }, (_, i) => i);
    const outputArray = new Array(l);
    for (let i = 0; i < l; i++) {
      outputArray[i] = arrayTemp[array[i]];
      arrayTemp.splice(array[i], 1);
    }
    return outputArray;
  }

  setCO(id) {
    const orientation = this.decodeCO(id);

    for (let i = 0; i < 8; i++) {
      this.corners[i].co = orientation[i];
    }
  }

  setCP(id) {
    const permutation = this.decodeLehmer(id, 8);

    for (let i = 0; i < 8; i++) {
      this.corners[i].id = SOLVED_CORNERS[permutation[i]].id;
    }
  }
  setEP(id) {
    const permutation = this.decodeLehmer(id, 12);

    for (let i = 0; i < 12; i++) {
      this.edges[i].id = SOLVED_EDGES[permutation[i]].id;
    }
  }

  createCOMoveTable() {
    const table = Array.from({ length: 2187 }, () => new Array(18));

    for (let co = 0; co < 2187; co++) {
      const cube = new CubeState();
      cube.setCO(co);
      for (let move = 0; move < movesCubeState.length; move++) {
        const copy = cube.clone();

        this.applyMove(copy, movesCubeState[move]);
        table[co][move] = copy.encodeCO();
        // if (co === 0 && (move === 3 || move === 5)) {
        //   console.log('MOVE', move);

        //   console.table(
        //     copy.corners.map(c => ({
        //       id: c.id,
        //       co: c.co,
        //     }))
        //   );

        //   console.log('ENCODE', copy.encodeCO());
        // }
      }
    }

    return table;
  }

  createEOMoveTable() {
    const table = Array.from({ length: 2048 }, () => new Array(18));

    for (let eo = 0; eo < 2048; eo++) {
      const cube = new CubeState();
      cube.setEO(eo);

      for (let move = 0; move < movesCubeState.length; move++) {
        const copy = cube.clone();

        this.applyMove(copy, movesCubeState[move]);
        // console.log(
        //   move,
        //   copy.edges.map(e => e.eo),
        //   copy.encodeEO()
        // );
        table[eo][move] = copy.encodeEO();
      }
    }

    return table;
  }

  createPruningTable(moveTable) {
    // console.log('PRUNING START');
    // console.log(moveTable);
    // console.log(moveTable.length);

    const table = new Int8Array(moveTable.length);

    table.fill(-1);
    table[0] = 0;

    const queue = [0];
    let head = 0;

    while (head < queue.length) {
      const current = queue[head++];
      const depth = table[current];

      for (let move = 0; move < 18; move++) {
        const next = moveTable[current][move];

        if (table[next] === -1) {
          table[next] = depth + 1;
          queue.push(next);
        }
      }
    }
    // console.log(Math.max(...table));
    return table;
  }

  // applyMove(face) {
  //   const move = this.moveTable[face];

  //   this.updateOrientation(move);
  //   this.updateEO(face, move);
  //   this.updateCO(face);

  //   this.cycle(this.corners, move.corners);
  //   this.cycle(this.edges, move.edges);
  // }

  getUDSlicePositions() {
    const ids = ['FR', 'FL', 'BL', 'BR'];

    const result = [];

    for (let i = 0; i < 12; i++) {
      if (ids.includes(this.edges[i].id)) {
        result.push(i);
      }
    }

    return result;
  }

  choose(n, k) {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;

    let result = 1;

    for (let i = 1; i <= k; i++) {
      result = (result * (n - k + i)) / i;
    }

    return Math.round(result);
  }

  encodeUDSlice() {
    let index = 0;
    let r = 4;

    for (let i = 11; i >= 0; i--) {
      const id = this.edges[i].id;

      if (id === 'FR' || id === 'FL' || id === 'BL' || id === 'BR') {
        index += this.choose(i, r);
        r--;

        if (r === 0) break;
      }
    }

    return 494 - index;
  }

  decodeUDSlice(index) {
    index = 494 - index;

    const result = [];
    let r = 4;

    for (let i = 11; i >= 0; i--) {
      const c = this.choose(i, r);

      if (index >= c) {
        result.push(i);
        index -= c;
        r--;
      }

      if (r === 0) break;
    }

    return result.reverse();
  }

  setUDSlice(index) {
    const positions = this.decodeUDSlice(index);

    const slice = ['FR', 'FL', 'BL', 'BR'];
    const other = ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB'];

    for (let i = 0; i < 12; i++) {
      positions.includes(i)
        ? (this.edges[i].id = slice.shift())
        : (this.edges[i].id = other.shift());
    }
    return;
  }

  createUDSliceMoveTable() {
    const table = Array.from({ length: 495 }, () => new Array(18));

    for (let uds = 0; uds < 495; uds++) {
      const cube = new CubeState();
      cube.setUDSlice(uds);
      for (let move = 0; move < movesCubeState.length; move++) {
        const copy = cube.clone();
        this.applyMove(copy, movesCubeState[move]);
        table[uds][move] = copy.encodeUDSlice();
      }
    }

    return table;
  }

  encodeCP() {
    const perm = this.corners.map(c => CORNER_NAMES.indexOf(c.id));

    return permToIndex(perm);
  }

  decodeCP(index) {
    return indexToPerm(index, 8);
  }

  setCP(index) {
    const perm = this.decodeCP(index);
    for (let i = 0; i < 8; i++) {
      this.corners[i].id = CORNER_NAMES[perm[i]];
    }
  }

  createCPMoveTable() {
    const table = Array.from({ length: 40320 }, () => new Array(10));

    for (let cp = 0; cp < 40320; cp++) {
      const cube = new CubeState();

      cube.setCP(cp);

      for (let move = 0; move < PHASE2_MOVE_NAMES.length; move++) {
        const copy = cube.clone();

        copy.move(PHASE2_MOVE_NAMES[move]);

        table[cp][move] = copy.encodeCP();
      }
    }

    return table;
  }

  createEPMoveTable() {
    const table = Array.from({ length: 40320 }, () => new Array(10));

    for (let ep = 0; ep < 40320; ep++) {
      const cube = new CubeState();

      cube.setEP(ep);

      for (let move = 0; move < PHASE2_MOVE_NAMES.length; move++) {
        const copy = cube.clone();

        copy.move(PHASE2_MOVE_NAMES[move]);

        table[ep][move] = copy.encodeEP();
      }
    }

    return table;
  }

  createEPermMoveTable() {
    const table = Array.from({ length: 24 }, () => new Array(10));
    for (let ePerm = 0; ePerm < 24; ePerm++) {
      const cube = new CubeState();
      cube.setEPerm(ePerm);
      for (let move = 0; move < PHASE2_MOVE_NAMES.length; move++) {
        const copy = cube.clone();
        copy.move(PHASE2_MOVE_NAMES[move]);
        table[ePerm][move] = copy.encodeEPerm();
      }
    }
    return table;
  }

  encodeEP() {
    const perm = this.edges
      .filter(e => PHASE2_EDGES.includes(e.id))
      .map(e => PHASE2_EDGES.indexOf(e.id));

    return permToIndex(perm);
  }

  decodeEP(index) {
    return indexToPerm(index, 8);
  }

  setEP(index) {
    const perm = this.decodeEP(index);

    let j = 0;

    for (let i = 0; i < 12; i++) {
      if (PHASE2_EDGES.includes(this.edges[i].id)) {
        this.edges[i].id = PHASE2_EDGES[perm[j++]];
      }
    }
  }

  encodeUDPerm() {
    const perm = [];

    for (const id of SLICE_ORDER) {
      const pos = this.edges.findIndex(e => e.id === id);
      perm.push(pos);
    }

    return permToIndex(
      perm.map(p =>
        perm
          .slice()
          .sort((a, b) => a - b)
          .indexOf(p)
      )
    );
  }

  encodeEPerm() {
    const perm = [];

    for (let i = 8; i < 12; i++) {
      perm.push(SLICE_ORDER.indexOf(this.edges[i].id));
    }

    return permToIndex(perm);
  }

  decodeEPerm(index) {
    return indexToPerm(index, 4);
  }

  setEPerm(index) {
    const perm = this.decodeEPerm(index);

    for (let i = 0; i < 4; i++) {
      this.edges[8 + i].id = SLICE_ORDER[perm[i]];
    }
  }

  applyAlgorithm(algorithm) {
    const moves = Array.isArray(algorithm)
      ? algorithm
      : algorithm.trim().split(/\s+/);

    for (const move of moves) {
      this.move(move);
    }
  }

  // -------------------Simple algoritm--------------------------------
  setOrientation(upColor, frontColor) {
    if (upColor === frontColor) throw Error('same color');

    if (OPPOSITE[upColor] === frontColor) throw Error('opposite colors');

    const order = NEIGHBORS[upColor];
    const i = order.indexOf(frontColor);

    return {
      U: upColor,
      D: OPPOSITE[upColor],

      F: frontColor,
      B: OPPOSITE[frontColor],

      R: order[(i + 1) % 4],
      L: order[(i + 3) % 4],
    };
  }
}

const OPPOSITE = {
  W: 'Y',
  Y: 'W',
  G: 'B',
  B: 'G',
  R: 'O',
  O: 'R',
};

const NEIGHBORS = {
  W: ['G', 'R', 'B', 'O'],
  Y: ['G', 'O', 'B', 'R'],

  G: ['W', 'O', 'Y', 'R'],
  B: ['W', 'R', 'Y', 'O'],

  R: ['W', 'G', 'Y', 'B'],
  O: ['W', 'B', 'Y', 'G'],
};

// function
