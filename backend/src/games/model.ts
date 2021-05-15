export type GamePlayer = {
  playerId: string;
};

export default interface Game<C, S, A> {
  /// Called when a game is created to get the default game configuration
  newGameConfig(): C;

  /// Called when the players or game options have been modified. Use this to validate the new configation and throw an exception if it's invalid
  updateGameConfig(players: GamePlayer[], newGameConfig: C): C;

  /// Called when the players or game options have been modified, return true if the game is ready to start (enough players, etc.)
  readyToStart(players: GamePlayer[], gameConfig: C): boolean;

  /// Start the game with the given players and game config, returns an initial game state
  startGame(players: GamePlayer[], gameConfig: C): S;

  /// Called to dispatch an action into the game state, and returns a new state
  applyAction(gameState: S, action: A): S;
}
