# Some Planning Notes

## Basic Architecture

- Typescript/Express JS app which opens a websocket server
- React client app which connects to said websocket

## Session and User Management

When the client initially connects, it will send a `openSession` command to the server. The server responds with a session token, which the client persists in local storage.

If the client reloads or reconnected, it will send a `reopenSession` command with the latest token included.

### Commands

- See `backend/src/handler.ts` for the Websocket commands and their payloads.
- Each command verb should have an associated handler function, and a `Joi` schema which validates the payload of the command

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
