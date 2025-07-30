import copy
import math
from backend.game_mechanics import check_winner

def evaluate_board(board, player):
    score = 0
    opponent = 3 - player  # 1 -> 2, 2 -> 1
    directions = [(0, 1), (1, 0), (1, 1), (1, -1)]
    
    # Pattern scores
    pattern_scores = {
        "five": 100000,   # Five in a row (winning)
        "open_four": 10000,  # Four with open ends
        "four": 1000,     # Four in a row (closed)
        "open_three": 500,   # Three with open ends
        "three": 100,     # Three in a row (closed)
        "open_two": 50,    # Two with open ends
        "two": 10         # Two in a row (closed)
    }
    
    # Optimization: Extract all lines once instead of repeatedly for each cell
    lines = extract_all_lines(board)
    
    # Check for winning patterns first (quick win/loss detection)
    for line_type, all_lines in lines.items():
        for line in all_lines:
            # Check for winning pattern (five in a row)
            for i in range(len(line) - 4):
                window = line[i:i+5]
                if window.count(player) == 5:
                    return pattern_scores["five"]  # Player wins
                elif window.count(opponent) == 5:
                    return -pattern_scores["five"]  # Opponent wins
    
    # Evaluate all lines for patterns
    for line_type, all_lines in lines.items():
        for line in all_lines:
            # Evaluate patterns for both players
            player_score = evaluate_line(line, player, pattern_scores)
            opponent_score = evaluate_line(line, opponent, pattern_scores)
            
            score += player_score - opponent_score
    
    return score

def extract_all_lines(board):
    """Extract all lines (horizontal, vertical, diagonal) from the board once."""
    lines = {
        "horizontal": [],
        "vertical": [],
        "diagonal1": [],  # top-left to bottom-right
        "diagonal2": []   # top-right to bottom-left
    }
    
    # Extract horizontal lines
    for r in range(15):
        lines["horizontal"].append([board[r][c] for c in range(15)])
    
    # Extract vertical lines
    for c in range(15):
        lines["vertical"].append([board[r][c] for r in range(15)])
    
    # Extract diagonal lines (top-left to bottom-right)
    for offset in range(-10, 11):  # Cover all possible diagonals
        diagonal = []
        for i in range(15):
            r, c = i, i + offset
            if 0 <= r < 15 and 0 <= c < 15:
                diagonal.append(board[r][c])
        if len(diagonal) >= 5:  # Only consider lines that could contain 5 or more stones
            lines["diagonal1"].append(diagonal)
    
    # Extract diagonal lines (top-right to bottom-left)
    for offset in range(-10, 11):
        diagonal = []
        for i in range(15):
            r, c = i, 14 - i + offset
            if 0 <= r < 15 and 0 <= c < 15:
                diagonal.append(board[r][c])
        if len(diagonal) >= 5:
            lines["diagonal2"].append(diagonal)
    
    return lines
    
def evaluate_line(line, player, pattern_scores):
    """Evaluate a single line for patterns of a specific player."""
    score = 0
    
    # Check for five in a row
    for i in range(len(line) - 4):
        window = line[i:i+5]
        if window.count(player) == 5:
            score += pattern_scores["five"]
    
    # Check for open four
    for i in range(len(line) - 5):
        if i >= 0 and i+5 < len(line):  # Ensure the window is valid
            window = line[i:i+6]
            if window[0] == 0 and window[1:5].count(player) == 4 and window[5] == 0:
                score += pattern_scores["open_four"]
    
    # Check for closed four
    for i in range(len(line) - 3):
        window = line[i:i+4]
        if window.count(player) == 4:
            # Check if there's an empty space nearby
            has_empty_space = False
            for j in range(max(0, i-1), min(len(line), i+5)):
                if j < len(line) and line[j] == 0:
                    has_empty_space = True
                    break
            if has_empty_space:
                score += pattern_scores["four"]
    
    # Check for open three
    for i in range(len(line) - 4):
        if i >= 0 and i+4 < len(line):
            window = line[i:i+5]
            if window[0] == 0 and window[1:4].count(player) == 3 and window[4] == 0:
                score += pattern_scores["open_three"]
    
    # Check for closed three
    for i in range(len(line) - 2):
        window = line[i:i+3]
        if window.count(player) == 3:
            score += pattern_scores["three"]
    
    # Check for open two
    for i in range(len(line) - 3):
        if i >= 0 and i+3 < len(line):
            window = line[i:i+4]
            if window[0] == 0 and window[1:3].count(player) == 2 and window[3] == 0:
                score += pattern_scores["open_two"]
    
    # Check for closed two
    for i in range(len(line) - 1):
        window = line[i:i+2]
        if window.count(player) == 2:
            score += pattern_scores["two"]
    
    return score

def analyze_pattern(line, player):
    """Analyze a line of cells for various patterns."""
    opponent = 3 - player
    score = 0
    
    # Scores for different patterns
    pattern_scores = {
        "five": 100000,   # Five in a row (winning)
        "open_four": 10000,  # Four with open ends
        "four": 1000,     # Four in a row (closed)
        "open_three": 500,   # Three with open ends
        "three": 100,     # Three in a row (closed)
        "open_two": 50,    # Two with open ends
        "two": 10         # Two in a row (closed)
    }
    
    # Check for five in a row
    for i in range(len(line) - 4):
        window = line[i:i+5]
        if window.count(player) == 5:
            score += pattern_scores["five"]
            return score
    
    # Check for open four (●●●●○)
    for i in range(len(line) - 5):
        window = line[i:i+6]
        if (window[0] == 0 and window[1:5].count(player) == 4 and window[5] == 0):
            score += pattern_scores["open_four"]
    
    # Check for closed four (●●●●)
    for i in range(len(line) - 3):
        window = line[i:i+4]
        if window.count(player) == 4 and 0 in line[max(0, i-1):min(len(line), i+5)]:
            score += pattern_scores["four"]
    
    # Check for open three (○●●●○)
    for i in range(len(line) - 4):
        window = line[i:i+5]
        if window[0] == 0 and window[1:4].count(player) == 3 and window[4] == 0:
            score += pattern_scores["open_three"]
    
    # Check for closed three
    for i in range(len(line) - 2):
        window = line[i:i+3]
        if window.count(player) == 3:
            score += pattern_scores["three"]
    
    # Check for open two
    for i in range(len(line) - 3):
        window = line[i:i+4]
        if window[0] == 0 and window[1:3].count(player) == 2 and window[3] == 0:
            score += pattern_scores["open_two"]
    
    # Check for two
    for i in range(len(line) - 1):
        window = line[i:i+2]
        if window.count(player) == 2:
            score += pattern_scores["two"]
    
    return score

def get_possible_moves(board):
    moves = []
    has_stones = False
    
    # Check if the board has any stones
    for r in range(15):
        for c in range(15):
            if board[r][c] != 0:
                has_stones = True
                break
        if has_stones:
            break
            
    # If no stones, return center and nearby positions as good starting moves
    if not has_stones:
        center = 7
        return [(center, center), 
                (center-1, center), (center+1, center), 
                (center, center-1), (center, center+1),
                (center-1, center-1), (center-1, center+1),
                (center+1, center-1), (center+1, center+1)]
    
    # Focus on positions near existing stones
    for r in range(15):
        for c in range(15):
            if board[r][c] == 0:
                # Check if there's a stone in the 3x3 area around this position
                has_nearby_stone = False
                for dr in range(-2, 3):
                    for dc in range(-2, 3):
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < 15 and 0 <= nc < 15 and board[nr][nc] != 0:
                            has_nearby_stone = True
                            break
                    if has_nearby_stone:
                        break
                
                if has_nearby_stone:
                    moves.append((r, c))
    
    # If no moves found (unlikely), return all empty cells
    if not moves:
        for r in range(15):
            for c in range(15):
                if board[r][c] == 0:
                    moves.append((r, c))
                    
    return moves

def count_stones(board):
    """Count the number of stones on the board."""
    count = 0
    for r in range(15):
        for c in range(15):
            if board[r][c] != 0:
                count += 1
    return count

def get_ai_move(board, player):
    """Get the best move for the AI based on different strategies."""
    # Count stones to determine the game stage
    stones = count_stones(board)
    
    # Optimization: For the very first move, always play center (fastest response)
    if stones == 0:
        return 7, 7  # Center of the board
    
    # For the first few moves, use a simple and fast strategy
    if stones <= 2:
        # Find the first player's stone or use the center
        for r in range(15):
            for c in range(15):
                if board[r][c] == 1:
                    # Play near the human player's stone - optimized to check immediate surroundings first
                    # Prioritize positions that are likely to be strong
                    priority_directions = [(1, 1), (1, -1), (-1, 1), (-1, -1), (0, 1), (1, 0), (0, -1), (-1, 0)]
                    for dr, dc in priority_directions:
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < 15 and 0 <= nc < 15 and board[nr][nc] == 0:
                            return nr, nc
        # If no player stones or couldn't find a spot, use center or nearby
        center = 7
        if board[center][center] == 0:
            return center, center
        else:
            # Try positions around center
            for dr in range(-1, 2):
                for dc in range(-1, 2):
                    if dr == 0 and dc == 0:
                        continue
                    nr, nc = center + dr, center + dc
                    if 0 <= nr < 15 and 0 <= nc < 15 and board[nr][nc] == 0:
                        return nr, nc
            
    # Check for immediate win or block before running expensive minimax
    winner_score, move = check_for_immediate_win(board, player)
    if move is not None:
        return move
    
    # For early-mid game, use shallow minimax with reduced search space
    if stones <= 8:
        depth = 1  # Very shallow depth for fast response
        _, move = minimax(copy.deepcopy(board), depth, -math.inf, math.inf, True, player)
        return move
    
    # For mid game, balance speed and accuracy
    elif stones <= 20:
        depth = 2  # Moderate depth
        _, move = minimax(copy.deepcopy(board), depth, -math.inf, math.inf, True, player)
        return move
    
    # For late game, use deeper search for better decisions
    else:
        depth = 3  # Deeper depth for better decisions
        _, move = minimax(copy.deepcopy(board), depth, -math.inf, math.inf, True, player)
        return move

def minimax(board, depth, alpha, beta, maximizing, player):
    # Optimization: Check for a terminal state first
    winner_score, move = check_for_immediate_win(board, player)
    if winner_score is not None:
        return winner_score, move
        
    if depth == 0:
        return evaluate_board(board, player), None
    
    moves = get_possible_moves(board)
    if not moves:
        return evaluate_board(board, player), None
    
    # If this is the top-level call, sort moves by a quick evaluation
    if depth == 3 or depth == 2:
        # Sort moves by a simple evaluation to optimize alpha-beta pruning
        move_scores = []
        for r, c in moves:
            board[r][c] = player if maximizing else 3-player
            score = quick_evaluate(board, r, c, player)
            board[r][c] = 0
            move_scores.append((score, (r, c)))
        
        # Sort moves by score (descending if maximizing, ascending if not)
        move_scores.sort(reverse=maximizing)
        moves = [move for _, move in move_scores]
    
    if maximizing:
        max_eval = -math.inf
        best_move = None
        for r, c in moves:
            board[r][c] = player
            if check_winner(board, r, c, player):
                board[r][c] = 0
                return 100000, (r, c)
            eval_score, _ = minimax(board, depth - 1, alpha, beta, False, player)
            board[r][c] = 0
            if eval_score > max_eval:
                max_eval = eval_score
                best_move = (r, c)
            alpha = max(alpha, eval_score)
            if beta <= alpha:
                break
        return max_eval, best_move
    else:
        min_eval = math.inf
        best_move = None
        opponent = 3 - player
        for r, c in moves:
            board[r][c] = opponent
            if check_winner(board, r, c, opponent):
                board[r][c] = 0
                return -100000, (r, c)
            eval_score, _ = minimax(board, depth - 1, alpha, beta, True, player)
            board[r][c] = 0
            if eval_score < min_eval:
                min_eval = eval_score
                best_move = (r, c)
            beta = min(beta, eval_score)
            if beta <= alpha:
                break
        return min_eval, best_move

def check_for_immediate_win(board, player):
    """Check if there's an immediate win or block needed."""
    opponent = 3 - player
    
    # First check if AI can win in one move
    for r in range(15):
        for c in range(15):
            if board[r][c] == 0:
                board[r][c] = player
                if check_winner(board, r, c, player):
                    board[r][c] = 0
                    return 100000, (r, c)
                board[r][c] = 0
    
    # Then check if need to block opponent's win
    for r in range(15):
        for c in range(15):
            if board[r][c] == 0:
                board[r][c] = opponent
                if check_winner(board, r, c, opponent):
                    board[r][c] = 0
                    return -99000, (r, c)  # Slightly less than player winning
                board[r][c] = 0
    
    # No immediate win or block needed
    return None, None

def quick_evaluate(board, row, col, player):
    """Quick evaluation of a position for move ordering."""
    directions = [(0, 1), (1, 0), (1, 1), (1, -1)]
    score = 0
    
    for dr, dc in directions:
        # Count stones in both directions
        for direction in [1, -1]:
            count_player = 0
            count_opponent = 0
            count_empty = 0
            
            for step in range(1, 5):
                r, c = row + dr * direction * step, col + dc * direction * step
                if 0 <= r < 15 and 0 <= c < 15:
                    if board[r][c] == player:
                        count_player += 1
                    elif board[r][c] == 3 - player:
                        count_opponent += 1
                    else:
                        count_empty += 1
                        
        # More player stones nearby is good
        score += count_player * 10
        # Opponent stones nearby might be threatening
        score += count_opponent * 5
        # Empty spaces are good for potential
        score += count_empty * 2
        
    return score
