# Gomoku AI Project Report

## Project Overview

This report describes the implementation of a Gomoku (Five in a Row) game with an AI opponent that uses minimax algorithm with alpha-beta pruning. The game is implemented as a web application with a Python backend using FastAPI and a JavaScript frontend, providing both player vs. player and player vs. AI modes.

## Implementation Details

### Game Architecture

The project follows a client-server architecture:
- **Backend**: Implemented in Python using FastAPI to provide RESTful API endpoints
- **Frontend**: Built with HTML, CSS, and vanilla JavaScript
- **Game Logic**: Organized into modules for AI, game mechanics, and API handling

### AI Components Implementation

#### 1. Game Tree Search & Minimax Algorithm

The AI uses the minimax algorithm to select optimal moves by searching through possible game states. The implementation is found in the `minimax` function in `ai_engine.py`, which:
- Recursively evaluates board positions
- Selects moves that maximize the AI's advantage while minimizing the opponent's advantage
- Adjusts search depth based on the game stage (early, mid, or late game)
- Uses an optimized search space to focus on the most promising moves

```python
def minimax(board, depth, alpha, beta, maximizing, player):
    # ... implementation details
    if maximizing:
        max_eval = -math.inf
        best_move = None
        for r, c in moves:
            board[r][c] = player
            eval_score, _ = minimax(board, depth - 1, alpha, beta, False, player)
            # ... rest of implementation
    # ... minimizing player implementation
```

#### 2. Alpha-Beta Pruning

To improve efficiency, the minimax search is enhanced with alpha-beta pruning that eliminates branches that cannot influence the final decision:

```python
if maximizing:
    # ... maximizing logic
    alpha = max(alpha, eval_score)
    if beta <= alpha:
        break  # Pruning
else:
    # ... minimizing logic
    beta = min(beta, eval_score)
    if beta <= alpha:
        break  # Pruning
```

This pruning mechanism significantly reduces the number of nodes evaluated, allowing for deeper searches within the same computational constraints.

#### 3. Evaluation Function

The project implements a sophisticated evaluation function in `evaluate_board()` that calculates the "goodness" of a board position by:
- Detecting and scoring various patterns (five in a row, open four, closed four, etc.)
- Comparing patterns for both AI and opponent
- Weighting different patterns based on their strategic value

```python
pattern_scores = {
    "five": 100000,   # Five in a row (winning)
    "open_four": 10000,  # Four with open ends
    "four": 1000,     # Four in a row (closed)
    "open_three": 500,   # Three with open ends
    "three": 100,     # Three in a row (closed)
    "open_two": 50,    # Two with open ends
    "two": 10         # Two in a row (closed)
}
```

The evaluation includes pattern detection across all lines (horizontal, vertical, and both diagonals), optimized through the `extract_all_lines()` function to avoid redundant computations.

#### 4. Early Stopping Mechanism

The implementation includes multiple early stopping mechanisms:
- Immediate termination if a winning move is detected: `check_for_immediate_win()`
- Depth-limited search that stops at a predetermined depth and evaluates the position
- Adaptive search depth based on the stage of the game:
  ```python
  if stones <= 8:
      depth = 1  # Very shallow depth for fast response
  elif stones <= 20:
      depth = 2  # Moderate depth
  else:
      depth = 3  # Deeper depth for better decisions
  ```
  
This approach balances computational resources with effective gameplay, allowing for deeper searches in critical game positions.

#### 5. Move Ordering Optimization

The code implements move ordering to improve alpha-beta pruning efficiency:
```python
# Sort moves by a simple evaluation to optimize alpha-beta pruning
move_scores = []
for r, c in moves:
    board[r][c] = player if maximizing else 3-player
    score = quick_evaluate(board, r, c, player)
    board[r][c] = 0
    move_scores.append((score, (r, c)))
        
# Sort moves by score
move_scores.sort(reverse=maximizing)
moves = [move for _, move in move_scores]
```

This ensures the most promising moves are evaluated first, increasing pruning opportunities.

### User Interface

The project implements an aesthetic and functional graphical user interface with:
- A responsive web interface built with HTML, CSS, and JavaScript
- Visual elements including a wooden-textured game board, black and white stones
- Game mode selection (player vs. player or player vs. AI)
- Clear status indicators for current player and game outcome
- Attractive styling with gradients, shadows, and animations
- Interactive elements (hover effects on cells, styled buttons)

## Limitations and Unimplemented Features

While the project implements all core requirements, the following aspects could be developed further:
- The implementation uses a fixed board size of 15x15, with no option to change dimensions
- There are no difficulty settings for the AI (although search depth changes with game stage)
- No undo functionality for moves
- No game history or replay feature

## Conclusion

The Gomoku AI project successfully implements all the required components, creating a functional and visually appealing game with an AI that plays competently. The modular design separates concerns between game mechanics, AI logic, and user interface, making the code maintainable and extensible.

The evaluation function and alpha-beta pruning implementation work together to create an AI that can make reasonable decisions within an efficient search space, while the responsive user interface provides a satisfying game experience for users.
