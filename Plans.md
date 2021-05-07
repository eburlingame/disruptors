# Some Planning Notes

## Basic Architecture

- Python FastAPI server running a single websocket endpoint
- React client app which connects to said websocket

## Session and User Management

When the client initially connects, it will send a `openSession` command to the server. The server responds with a session token, which the client persists in local storage.

If the client reloads or reconnected, it will send a `reopenSession` command with the latest token included.

### Commands

- `openSession`: Create a new session
- `reopenSession`: Re-open an existing session
  - sessionToken
- `createUser`: Create a new userId
  - name
- `closeSession`: Destroy the session and the associated user

## Game State

- gameState:

  - config
    - cardDiscardLimit: 7 and ?
  - phase:
    - CREATED
    - SETUP_ROUND_1
    - SETUP_ROUND_2
    - PLAYING
    - ROBBER_ROLLED
    - GAME_OVER
  - board
    - tiles
      - tileType: brick | wood | ore | wheat | sheep | desert
      - diceNumber
      - ports:
        - portResource: brick | wood | ore | wheat | sheep | any
        - portRatio: 1 | 2 | 3
    - construction
      - settlements
      - cities
      - roads
  - latestDiceValue
  - players
    - playerId
    - resourceCards:
      - brickCount
      - woodCount
      - oreCount
      - wheatCount
      - sheepCount
    - developmentCards:
      - devCardType: knight | victoryPoint

- actionHistory
  - playerId
  - action

## Game Actions

- StartGame
- PlaceInitialSettlement
- PlaceInitialRoad
- RollDice
- DiscardCards
- TradeRequest
- TradeAccept
- TradeReject
- TradeOfferAccepted
- MaritimeTrade
- BuyDevelopmentCard
- PlayDevelopmentCard
- BuildRoad
- BuildSettlement
- BuildCity
- PlaceRobber
- SendMessage
