// controls.js
export function initKeyboard(cube) {
  // console.log('Hello');
  const KEY_MAP = {
    r: () => cube.R(),
    R: () => cube.RPrime(),

    l: () => cube.L(),
    L: () => cube.LPrime(),

    u: () => cube.U(),
    U: () => cube.UPrime(),

    d: () => cube.D(),
    D: () => cube.DPrime(),

    f: () => cube.F(),
    F: () => cube.FPrime(),

    b: () => cube.B(),
    B: () => cube.BPrime(),
  };

  document.addEventListener('keydown', event => {
    KEY_MAP[event.key]?.();
  });
}
