from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import copy
from backend.models import GameState, Move
from backend.ai_engine import get_ai_move
from backend.game_mechanics import initialize_board, check_winner

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize game state
game_state = None

@app.post("/start")
async def start_game(mode_data: dict):
    global game_state
    mode = mode_data.get("mode")
    if not mode or mode not in ["two_player", "ai"]:
        raise HTTPException(status_code=400, detail="Invalid mode")
    game_state = GameState(
        board=initialize_board(),
        current_player=1,
        mode=mode
    )
    return game_state

@app.post("/move")
async def make_move(move: Move):
    global game_state
    if not game_state:
        raise HTTPException(status_code=400, detail="Game not started")
    if move.row < 0 or move.row >= 15 or move.col < 0 or move.col >= 15:
        raise HTTPException(status_code=400, detail="Invalid move")
    if game_state.board[move.row][move.col] != 0:
        raise HTTPException(status_code=400, detail="Cell already occupied")
    if move.player != game_state.current_player:
        raise HTTPException(status_code=400, detail="Not your turn")

    # Update board with player's move
    game_state.board[move.row][move.col] = move.player
    if check_winner(game_state.board, move.row, move.col, move.player):
        game_state.winner = move.player
        return game_state

    # Switch player
    game_state.current_player = 3 - game_state.current_player

    # If AI mode and AI's turn, make the AI move
    if game_state.mode == "ai" and game_state.current_player == 2:
        # Make a copy of the board for AI to analyze
        board_copy = copy.deepcopy(game_state.board)
        
        # Get AI move
        ai_row, ai_col = get_ai_move(board_copy, 2)
        
        if ai_row is not None and ai_col is not None:
            # Apply AI move to the game state
            game_state.board[ai_row][ai_col] = 2
            
            # Check if AI won
            if check_winner(game_state.board, ai_row, ai_col, 2):
                game_state.winner = 2
            
            # Switch back to player's turn
            game_state.current_player = 1

    return game_state

@app.get("/state")
async def get_state():
    if not game_state:
        raise HTTPException(status_code=400, detail="Game not started")
    return game_state