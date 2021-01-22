from enum import Enum
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field


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

    def winner(self) -> GameState:
        lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        
        #controlla se c'è un vincitore
        for p1,p2,p3 in lines:
            if self.board[p1] != None and self.board[p1] == self.board[p2] == self.board[p3]:
                if self.board[p1] == Mark.X:
                    return GameState.X_WINS
                else:
                    return GameState.O_WINS
        
        #se c'è ancora una cella vuota la partita è ancora aperta
        for mark in self.board:
            if mark == None:
                return GameState.RUNNING

        #non ci sono più celle vuote: pareggio
        return GameState.DRAW


class Move(BaseModel):
    player: Mark
    position: int = Field (..., ge=0, lt=9)



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


@router.patch("/game/{id}/")
async def patch_game(id:int, move:Move) -> Game:
    
    #cerca il gioco da modificare
    try:     
        game = games[id]
    except KeyError: 
        raise HTTPException(status_code = 404, detail = "Game not found")

    #la partita è ancora in corso
    if game.state != GameState.RUNNING:
        raise HTTPException(status_code = 400, detail = "Game is not running")

    #controllo giocatore giusto
    if game.turn != move.player:
        raise HTTPException(status_code = 400, detail = "Ha giocato il player sbagliato")

    #controllo celle
    if game.board[move.position] != None:
        raise HTTPException(status_code = 400, detail = "La cella è già occupata")

    #modifica celle
    game.board[move.position] =  move.player

    #determinazione vincitore
    winner = game.winner()
    if winner == GameState.RUNNING: 
    
    #non c'è un vincitore: cambia turno
        if game.turn == Mark.X:
            game.turn = Mark.O
        else :
            game.turn = Mark.X
    
    else:
        game.state = winner
        game.turn = None



    return game





# stato delle partite in corso
games = {}


