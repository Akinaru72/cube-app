export const MOVE_TABLE = {
  R: {
    axis: 'x',
    corners: [0, 3, 7, 4],
    edges: [0, 11, 4, 8],
    cornerOrientation: [],
    edgeOrientation: [],
  },

  L: {
    axis: 'x',
    corners: [1, 5, 6, 2],
    edges: [2, 9, 6, 10],
    cornerOrientation: [],
    edgeOrientation: [],
  },

  U: {
    axis: 'y',
    corners: [0, 1, 2, 3],
    edges: [0, 1, 2, 3],
    cornerOrientation: [],
    edgeOrientation: [],
  },

  D: {
    axis: 'y',
    corners: [4, 7, 6, 5],
    edges: [4, 7, 6, 5],
    cornerOrientation: [],
    edgeOrientation: [],
  },

  F: {
    axis: 'z',
    corners: [0, 4, 5, 1],
    edges: [1, 8, 5, 9],
    cornerOrientation: [],
    edgeOrientation: [],
  },

  B: {
    axis: 'z',
    corners: [2, 6, 7, 3],
    edges: [3, 10, 7, 11],
    cornerOrientation: [],
    edgeOrientation: [],
  },
};

export const CORNER_NAMES = [
  'URF',
  'UFL',
  'ULB',
  'UBR',
  'DFR',
  'DLF',
  'DBL',
  'DRB',
];

export const PHASE2_EDGES = ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB'];

export const PHASE2_MOVE_NAMES = [
  'U',
  'U2',
  "U'",
  'D',
  'D2',
  "D'",
  'R2',
  'L2',
  'F2',
  'B2',
];

export const MOVE_NAMES = [
  'U',
  'U2',
  "U'",
  'R',
  'R2',
  "R'",
  'F',
  'F2',
  "F'",
  'D',
  'D2',
  "D'",
  'L',
  'L2',
  "L'",
  'B',
  'B2',
  "B'",
];

export const SLICE_ORDER = ['FR', 'FL', 'BL', 'BR'];

export const movesCubeState = [
  { face: 'U', turns: 1, reverse: false },
  { face: 'U', turns: 2, reverse: false },
  { face: 'U', turns: 1, reverse: true },

  { face: 'R', turns: 1, reverse: false },
  { face: 'R', turns: 2, reverse: false },
  { face: 'R', turns: 1, reverse: true },

  { face: 'F', turns: 1, reverse: false },
  { face: 'F', turns: 2, reverse: false },
  { face: 'F', turns: 1, reverse: true },

  { face: 'D', turns: 1, reverse: false },
  { face: 'D', turns: 2, reverse: false },
  { face: 'D', turns: 1, reverse: true },

  { face: 'L', turns: 1, reverse: false },
  { face: 'L', turns: 2, reverse: false },
  { face: 'L', turns: 1, reverse: true },

  { face: 'B', turns: 1, reverse: false },
  { face: 'B', turns: 2, reverse: false },
  { face: 'B', turns: 1, reverse: true },
];

export const SOLVED_CORNERS = [
  { id: 'URF', orientation: 0, co: 0 },
  { id: 'UFL', orientation: 2, co: 0 },
  { id: 'ULB', orientation: 0, co: 0 },
  { id: 'UBR', orientation: 2, co: 0 },

  { id: 'DFR', orientation: 2, co: 0 },
  { id: 'DLF', orientation: 0, co: 0 },
  { id: 'DBL', orientation: 2, co: 0 },
  { id: 'DRB', orientation: 0, co: 0 },
];

export const CORNER_REFERENCE = {
  URF: 'R',
  UFL: 'F',
  ULB: 'L',
  UBR: 'B',

  DFR: 'F',
  DLF: 'L',
  DBL: 'B',
  DRB: 'R',
};

export const SOLVED_EDGES = [
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

export const CORNER_CO_DELTA = {
  R: [2, 0, 0, 1, 1, 0, 0, 2],
  L: [0, 1, 2, 0, 0, 2, 1, 0],
  F: [1, 2, 0, 0, 2, 1, 0, 0],
  B: [0, 0, 1, 2, 0, 0, 2, 1],
  U: [0, 0, 0, 0, 0, 0, 0, 0],
  D: [0, 0, 0, 0, 0, 0, 0, 0],
};

export const ORIENTATION_TRANSFORM = {
  x: [0, 2, 1],
  y: [2, 1, 0],
  z: [1, 0, 2],
};
