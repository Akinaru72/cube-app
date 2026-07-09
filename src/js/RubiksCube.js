// RubiksCube.js

import * as THREE from 'three';

import { COLORS, MOVES, CUBE_SIZE, ROTATION_SPEED } from './constants.js';

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
  }

  createCubie(x, y, z) {
    const materials = [
      new THREE.MeshStandardMaterial({
        color: x === 1 ? this.colors.right : this.colors.inner,
      }),
      new THREE.MeshStandardMaterial({
        color: x === -1 ? this.colors.left : this.colors.inner,
      }),
      new THREE.MeshStandardMaterial({
        color: y === 1 ? this.colors.top : this.colors.inner,
      }),
      new THREE.MeshStandardMaterial({
        color: y === -1 ? this.colors.bottom : this.colors.inner,
      }),
      new THREE.MeshStandardMaterial({
        color: z === 1 ? this.colors.front : this.colors.inner,
      }),
      new THREE.MeshStandardMaterial({
        color: z === -1 ? this.colors.back : this.colors.inner,
      }),
    ];

    const cubie = new THREE.Mesh(this.geometry, materials);
    cubie.position.set(x, y, z);
    cubie.userData = {
      coord: {
        x,
        y,
        z,
      },
    };
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
      console.log(cubie.position);
      this.updateCubieCoords(cubie);
    });
    this.group.remove(faceGroup);
  }

  updateCubieCoords(cubie) {
    cubie.userData.coord.x = Math.round(cubie.position.x);
    cubie.userData.coord.y = Math.round(cubie.position.y);
    cubie.userData.coord.z = Math.round(cubie.position.z);
  }

  startRotation(axis, value, angle) {
    if (this.currentRotation) return;

    const face = this.getFace(axis, value);

    const faceGroup = new THREE.Group();
    this.group.add(faceGroup);

    face.forEach(cubie => {
      faceGroup.attach(cubie);
    });

    this.currentRotation = {
      axis,
      angle,
      currentAngle: 0,
      face,
      faceGroup,
    };
  }

  update() {
    if (!this.currentRotation && this.moveQueue.length > 0) {
      const move = this.moveQueue.shift();
      this.startRotation(move.axis, move.value, move.angle);
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
      this.currentRotation = null;
    }
  }

  enqueueMove(axis, value, angle) {
    this.moveQueue.push({
      axis,
      value,
      angle,
    });
  }

  R() {
    this.enqueueMove('x', 1, -Math.PI / 2);
  }

  RPrime() {
    this.enqueueMove('x', 1, Math.PI / 2);
  }

  L() {
    this.enqueueMove('x', -1, Math.PI / 2);
  }

  LPrime() {
    this.enqueueMove('x', -1, -Math.PI / 2);
  }

  U() {
    this.enqueueMove('y', 1, -Math.PI / 2);
  }

  UPrime() {
    this.enqueueMove('y', 1, Math.PI / 2);
  }

  D() {
    this.enqueueMove('y', -1, Math.PI / 2);
  }

  DPrime() {
    this.enqueueMove('y', -1, -Math.PI / 2);
  }

  F() {
    this.enqueueMove('z', 1, -Math.PI / 2);
  }

  FPrime() {
    this.enqueueMove('z', 1, Math.PI / 2);
  }

  B() {
    this.enqueueMove('z', -1, Math.PI / 2);
  }

  BPrime() {
    this.enqueueMove('z', -1, -Math.PI / 2);
  }

  execute(sequence) {
    const moves = sequence.split(' ');
    console.log(moves);
    moves.forEach(move => {
      let count = 1;

      if (move.endsWith('2')) {
        count = 2;
        move = move.slice(0, -1);
      }

      if (move.endsWith("'")) {
        move = move.slice(0, -1) + 'Prime';
      }

      for (let i = 0; i < count; i++) {
        this[move]();
      }
    });
  }

  scramble(count = 20) {
    let lastMove = null;

    for (let i = 0; i < count; i++) {
      let move;

      do {
        const randomIndex = Math.floor(Math.random() * this.moves.length);
        move = this.moves[randomIndex];
      } while (lastMove && move[0] === lastMove[0]);

      this[move]();
      lastMove = move;
    }
  }
}
