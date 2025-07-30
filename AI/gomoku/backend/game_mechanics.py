def initialize_board():
    return [[0 for _ in range(15)] for _ in range(15)]

def check_winner(board, row, col, player):
    directions = [(0, 1), (1, 0), (1, 1), (1, -1)]  # Horizontal, Vertical, Diagonal
    for dr, dc in directions:
        count = 1
        # Check in both directions
        for step in [-1, 1]:
            r, c = row + dr * step, col + dc * step
            while 0 <= r < 15 and 0 <= c < 15 and board[r][c] == player:
                count += 1
                r += dr * step
                c += dc * step
        if count >= 5:
            return True
    return False