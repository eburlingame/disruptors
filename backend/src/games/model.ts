export type GamePlayer = {
  playerId: string;
};

export type GameActionRecord = {
  id: string;
  at: number; // date
  who: string; /// playerId
  action: any;
};

export default interface Game<C, A, S, P, M> {
  /// Called when a game is created to get the default game configuration
  newGameConfig(): C;

  /// Called when the players or game options have been modified. Use this to validate the new configation and throw an exception if it's invalid
  updateGameConfig(players: GamePlayer[], newGameConfig: C): C;

  /// Called when the players or game options have been modified, return true if the game is ready to start (enough players, etc.)
  readyToStart(players: GamePlayer[], gameConfig: C): boolean;

  /// Start the game with the given players and game config, returns an initial game state
  startGame(players: GamePlayer[], gameConfig: C): S;

  /// Called before dispatching an action, which can validate/modify it before being applied
  prepareAction(gameState: S, playerId: string, action: A): A;

  /// Called to dispatch an action into the game state, and returns a new state
  applyAction(gameState: S, playerId: string, action: A): S;

  /// Sanitize the game state for a given player (hide the card of other players, etc.)
  sanitizeState(gameState: S, playerId: string): P;

  /// Returns true if the game is over and completed
  gameOver(gameState: S): boolean;

  /// Returns true if the game is over and completed
  gameSummary(gameState: S, gameActions: GameActionRecord[]): M;
}
