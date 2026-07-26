import { createCube } from './createCube.js';
console.log(createCube('R', 'G', 'W'));

export const cubePages = [
  // PAGE 1
  {
    facesGuide: [
      createCube(
        'G',
        {
          1: 'Y',
          2: 'Y',
          3: 'Y',
        },
        {
          1: 'R',
          2: 'R',
          3: 'R',
        },
        'U (UP)'
      ),

      createCube(
        'X',
        {
          7: 'Y',
          8: 'Y',
          9: 'Y',
        },
        {
          7: 'R',
          8: 'R',
          9: 'R',
        },
        'D (DOWN)'
      ),

      createCube(
        {
          1: 'G',
          4: 'G',
          7: 'G',
        },
        {
          1: 'Y',
          4: 'Y',
          7: 'Y',
        },
        'X',
        'L (LEFT)'
      ),

      createCube(
        {
          3: 'G',
          6: 'G',
          9: 'G',
        },
        {
          3: 'Y',
          6: 'Y',
          9: 'Y',
        },
        'R',
        'R (RIGHT)'
      ),

      createCube(
        {
          7: 'G',
          8: 'G',
          9: 'G',
        },
        'Y',
        {
          1: 'R',
          4: 'R',
          7: 'R',
        },
        'F (FRONT)'
      ),

      createCube(
        {
          1: 'G',
          2: 'G',
          3: 'G',
        },
        'X',
        {
          3: 'R',
          6: 'R',
          9: 'R',
        },
        'B (BACK)'
      ),
    ],

    faceWithCentralCubes: [
      createCube(
        {
          5: 'B',
        },
        {
          5: 'R',
        },
        {
          5: 'Y',
        }
      ),
    ],
    faceWithCross: [
      createCube(
        {
          2: 'B',
          4: 'B',
          5: 'B',
          6: 'B',
          8: 'B',
        },
        {
          2: 'R',
          5: 'R',
        },
        {
          2: 'Y',
          5: 'Y',
        }
      ),
    ],
  },

  // PAGE 2
  {
    faceCornerPos1: [
      createCube(
        {
          2: 'B',
          4: 'B',
          5: 'B',
          6: 'B',
          8: 'B',
        },
        {
          2: 'R',
          5: 'R',
          9: 'B',
        },
        {
          2: 'Y',
          5: 'Y',
          7: 'Y',
        }
      ),
    ],
    faceCornerPos2: [
      createCube(
        {
          2: 'B',
          4: 'B',
          5: 'B',
          6: 'B',
          8: 'B',
        },
        {
          2: 'R',
          5: 'R',
          9: 'Y',
        },
        {
          2: 'Y',
          5: 'Y',
          7: 'R',
        }
      ),
    ],
    faceCornerPos3: [
      createCube(
        {
          2: 'B',
          4: 'B',
          5: 'B',
          6: 'B',
          8: 'B',
        },
        {
          2: 'R',
          5: 'R',
          9: 'R',
        },
        {
          2: 'Y',
          5: 'Y',
          7: 'B',
        }
      ),
    ],
    faceCornerPos4: [
      createCube(
        {
          2: 'B',
          4: 'B',
          5: 'B',
          6: 'B',
          8: 'B',
          9: 'R',
        },
        {
          2: 'R',
          3: 'Y',
          5: 'R',
        },
        {
          1: 'B',
          2: 'Y',
          5: 'Y',
        }
      ),
    ],
    faceCornerPos5: [
      createCube(
        {
          2: 'B',
          4: 'B',
          5: 'B',
          6: 'B',
          8: 'B',
          9: 'Y',
        },
        {
          2: 'R',
          3: 'B',
          5: 'R',
        },
        {
          2: 'Y',
          1: 'R',
          5: 'Y',
        }
      ),
    ],
    faceCornerPos6: [
      createCube(
        {
          2: 'B',
          4: 'B',
          5: 'B',
          6: 'B',
          8: 'B',
          9: 'B',
        },
        {
          2: 'R',
          3: 'R',
          5: 'R',
        },
        {
          2: 'Y',
          1: 'Y',
          5: 'Y',
        }
      ),
    ],
  },
];
