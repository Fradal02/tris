from enum import Enum
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


router = APIRouter()


class Mark(str, Enum):
    X = "X"
    O = "O"

class GameState(str, Enum):
    RUNNING = "Running"
    X_WINS = "X wins"
    O_WINS = "O wins"
    DRAW = "Draw"

class Game(BaseModel):
    id: int
    board: List[Optional[Mark]]
    turn: Optional[Mark]
    state: GameState

    def __init__ (self, id:int):
        super().__init__(id=id, board=[None]*9, turn=Mark.X, state=GameState.RUNNING)




@router.post("/game/")
async def new_game() -> Game: 

    # calcola l'id del nuovo gioco
    game_id = len(games) + 1

    # crea nuova istanza di gioco
    game = Game(id=game_id)

    # memorizza il gioco nell'archivio dei giochi
    games[game_id] = game

    # restituisci lo stato del gioco
    # fastAPI lo convertirà in json e lo restituirà al richiedente
    return game


@router.get("/game/{id}/")
async def get_game(id:int) -> Game:
    try:     
        game = games[id]
    except KeyError: 
        raise HTTPException(status_code=404, detail="Game not found")

    return game


# stato delle partite in corso
games = {}


