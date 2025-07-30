from pydantic import BaseModel
from typing import List, Optional

class GameState(BaseModel):
    board: List[List[int]]
    current_player: int
    winner: Optional[int] = None
    mode: str

class Move(BaseModel):
    row: int
    col: int
    player: int