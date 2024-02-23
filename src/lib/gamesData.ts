
interface GameType {
  [key: string]: { id: string, name: string, img: string; };
}

export const games: GameType = {
  'tictactoe': { id: 'tictactoe', name: 'tic tac toe', img: '/tictactoe.png' },
  'reversi': { id: 'reversi', name: 'reversi', img: '/reversi.png' }
};
