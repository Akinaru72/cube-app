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
  if (isDragging) return;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    renderer.domElement.style.cursor = 'grab';
  } else {
    renderer.domElement.style.cursor = 'default';
  }

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

  if (!layer) {
    cube.clearHighlight();
    return;
  }

  cube.highlightFace(layer.axis, layer.value);
}

function getSelectedLayer(selection) {
  const { coord, normal } = selection;

  if (Math.abs(normal.x) > 0.9) {
    const result = {
      axis: 'x',
      value: coord.x,
    };
    if (result.value === 0) return null;
    return result;
  }

  if (Math.abs(normal.y) > 0.9) {
    const result = {
      axis: 'y',
      value: coord.y,
    };
    if (result.value === 0) return null;
    return result;
  }

  const result = {
    axis: 'z',
    value: coord.z,
  };
  if (result.value === 0) return null;
  return result;
}

function getFaceName(normal) {
  if (normal.z > 0.9) return 'F';
  if (normal.z < -0.9) return 'B';

  if (normal.x > 0.9) return 'R';
  if (normal.x < -0.9) return 'L';

  if (normal.y > 0.9) return 'U';
  if (normal.y < -0.9) return 'D';

  return null;
}

function onPointerUp() {
  isDragging = false;
  controls.enabled = true;
  renderer.domElement.style.cursor = 'grab';
  if (!dragStart) return;

  if (Math.abs(projectionSum) < 0.02) {
    cleanup();
    return;
  }

  const face = getFaceName(selection.normal);
  const direction = projectionSum > 0 ? 'RIGHT' : 'LEFT';
  cube.executeMove(face, direction);
  cleanup();
}

function cleanup() {
  projectionSum = 0;
  previousPoint = null;
  dragStart = null;
  selection = null;
  isDragging = false;
  moveDetected = false;
}

function getFacePoint(selection, localHit) {
  const face = getFaceName(selection.normal);

  switch (face) {
    case 'F':
    case 'B':
      return {
        x: localHit.x,
        y: localHit.y,
      };

    case 'R':
    case 'L':
      return {
        x: localHit.z,
        y: localHit.y,
      };

    case 'U':
    case 'D':
      return {
        x: localHit.x,
        y: localHit.z,
      };
  }
  return null;
}

let projectionSum = 0;
let previousPoint = null;

function onPointerDown(event) {
  dragDirection = null;
  moveDetected = false;
  projectionSum = 0;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  const hit = intersects.find(i => i.object.userData.isCubie);

  if (!hit) return;
  controls.enabled = false;
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

  const localHit = cube.group.worldToLocal(hit.point.clone());
  selection.point = getFacePoint(selection, localHit);

  previousPoint = { ...selection.point };

  const face = getFaceName(selection.normal);

  dragStart = {
    x: event.clientX,
    y: event.clientY,
  };

  isDragging = true;
  renderer.domElement.style.cursor = 'grabbing';
}

function onPointerMove(event) {
  if (!dragStart) return;
  const dx = event.clientX - dragStart.x;
  const dy = event.clientY - dragStart.y;

  if (cube.isBusy()) return;
  if (!isDragging) return;
  if (moveDetected) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  const hit = intersects.find(i => i.object.userData.isCubie);
  if (!hit) return;
  const localHit = cube.group.worldToLocal(hit.point.clone());

  if (!selection || !selection.point) return;
  const currentPoint = getFacePoint(selection, localHit);

  if (!currentPoint) return;

  const drag = {
    x: currentPoint.x - previousPoint.x,
    y: currentPoint.y - previousPoint.y,
  };

  previousPoint = {
    x: currentPoint.x,
    y: currentPoint.y,
  };

  const radius = {
    x: selection.point.x,
    y: selection.point.y,
  };

  const tangent = {
    x: radius.y,
    y: -radius.x,
  };

  const projection = drag.x * tangent.x + drag.y * tangent.y;
  projectionSum += projection;

  const face = getFaceName(selection.normal);
  const direction = projectionSum > 0 ? 'RIGHT' : 'LEFT';
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < DRAG_THRESHOLD) return;
  moveDetected = true;
}
