import { type State } from "../..";

export function updateGameStatus(state: State) {
  const panelTop = document.querySelector('.panel-top') as HTMLElement;
  
  if (state.game.isGameOver) {
    panelTop.innerHTML = `
      <div class="game-status">
        <h2>🐈‍⬛ GAME OVER</h2>
        <p>No lives remaining</p>
        <button id="new-game" class="action-btn">New Game</button>
      </div>
    `;
  } else if (state.game.isCaught) {
    panelTop.innerHTML = `
      <div class="game-status">
        <h2>🐈‍⬛ Caught!</h2>
        <p>Lives remaining: ${state.game.cat.lives}/9</p>
        <button id="restart-floor" class="action-btn">Restart Floor</button>
      </div>
    `;
  } else {
    panelTop.innerHTML = `
      <p class="game-pitch">
        <em>You, 🐈‍⬛ the Rebel Black Cat will you be able to escape the Magical Maze
            avoiding the Witches who are exploiting your Power of Unluck?</em>
      </p>
      <p class="game-pitch">
        <em>Will your 9 lives be enough to pass by all the floors?</em>
      </p>
    `;
  }
}