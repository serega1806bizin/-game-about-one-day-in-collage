export const gameData = {
  boughtWater: false,
};

export let isPaused = false;

export function setPaused(state) {
  isPaused = state;
  console.log('Game Paused:', isPaused);
}