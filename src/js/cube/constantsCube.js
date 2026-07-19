export const CUBE_SIZE = 0.95;

export const ROTATION_SPEED = 0.02;

export const COLORS = {
  right: 0xff0000,
  left: 0xffa500,
  top: 0xffffff,
  bottom: 0xffff00,
  front: 0x00ff00,
  back: 0x0000ff,
  inner: 0x111111,
};

export const MOVES = {
  R: {
    notation: 'R',
    axis: 'x',
    value: 1,
    angle: -Math.PI / 2,
  },

  R2: {
    notation: 'R2',
    axis: 'x',
    value: 1,
    angle: -Math.PI,
  },

  RPrime: {
    notation: "R'",
    axis: 'x',
    value: 1,
    angle: Math.PI / 2,
  },

  L: {
    notation: 'L',
    axis: 'x',
    value: -1,
    angle: Math.PI / 2,
  },

  L2: {
    notation: 'L2',
    axis: 'x',
    value: -1,
    angle: Math.PI,
  },

  LPrime: {
    notation: "L'",
    axis: 'x',
    value: -1,
    angle: -Math.PI / 2,
  },

  U: {
    notation: 'U',
    axis: 'y',
    value: 1,
    angle: -Math.PI / 2,
  },

  U2: {
    notation: 'U2',
    axis: 'y',
    value: 1,
    angle: -Math.PI,
  },

  UPrime: {
    notation: "U'",
    axis: 'y',
    value: 1,
    angle: Math.PI / 2,
  },

  D: {
    notation: 'D',
    axis: 'y',
    value: -1,
    angle: Math.PI / 2,
  },

  D2: {
    notation: 'D2',
    axis: 'y',
    value: -1,
    angle: Math.PI,
  },

  DPrime: {
    notation: "D'",
    axis: 'y',
    value: -1,
    angle: -Math.PI / 2,
  },

  F: {
    notation: 'F',
    axis: 'z',
    value: 1,
    angle: -Math.PI / 2,
  },

  F2: {
    notation: 'F2',
    axis: 'z',
    value: 1,
    angle: -Math.PI,
  },

  FPrime: {
    notation: "F'",
    axis: 'z',
    value: 1,
    angle: Math.PI / 2,
  },

  B: {
    notation: 'B',
    axis: 'z',
    value: -1,
    angle: Math.PI / 2,
  },

  B2: {
    notation: 'B2',
    axis: 'z',
    value: -1,
    angle: Math.PI,
  },

  BPrime: {
    notation: "B'",
    axis: 'z',
    value: -1,
    angle: -Math.PI / 2,
  },
};
