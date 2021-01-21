from fastapi import FastAPI
from tris import game


app = FastAPI()
app.include_router(game.router)

