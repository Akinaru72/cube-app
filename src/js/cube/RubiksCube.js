// RubiksCube.js

import * as THREE from 'three';

import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import {
  COLORS,
  MOVES,
  CUBE_SIZE,
  ROTATION_SPEED,
  reverseMove,
} from './constantsCube.js';
import { AlgorithmParser } from './AlgorithmParser.js';
import { CubeState } from '../solver/CubeState.js';
import { solveCube } from '../solver/solveCube.js';
import { createRubikLoader } from '../solver/loader.js';

const resetBtn = document.querySelector('#reset-btn');
const scrambleBtn = document.querySelector('#scramble-btn');
const solveBtn = document.querySelector('#solve-btn');
const prevBtn = document.querySelector('#undo-btn');
const nextBtn = document.querySelector('#redo-btn');
const modalOverlayEl = document.querySelector('.modal-overlay');
const loaderEl = document.querySelector('#cube-loader-vis');
// const worker = new Worker(new URL('./solver.worker.js', import.meta.url), {
//   type: 'module',
// });

export class RubiksCube {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.cubies = [];
    this.colors = COLORS;
    this.geometry = new RoundedBoxGeometry(
      CUBE_SIZE,
      CUBE_SIZE,
      CUBE_SIZE,
      6, // сегменты
      0.05 // радиус
    );
    // this.geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    this.currentRotation = null;
    this.moveQueue = [];
    this.moves = MOVES;
    this.parser = new AlgorithmParser();
    this.cubeState = new CubeState();
    this.screenSaver = false;
    // this.updateButtons;
    this.isBusyScramble = false;
    this.isScrambling = false;
    this.rotationSpeed = 0.1;
    this.scrambleLength = 20;
    this.soundEnabled = true;
    this.turnSound = new Audio('/turn.mp3');
    this.turnSound.volume = 0.3;
    this.history = [];
    this.isAnimation = false;
    this.counter = 1;
    this.isSolving = false;
    this.solution = false;
    this.worker = new Worker(
      new URL('../solver/solver.wolker.js', import.meta.url),
      {
        type: 'module',
      }
    );
    this.worker.onmessage = this.onSolveFinished.bind(this);
    this.worker.onerror = this.onSolveError.bind(this);
  }

  updateResetButtons() {
    if (this.solution) {
      scrambleBtn.disabled = true;
      resetBtn.disabled = true;
      prevBtn.disabled = true;
      nextBtn.disabled = true;

      solveBtn.disabled = false;

      return;
    }
    if (this.isSolving) {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      scrambleBtn.disabled = true;
      solveBtn.disabled = true;
      resetBtn.disabled = true;
      return;
    }
    resetBtn.disabled = false;

    const solved = this.cubeState.isSolved();

    scrambleBtn.disabled = this.isScrambling || !solved;

    if (
      !this.history.length ||
      this.isScrambling ||
      this.history.length + 1 === this.counter
    ) {
      prevBtn.disabled = true;
    } else {
      prevBtn.disabled = false;
    }

    if (!this.history.length || this.isScrambling || this.counter === 1) {
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
    }

    if (!this.history.length || solved) {
      solveBtn.disabled = true;
    } else {
      solveBtn.disabled = false;
    }

    this.isAnimation = false;
  }

  createCubie(x, y, z) {
    const materials = [
      new THREE.MeshPhysicalMaterial({
        color: this.colors.inner,
        // color: x === 1 ? this.colors.right : this.colors.inner,
        // roughness: 0.38,
        // metalness: 0.02,

        // clearcoat: 0.45,
        // clearcoatRoughness: 0.18,
        roughness: 0.15,
        metalness: 0,

        clearcoat: 0.9,
        clearcoatRoughness: 0.08,
        emissive: 0x000000,
      }),
      new THREE.MeshPhysicalMaterial({
        color: this.colors.inner,
        // color: x === -1 ? this.colors.left : this.colors.inner,
        roughness: 0.38,
        metalness: 0.02,

        clearcoat: 0.45,
        clearcoatRoughness: 0.18,
        emissive: 0x000000,
      }),
      new THREE.MeshPhysicalMaterial({
        color: this.colors.inner,
        // color: y === 1 ? this.colors.top : this.colors.inner,
        roughness: 0.38,
        metalness: 0.02,

        clearcoat: 0.45,
        clearcoatRoughness: 0.18,
        emissive: 0x000000,
      }),
      new THREE.MeshPhysicalMaterial({
        color: this.colors.inner,
        // color: y === -1 ? this.colors.bottom : this.colors.inner,
        roughness: 0.38,
        metalness: 0.02,

        clearcoat: 0.45,
        clearcoatRoughness: 0.18,
        emissive: 0x000000,
      }),
      new THREE.MeshPhysicalMaterial({
        color: this.colors.inner,
        // color: z === 1 ? this.colors.front : this.colors.inner,
        roughness: 0.38,
        metalness: 0.02,

        clearcoat: 0.45,
        clearcoatRoughness: 0.18,
        emissive: 0x000000,
      }),
      new THREE.MeshPhysicalMaterial({
        color: this.colors.inner,
        // color: z === -1 ? this.colors.back : this.colors.inner,
        roughness: 0.38,
        metalness: 0.02,

        clearcoat: 0.45,
        clearcoatRoughness: 0.18,
        emissive: 0x000000,
      }),
    ];

    const cubie = new THREE.Mesh(this.geometry, materials);
    const spacing = 0.98;
    cubie.position.set(x * spacing, y * spacing, z * spacing);
    // cubie.position.set(x, y, z);
    cubie.userData = {
      isCubie: true,
      coord: {
        x,
        y,
        z,
      },
    };

    this.addStickers(cubie, x, y, z);
    const edges = new THREE.EdgesGeometry(this.geometry);

    const outline = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0,
        depthTest: false,
      })
    );

    cubie.add(outline);
    cubie.userData.outline = outline;
    return cubie;
  }

  createSticker(color) {
    // const geometry = new THREE.PlaneGeometry(0.78, 0.78);
    const geometry = new THREE.BoxGeometry(0.78, 0.78, 0.02);

    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.18,
      metalness: 0,

      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });

    return new THREE.Mesh(geometry, material);
  }

  addStickers(cubie, x, y, z) {
    const offset = 0.486;

    if (x === 1) {
      const sticker = this.createSticker(this.colors.right);
      sticker.position.x = offset;
      sticker.rotation.y = Math.PI / 2;
      cubie.add(sticker);
    }

    if (x === -1) {
      const sticker = this.createSticker(this.colors.left);
      sticker.position.x = -offset;
      sticker.rotation.y = -Math.PI / 2;
      cubie.add(sticker);
    }

    if (y === 1) {
      const sticker = this.createSticker(this.colors.top);
      sticker.position.y = offset;
      sticker.rotation.x = -Math.PI / 2;
      cubie.add(sticker);
    }

    if (y === -1) {
      const sticker = this.createSticker(this.colors.bottom);
      sticker.position.y = -offset;
      sticker.rotation.x = Math.PI / 2;
      cubie.add(sticker);
    }

    if (z === 1) {
      const sticker = this.createSticker(this.colors.front);
      sticker.position.z = offset;
      cubie.add(sticker);
    }

    if (z === -1) {
      const sticker = this.createSticker(this.colors.back);
      sticker.position.z = -offset;
      sticker.rotation.y = Math.PI;
      cubie.add(sticker);
    }
  }

  create() {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cubie = this.createCubie(x, y, z);
          this.group.add(cubie);
          this.cubies.push(cubie);
        }
      }
    }
  }

  rotateX(angle) {
    this.group.rotation.x += angle;
  }

  rotateY(angle) {
    this.group.rotation.y += angle;
  }

  getFace(axis, value) {
    return this.cubies.filter(cubie => cubie.userData.coord[axis] === value);
  }

  rotateLayer(axis, value, angle) {
    const face = this.getFace(axis, value);
    const faceGroup = new THREE.Group();
    this.group.add(faceGroup);

    face.forEach(cubie => {
      faceGroup.attach(cubie);
    });

    faceGroup.rotation[axis] = angle;

    face.forEach(cubie => {
      this.group.attach(cubie);
      console.log(cubie.userData.coord, cubie.position);
      // console.log(cubie.position.x, cubie.position.y, cubie.position.z);
      // console.log(cubie.position);
      this.updateCubieCoords(cubie);
    });
    this.group.remove(faceGroup);
  }

  updateCubieCoords(cubie) {
    // console.log(cubie.position.x, cubie.position.y, cubie.position.z);

    cubie.userData.coord.x = Math.round(cubie.position.x);
    cubie.userData.coord.y = Math.round(cubie.position.y);
    cubie.userData.coord.z = Math.round(cubie.position.z);
  }

  startRotation(move) {
    if (this.currentRotation) return;
    this.playTurnSound();

    const face = this.getFace(move.axis, move.value);
    const faceGroup = new THREE.Group();
    this.group.add(faceGroup);

    face.forEach(cubie => {
      faceGroup.attach(cubie);
    });

    this.currentRotation = {
      ...move,
      currentAngle: 0,
      face,
      faceGroup,
    };
  }

  update() {
    if (!this.currentRotation && this.moveQueue.length > 0) {
      const move = this.moveQueue.shift();
      this.startRotation(move);
    }

    // console.log(this.isScrambling);
    // if (
    //   this.isScrambling &&
    //   !this.currentRotation &&
    //   this.moveQueue.length === 0
    // ) {
    //   this.isScrambling = false;
    //   this.unlockCubeScramble();
    // }

    if (!this.currentRotation) return;
    let speed;
    if (!this.demo) {
      speed = this.rotationSpeed;
    } else {
      speed = 0.01;
    }
    const rotation = this.currentRotation;
    const direction = Math.sign(rotation.angle);
    const remaining =
      Math.abs(rotation.angle) - Math.abs(rotation.currentAngle);
    const step = Math.min(speed, remaining) * direction;

    rotation.faceGroup.rotation[rotation.axis] += step;
    rotation.currentAngle += step;

    if (Math.abs(rotation.currentAngle) >= Math.abs(rotation.angle)) {
      rotation.face.forEach(cubie => {
        this.group.attach(cubie);
        cubie.position.set(
          Math.round(cubie.position.x),
          Math.round(cubie.position.y),
          Math.round(cubie.position.z)
        );

        // Защёлкиваем вращение
        const q = Math.PI / 2;

        cubie.rotation.set(
          Math.round(cubie.rotation.x / q) * q,
          Math.round(cubie.rotation.y / q) * q,
          Math.round(cubie.rotation.z / q) * q
        );

        cubie.updateMatrix();
        cubie.updateMatrixWorld(true);
        this.updateCubieCoords(cubie);
      });
      // console.table('BEFORE', this.cubeState.corners);
      this.group.remove(rotation.faceGroup);
      const reverse = rotation.name.endsWith('Prime');
      const moveName = reverse
        ? rotation.name.replace('Prime', '')
        : rotation.name;

      // console.count('CubeState.move');
      // console.log('MOVE:', moveName, reverse);

      // console.log('Before', {
      //   CO: this.cubeState.encodeCO(),
      //   EO: this.cubeState.encodeEO(),
      //   UDS: this.cubeState.encodeUDSlice(),
      //   CP: this.cubeState.encodeCP(),
      //   EP: this.cubeState.encodeEP(),
      //   EPerm: this.cubeState.encodeEPerm(),
      //   solved: this.cubeState.isSolved(),
      // });
      // console.log('Move', moveName, reverse);

      let newMoveName = moveName;
      !reverse ? newMoveName : (newMoveName = newMoveName + "'");
      // console.log('NewMoveName', newMoveName);

      if (!this.demo) {
        this.cubeState.move(newMoveName, false);
        let array = this.history.slice(
          0,
          this.history.length + 1 - this.counter
        );
        if (!this.isAnimation) {
          this.counter = 1;
          array.push(newMoveName); // добавляем в новую историю
          this.history = array;
        }
        console.log('History-Update', this.history);
        console.log('UPTADE_ARRAY', array);
      }

      // console.dir('CS.move', this.cubeState.move);

      // this.updateButtons();
      // console.table('AFTER', this.cubeState.corners);
      this.currentRotation = null;
      if (this.moveQueue.length === 0) {
        if (!this.demo) {
          this.isScrambling = false;
          // this.isSolving = false;
          // this.solution = false;
          this.updateResetButtons();

          if (this.cubeState.isSolved()) {
            console.log('🎉 Cube solved!');
          }
        }
      }
      // console.table(this.cubeState.corners);
      // console.table(this.cubeState.edges);

      // console.log('SOLVED_RubicCube', this.cubeState.isSolved());

      // console.log('After', {
      //   CO: this.cubeState.encodeCO(),
      //   EO: this.cubeState.encodeEO(),
      //   UDS: this.cubeState.encodeUDSlice(),
      //   CP: this.cubeState.encodeCP(),
      //   EP: this.cubeState.encodeEP(),
      //   EPerm: this.cubeState.encodeEPerm(),
      //   solved: this.cubeState.isSolved(),
      // });
    }
  }

  enqueueMove(name) {
    const reverse = name.endsWith('Prime');
    const moveName = reverse ? name.replace('Prime', '') : name;

    // const reverse = name.endsWith('Prime');

    // console.log('enqueue:', name);
    // console.log(this.moves[name]);

    // this.cubeState.move(moveName, reverse);
    // console.log('MOVE ENTRY', this.moves[name]);
    this.moveQueue.push({
      name,
      ...this.moves[name],
    });
  }

  R() {
    this.enqueueMove('R');
  }

  RPrime() {
    this.enqueueMove('RPrime');
  }

  L() {
    this.enqueueMove('L');
  }

  LPrime() {
    this.enqueueMove('LPrime');
  }

  U() {
    this.enqueueMove('U');
  }

  UPrime() {
    this.enqueueMove('UPrime');
  }

  D() {
    this.enqueueMove('D');
  }

  DPrime() {
    this.enqueueMove('DPrime');
  }

  F() {
    this.enqueueMove('F');
  }

  FPrime() {
    this.enqueueMove('FPrime');
  }

  B() {
    this.enqueueMove('B');
  }

  BPrime() {
    this.enqueueMove('BPrime');
  }

  R2() {
    this.enqueueMove('R2');
  }

  L2() {
    this.enqueueMove('L2');
  }

  U2() {
    this.enqueueMove('U2');
  }

  D2() {
    this.enqueueMove('D2');
  }

  F2() {
    this.enqueueMove('F2');
  }

  B2() {
    this.enqueueMove('B2');
  }

  execute(sequence) {
    const moves = this.parser.parse(sequence);

    moves.forEach(move => {
      this.enqueueMove(move);
    });
  }
  // execute(sequence) {
  //   const moves = this.parser.parse(sequence);

  //   moves.forEach(move => {
  //     this.enqueueMove(move);
  //   });
  // }

  // scrambleDemo(demo) {
  //   while (demo) {
  //     let lastMove = null;

  //     // for (let i = 0; i < count; i++) {
  //     let move;

  //     do {
  //       const randomIndex = Math.floor(Math.random() * this.moves.length);
  //       move = this.moves[randomIndex];
  //     } while (lastMove && move[0] === lastMove[0]);

  //     this[move]();
  //     lastMove = move;
  //     // }
  //   }
  // }

  // scrambleDemo() {
  //   const moveNames = Object.keys(this.moves);

  //   const randomIndex = Math.floor(Math.random() * moveNames.length);

  //   const move = moveNames[randomIndex];

  //   this[move]();
  // }

  startDemo() {
    this.demo = true;
    console.log('startDemo');
    const faces = [
      'R',
      'L',
      'U',
      'D',
      'F',
      'B',
      'RPrime',
      'LPrime',
      'UPrime',
      'DPrime',
      'FPrime',
      'BPrime',
    ];

    const demoLoop = () => {
      if (!this.demo) return;

      if (!this.currentRotation && this.moveQueue.length === 0) {
        const randomMove = faces[Math.floor(Math.random() * faces.length)];

        this.enqueueMove(randomMove);
      }

      requestAnimationFrame(demoLoop);
    };

    demoLoop();
  }

  scramble(count = this.scrambleLength) {
    this.isScrambling = true;
    const faces = ['R', 'L', 'U', 'D', 'F', 'B'];
    const suffixes = ['', 'Prime', '2'];

    let lastFace = null;
    let lastAxis = null;

    const axisMap = {
      R: 'x',
      L: 'x',
      U: 'y',
      D: 'y',
      F: 'z',
      B: 'z',
    };

    const sequence = [];

    for (let i = 0; i < count; i++) {
      let face;
      let axis;

      do {
        face = faces[Math.floor(Math.random() * faces.length)];
        axis = axisMap[face];

        if (face === lastFace) continue;
        if (axis === lastAxis && i >= 2) continue;

        break;
      } while (true);

      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

      if (suffix === '2') {
        this.enqueueMove(face);
        this.enqueueMove(face);

        sequence.push(face + '2'); // записываем как один ход
      } else {
        this.enqueueMove(face + suffix);

        sequence.push(suffix === 'Prime' ? `${face}'` : face);
      }

      lastFace = face;
      lastAxis = axis;
    }
    this.updateResetButtons();

    return sequence.join(' ');
  }

  isBusy() {
    return this.currentRotation !== null || this.moveQueue.length > 0;
  }

  highlightFace(axis, value) {
    this.clearHighlight();

    const face = this.getFace(axis, value);

    face.forEach(cubie => {
      cubie.material.forEach(mat => {
        mat.emissive.setHex(0x888888);
      });
    });
    // face.forEach(cubie => {
    //   cubie.material.emissive.setHex(0x444444);
    //   // cubie.userData.outline.material.opacity = 1;
    // });
  }

  clearHighlight() {
    this.cubies.forEach(cubie => {
      cubie.material.forEach(mat => {
        mat.emissive.setHex(0x000000);
      });
    });
    // this.cubies.forEach(cubie => {
    //   cubie.userData.outline.material.opacity = 0;
    // });
  }

  stopDemo() {
    this.demo = false;
    this.group.rotation.set(0, 0, 0);
  }

  reset() {
    this.stopDemo();

    this.moveQueue = [];
    this.history = [];
    this.counter = 1;
    this.isAnimation = false;
    this.isScrambling = false;

    if (this.currentRotation) {
      this.currentRotation = null;
    }

    this.group.clear();
    this.cubies = [];
    this.cubeState = new CubeState();
    this.create();
    this.updateResetButtons();
  }

  startScreenSaver() {
    this.screenSaver = true;
    console.log('startScreenSaver');
  }

  stopScreenSaver() {
    console.log('EndWoW');
    this.screenSaver = false;
    this.group.rotation.set(0, 0, 0);
  }

  executeMove(face, direction) {
    const map = {
      F: {
        RIGHT: () => this.F(),
        LEFT: () => this.FPrime(),
      },
      B: {
        RIGHT: () => this.BPrime(),
        LEFT: () => this.B(),
      },
      R: {
        RIGHT: () => this.RPrime(),
        LEFT: () => this.R(),
      },
      L: {
        RIGHT: () => this.L(),
        LEFT: () => this.LPrime(),
      },
      U: {
        RIGHT: () => this.UPrime(),
        LEFT: () => this.U(),
      },
      D: {
        RIGHT: () => this.D(),
        LEFT: () => this.DPrime(),
      },
    };

    map[face]?.[direction]?.();
  }

  unlockCubeScramble() {
    this.isBusyScramble = false;

    console.log('UNLock');
    // scrambleBtn.disabled = false;
    // solveBtn.disabled = false;
    // prevBtn.disabled = false;
    // nextBtn.disabled = false;
  }

  playTurnSound() {
    // console.log('PLAY');
    if (!this.soundEnabled) return;

    const sound = this.turnSound.cloneNode();

    sound.volume = this.turnSound.volume;

    sound.play().catch(() => {});
  }

  onPrevBtn() {
    this.isAnimation = true;
    console.log('LENGTH', this.history.length);
    console.log('PREVBTN');
    console.log('MOVE', this.history[this.history.length - this.counter]);
    console.log('COUNTER', this.counter);
    let nameReverseMove = reverseMove(
      this.history[this.history.length - this.counter]
    );
    console.log('ReverseMove', nameReverseMove);
    this.execute(nameReverseMove);
    this.counter = this.counter + 1;
    console.log('PREVBTN-History', this.history);
  }

  onNextBtn() {
    this.isAnimation = true;

    this.counter = this.counter - 1;
    this.execute(this.history[this.history.length - this.counter]);
    console.log('MOVENext', this.history[this.history.length - this.counter]);
    console.log('NextBTN-History', this.history);
  }

  // onSolveBtn() {
  //   console.log('Solve');
  //   console.log(this.cubeState);

  //   const result = await solveCube(this.cubeState);

  //   // console.log(result);
  //   // console.log(result.phase1);
  //   // console.log(result.phase2);
  //   // console.log(result.length);
  // }

  async onSolveBtn() {
    if (this.solution) {
      this.execute(this.solution.join(' '));
      this.solution = null;
      solveBtn.textContent = 'Find Solution';

      this.updateResetButtons();
      this.isSolving = false;
      return;
    }
    this.isSolving = true;
    this.updateResetButtons();

    modalOverlayEl.classList.add('is-open');
    loaderEl.classList.remove('is-hidden');

    this.destroyLoader = createRubikLoader(loaderEl);

    this.worker.postMessage({
      corners: this.cubeState.corners,
      edges: this.cubeState.edges,
    });
  }
  onSolveFinished(e) {
    this.solution = e.data;
    console.log('onSolveFinished', this.solution);
    // this.execute(this.solution.join(' '));
    // this.isSolving = false;
    this.destroyLoader?.();
    modalOverlayEl.classList.remove('is-open');
    loaderEl.classList.add('is-hidden');
    solveBtn.textContent = 'Solve';
    // this.isScrambling = true;
    this.updateResetButtons();

    // если хочешь, чтобы кнопки были активны только после анимации,
    // isSolving = false НЕ здесь
  }
  onSolveError(err) {
    console.error(err);

    this.isSolving = false;
    this.updateResetButtons();

    this.destroyLoader?.();
    modalOverlayEl.classList.remove('is-open');
    loaderEl.classList.remove('is-hidden');
  }
}

// const destroyLoader = createRubikLoader(loaderEl);

// createRubikLoader(loaderEl);
// try {
//   destroyLoader = createRubikLoader(loaderEl);
//   await new Promise(requestAnimationFrame);
//   await new Promise(requestAnimationFrame);

//   const bestSolution = await solveCube(this.cubeState.clone());
//   // console.log('Solution:', solution);
//   let strSolution = bestSolution.join(' ');
//   console.log(strSolution);
//   this.execute(strSolution);
// } catch (error) {
//   console.log(error);
// } finally {
//   this.isSolving = false;
//   destroyLoader?.();
//   // destroyLoader(); // остановить таймеры лоадера
//   // loaderEl?.remove();

//   modalOverlayEl.classList.remove('is-open');
// }
