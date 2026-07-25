const COLORS = {
  X: '#808080',
  W: '#ffffff',
  Y: '#ffd400',
  G: '#00b050',
  B: '#0057ff',
  R: '#d62828',
  O: '#ff8c00',
};

function color(face, i, cfg) {
  if (typeof cfg === 'string') return COLORS[cfg];
  return COLORS[cfg?.[i] ?? 'X'];
}

export function createCube(U = {}, F = {}, R = {}, Name) {
  return `
      <div class="cube-guide">
        <div class="face up">
          <div id="U1" class="sticker" style="background:${color('U', 1, U)}"></div>
          <div id="U2" class="sticker" style="background:${color('U', 2, U)}"></div>
          <div id="U3" class="sticker" style="background:${color('U', 3, U)}"></div>

          <div id="U4" class="sticker" style="background:${color('U', 4, U)}"></div>
          <div id="U5" class="sticker" style="background:${color('U', 5, U)}"></div>
          <div id="U6" class="sticker" style="background:${color('U', 6, U)}"></div>

          <div id="U7" class="sticker" style="background:${color('U', 7, U)}"></div>
          <div id="U8" class="sticker" style="background:${color('U', 8, U)}"></div>
          <div id="U9" class="sticker" style="background:${color('U', 9, U)}"></div>
        </div>


        <div class="face front">
          <div id="F1" class="sticker" style="background:${color('F', 1, F)}"></div>
          <div id="F2" class="sticker" style="background:${color('F', 2, F)}"></div>
          <div id="F3" class="sticker" style="background:${color('F', 3, F)}"></div>

          <div id="F4" class="sticker" style="background:${color('F', 4, F)}"></div>
          <div id="F5" class="sticker" style="background:${color('F', 5, F)}"></div>
          <div id="F6" class="sticker" style="background:${color('F', 6, F)}"></div>

          <div id="F7" class="sticker" style="background:${color('F', 7, F)}"></div>
          <div id="F8" class="sticker" style="background:${color('F', 8, F)}"></div>
          <div id="F9" class="sticker" style="background:${color('F', 9, F)}"></div>
        </div>


        <div class="face right">
          <div id="R1" class="sticker" style="background:${color('R', 1, R)}"></div>
          <div id="R2" class="sticker" style="background:${color('R', 2, R)}"></div>
          <div id="R3" class="sticker" style="background:${color('R', 3, R)}"></div>

          <div id="R4" class="sticker" style="background:${color('R', 4, R)}"></div>
          <div id="R5" class="sticker" style="background:${color('R', 5, R)}"></div>
          <div id="R6" class="sticker" style="background:${color('R', 6, R)}"></div>

          <div id="R7" class="sticker" style="background:${color('R', 7, R)}"></div>
          <div id="R8" class="sticker" style="background:${color('R', 8, R)}"></div>
          <div id="R9" class="sticker" style="background:${color('R', 9, R)}"></div>
        </div>
        
        <div class="cube-label">${Name}</div>
      </div>
      `;
}
