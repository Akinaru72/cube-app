// mouseControls.js

import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const DRAG_THRESHOLD = 8;

let camera;
let scene;
let renderer;
let controls;
let cube;

let moveDetected = false;

let selection = null;
let dragStart = null;
let isDragging = false;
let dragDirection = null;

const AXIS = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
};

function worldDragVector(dx, dy) {
  const right = new THREE.Vector3();
  const up = new THREE.Vector3();

  camera.getWorldDirection(up);

  right.crossVectors(up, camera.up).normalize();

  up.copy(camera.up).normalize();

  return right.multiplyScalar(dx).add(up.multiplyScalar(-dy)).normalize();
}

function dominantAxis(axis) {
  const ax = Math.abs(axis.x);
  const ay = Math.abs(axis.y);
  const az = Math.abs(axis.z);

  if (ax > ay && ax > az) {
    return axis.x > 0 ? 'x+' : 'x-';
  }

  if (ay > ax && ay > az) {
    return axis.y > 0 ? 'y+' : 'y-';
  }

  return axis.z > 0 ? 'z+' : 'z-';
}

function getRotationAxis(selection, dx, dy) {
  const drag = worldDragVector(dx, dy);
  const normal = selection.normal.clone().normalize();
  const axis = new THREE.Vector3();
  axis.crossVectors(normal, drag);
  return axis;
}

export function initMouseControls({
  renderer: r,
  camera: c,
  scene: s,
  controls: ctrl,
  cube: cb,
}) {
  renderer = r;
  camera = c;
  scene = s;
  controls = ctrl;
  cube = cb;

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointermove', onPointerHover);
}

function onPointerHover(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  const hit = intersects.find(i => i.object.userData.isCubie);

  if (!hit) {
    cube.clearHighlight();
    return;
  }

  const worldNormal = hit.face.normal
    .clone()
    .transformDirection(hit.object.matrixWorld);

  const layer = getSelectedLayer({
    coord: hit.object.userData.coord,
    normal: worldNormal,
  });

  cube.highlightFace(layer.axis, layer.value);
}

function onPointerDown(event) {
  dragDirection = null;
  moveDetected = false;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  controls.enabled = false;
  const intersects = raycaster.intersectObjects(scene.children, true);

  const hit = intersects.find(i => i.object.userData.isCubie);

  if (!hit) return;

  const worldNormal = hit.face.normal
    .clone()
    .transformDirection(hit.object.matrixWorld);

  selection = {
    cubie: hit.object,
    coord: hit.object.userData.coord,
    normal: worldNormal,
    layer: getSelectedLayer({
      coord: hit.object.userData.coord,
      normal: worldNormal,
    }),
  };

  const face = getFaceName(selection.normal);
  console.log(face);
  console.log(selection);

  dragStart = {
    x: event.clientX,
    y: event.clientY,
  };

  isDragging = true;
}

function getSelectedLayer(selection) {
  const { coord, normal } = selection;

  if (Math.abs(normal.x) > 0.9) {
    return {
      axis: 'x',
      value: coord.x,
    };
  }

  if (Math.abs(normal.y) > 0.9) {
    return {
      axis: 'y',
      value: coord.y,
    };
  }

  return {
    axis: 'z',
    value: coord.z,
  };
}

function onPointerMove(event) {
  if (cube.isBusy()) return;
  if (!isDragging) return;
  if (moveDetected) return;
  const dx = event.clientX - dragStart.x;
  const dy = event.clientY - dragStart.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < DRAG_THRESHOLD) return;
  if (dragDirection === null) {
    const horizontal = Math.abs(dx) > Math.abs(dy);
    if (horizontal) {
      dragDirection = dx > 0 ? 'RIGHT' : 'LEFT';
    } else {
      dragDirection = dy > 0 ? 'DOWN' : 'UP';
    }
  }
  console.log(dragDirection);
  console.log('DRAG', dx, dy);
  const axis = getRotationAxis(selection, dx, dy);
  const worldAxis = dominantAxis(axis);

  const move = getMove(selection, worldAxis);

  console.log('MOVE', move);

  if (!move) return;

  cube.enqueueMove(move);
  isDragging = false;
  moveDetected = true;
  // if (!move) return;
  // cube.enqueueMove(move);

  raycaster.setFromCamera(mouse, camera);

  const hit = intersects.find(i => i.object.userData.isCubie);

  if (!hit) {
    cube.clearHighlight();
    return;
  }

  const worldNormal = hit.face.normal
    .clone()
    .transformDirection(hit.object.matrixWorld);

  const layer = getSelectedLayer({
    coord: hit.object.userData.coord,
    normal: worldNormal,
  });

  cube.highlightFace(layer.axis, layer.value);
}

function onPointerUp() {
  dragDirection = null;
  isDragging = false;

  moveDetected = false;

  selection = null;
  dragStart = null;

  // controls.enabled = true;
}

function getMove(selection, worldAxis) {
  const { axis, value } = selection.layer;

  switch (axis) {
    case 'x':
      if (value === 1) {
        // R
        if (worldAxis === 'y+') return 'R';
        if (worldAxis === 'y-') return 'RPrime';
        if (worldAxis === 'z+') return 'R';
        if (worldAxis === 'z-') return 'RPrime';
      } else {
        // L
        if (worldAxis === 'y+') return 'LPrime';
        if (worldAxis === 'y-') return 'L';
        if (worldAxis === 'z+') return 'LPrime';
        if (worldAxis === 'z-') return 'L';
      }
      break;

    case 'y':
      if (value === 1) {
        // U
        if (worldAxis === 'z-') return 'U';
        if (worldAxis === 'z+') return 'UPrime';
        if (worldAxis === 'x+') return 'U';
        if (worldAxis === 'x-') return 'UPrime';
      } else {
        // D
        if (worldAxis === 'z-') return 'DPrime';
        if (worldAxis === 'z+') return 'D';
        if (worldAxis === 'x+') return 'DPrime';
        if (worldAxis === 'x-') return 'D';
      }
      break;

    case 'z':
      if (value === 1) {
        // F
        if (worldAxis === 'y+') return 'F';
        if (worldAxis === 'y-') return 'FPrime';
        if (worldAxis === 'x+') return 'FPrime';
        if (worldAxis === 'x-') return 'F';
      } else {
        // B
        if (worldAxis === 'y+') return 'BPrime';
        if (worldAxis === 'y-') return 'B';
        if (worldAxis === 'x+') return 'B';
        if (worldAxis === 'x-') return 'BPrime';
      }
      break;
  }

  return null;
}

// function getMove(selection, direction) {
//   const face = getFaceName(selection.normal);

//   if (!face) return null;

//   return MOVE_MAP[face]?.[direction] ?? null;
// }

function getFaceName(normal) {
  if (normal.z > 0.9) return 'F';
  if (normal.z < -0.9) return 'B';

  if (normal.x > 0.9) return 'R';
  if (normal.x < -0.9) return 'L';

  if (normal.y > 0.9) return 'U';
  if (normal.y < -0.9) return 'D';

  return null;
}
