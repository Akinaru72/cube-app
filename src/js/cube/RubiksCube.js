// RubiksCube.js

import * as THREE from 'three';

import { COLORS, MOVES, CUBE_SIZE, ROTATION_SPEED } from './constantsCube.js';
import { AlgorithmParser } from './AlgorithmParser.js';
import { CubeState } from '../solver/CubeState.js';

export class RubiksCube {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.cubies = [];
    this.colors = COLORS;
    this.geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    this.currentRotation = null;
    this.moveQueue = [];
    this.moves = MOVES;
    this.parser = new AlgorithmParser();
    this.cubeState = new CubeState();
  }

  createCubie(x, y, z) {
    const materials = [
      new THREE.MeshStandardMaterial({
        color: x === 1 ? this.colors.right : this.colors.inner,
        emissive: 0x000000,
      }),
      new THREE.MeshStandardMaterial({
        color: x === -1 ? this.colors.left : this.colors.inner,
        emissive: 0x000000,
      }),
      new THREE.MeshStandardMaterial({
        color: y === 1 ? this.colors.top : this.colors.inner,
        emissive: 0x000000,
      }),
      new THREE.MeshStandardMaterial({
        color: y === -1 ? this.colors.bottom : this.colors.inner,
        emissive: 0x000000,
      }),
      new THREE.MeshStandardMaterial({
        color: z === 1 ? this.colors.front : this.colors.inner,
        emissive: 0x000000,
      }),
      new THREE.MeshStandardMaterial({
        color: z === -1 ? this.colors.back : this.colors.inner,
        emissive: 0x000000,
      }),
    ];

    const cubie = new THREE.Mesh(this.geometry, materials);
    cubie.position.set(x, y, z);
    cubie.userData = {
      isCubie: true,
      coord: {
        x,
        y,
        z,
      },
    };
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
    console.log(cubie.position.x, cubie.position.y, cubie.position.z);

    cubie.userData.coord.x = Math.round(cubie.position.x);
    cubie.userData.coord.y = Math.round(cubie.position.y);
    cubie.userData.coord.z = Math.round(cubie.position.z);
  }

  startRotation(move) {
    if (this.currentRotation) return;

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

    if (!this.currentRotation) return;

    const speed = ROTATION_SPEED;
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
        this.updateCubieCoords(cubie);
      });

      this.group.remove(rotation.faceGroup);
      const reverse = rotation.name.endsWith('Prime');
      const moveName = reverse
        ? rotation.name.replace('Prime', '')
        : rotation.name;

      this.cubeState.move(moveName, reverse);
      this.currentRotation = null;
      if (this.moveQueue.length === 0 && this.cubeState.isSolved()) {
        console.log('🎉 Cube solved!');
      }
    }
  }

  enqueueMove(name) {
    const reverse = name.endsWith('Prime');
    const moveName = reverse ? name.replace('Prime', '') : name;

    console.log('enqueue:', name);
    console.log(this.moves[name]);

    // this.cubeState.move(moveName, reverse);
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

  scramble(count = 30) {
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
}
