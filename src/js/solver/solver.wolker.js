import { CubeState } from './CubeState.js';
import { solveCube } from './solveCube.js';

self.onmessage = async e => {
  const data = e.data;

  const cube = new CubeState();

  cube.corners = data.corners;
  cube.edges = data.edges;

  const solution = await solveCube(cube);

  self.postMessage(solution);
};
