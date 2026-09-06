// ==================== GAME ENGINE ====================
export { }; // Force module scope

const modal = document.getElementById('gameModal') as HTMLElement;
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
// Use definite type assertion. If canvas context is unavailable, the game logic won't work regardless.
const ctx = canvas.getContext('2d')!;
const scoreEl = document.getElementById('gameScore') as HTMLElement;
const titleEl = document.getElementById('gameTitle') as HTMLElement;
const closeBtn = document.getElementById('gameClose') as HTMLElement;
const mobileCtrl = document.getElementById('mobileControls') as HTMLElement;
let currentGame: string | null = null;
let gameLoop: number | null = null;


// Detect mobile
const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent) || window.innerWidth < 768;

// Open game
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const game = (card as HTMLElement).dataset.game;
        if (game) openGame(game);
    });
});

function openGame(game: string) {
    if (modal) modal.style.display = 'flex';
    if (scoreEl) scoreEl.textContent = '0';
    if (isMobile && mobileCtrl) mobileCtrl.style.display = 'flex';

    if (game === 'snake') {
        if (titleEl) titleEl.textContent = 'Snake 2.0';
        startSnake();
    } else if (game === 'tetris') {
        if (titleEl) titleEl.textContent = 'Tetris Void';
        startTetris();
    }
    currentGame = game;
}

function closeGame() {
    if (modal) modal.style.display = 'none';
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = null;
    currentGame = null;
}

if (closeBtn) closeBtn.addEventListener('click', closeGame);
if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeGame(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeGame(); });

// Mobile controls
document.querySelectorAll('.ctrl-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dir = (btn as HTMLElement).dataset.dir;
        if (dir) {
            if (currentGame === 'snake') snakeDir(dir);
            if (currentGame === 'tetris') tetrisDir(dir);
        }
    });
});

// Touch swipe support
let touchStartX = 0, touchStartY = 0;
if (canvas) {
    canvas.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    canvas.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 30) { if (currentGame === 'snake') snakeDir('right'); if (currentGame === 'tetris') tetrisDir('right'); }
            if (dx < -30) { if (currentGame === 'snake') snakeDir('left'); if (currentGame === 'tetris') tetrisDir('left'); }
        } else {
            if (dy > 30) { if (currentGame === 'snake') snakeDir('down'); if (currentGame === 'tetris') tetrisDir('down'); }
            if (dy < -30) { if (currentGame === 'snake') snakeDir('up'); if (currentGame === 'tetris') tetrisDir('up'); }
        }
    }, { passive: true });
}

// ==================== SNAKE GAME ====================
let snake: { x: number, y: number }[], food: { x: number, y: number }, dir: { x: number, y: number }, score: number, gridSize: number, tileCount: number;

function snakeDir(d: string) {
    const map: Record<string, { x: number, y: number }> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    const nd = map[d];
    if (nd && !(nd.x === -dir.x && nd.y === -dir.y)) dir = nd;
}

function startSnake() {
    const inner = modal.querySelector('.game-modal-inner');
    const sz = Math.min((inner ? inner.clientWidth : window.innerWidth) - 32, 400);
    canvas.width = sz; canvas.height = sz;
    gridSize = 20; tileCount = Math.floor(sz / gridSize);
    snake = [{ x: Math.floor(tileCount / 2), y: Math.floor(tileCount / 2) }];
    dir = { x: 1, y: 0 }; score = 0;
    placeFood();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = window.setInterval(updateSnake, 120);
}

function placeFood() {
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
}

function updateSnake() {
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    // Wrap
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;
    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
        if (gameLoop) clearInterval(gameLoop);
        drawSnake();
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff5f1f';
        ctx.font = 'bold 24px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillStyle = '#888';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText('Tap card to play again', canvas.width / 2, canvas.height / 2 + 20);
        return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++; scoreEl.textContent = score.toString();
        placeFood();
    } else {
        snake.pop();
    }
    drawSnake();
}

function drawSnake() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath(); ctx.moveTo(i * gridSize, 0); ctx.lineTo(i * gridSize, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * gridSize); ctx.lineTo(canvas.width, i * gridSize); ctx.stroke();
    }
    // Food
    ctx.fillStyle = '#ff5f1f';
    ctx.shadowBlur = 10; ctx.shadowColor = '#ff5f1f';
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Snake
    snake.forEach((s, i) => {
        const alpha = 1 - (i / snake.length) * 0.6;
        ctx.fillStyle = i === 0 ? '#fff' : `rgba(255, 95, 31, ${alpha})`;
        ctx.shadowBlur = i === 0 ? 8 : 0;
        ctx.shadowColor = '#ff5f1f';
        const r = i === 0 ? 4 : 2;
        const pad = 1;
        ctx.beginPath();
        // @ts-ignore
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(s.x * gridSize + pad, s.y * gridSize + pad, gridSize - pad * 2, gridSize - pad * 2, r);
        } else {
            ctx.rect(s.x * gridSize + pad, s.y * gridSize + pad, gridSize - pad * 2, gridSize - pad * 2);
        }
        ctx.fill();
    });
    ctx.shadowBlur = 0;
}

document.addEventListener('keydown', (e) => {
    if (currentGame !== 'snake') return;
    const map: Record<string, string> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    if (map[e.key]) { e.preventDefault(); snakeDir(map[e.key]); }
});

// ==================== TETRIS GAME ====================
const COLS = 10, ROWS = 20;
let board: string[][], piece: { shape: number[][], color: string }, piecePos: { x: number, y: number }, tetScore: number;
const SHAPES = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0, 0], [1, 1, 1]],
    [[0, 0, 1], [1, 1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]]
];
const COLORS = ['#00f3ff', '#ffcc00', '#ff5f1f', '#0a66c2', '#ff0055', '#00c853', '#5865f2'];

function tetrisDir(d: string) {
    if (d === 'left') movePiece(-1, 0);
    if (d === 'right') movePiece(1, 0);
    if (d === 'down') movePiece(0, 1);
    if (d === 'up') rotatePiece();
}

function startTetris() {
    const inner = modal.querySelector('.game-modal-inner');
    const cellSz = Math.min(Math.floor(((inner ? inner.clientWidth : window.innerWidth) - 32) / COLS), 22);
    canvas.width = COLS * cellSz;
    canvas.height = ROWS * cellSz;
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    tetScore = 0;
    spawnPiece();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = window.setInterval(tetTick, 500);
}

function spawnPiece() {
    const idx = Math.floor(Math.random() * SHAPES.length);
    piece = { shape: SHAPES[idx], color: COLORS[idx] };
    piecePos = { x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2), y: 0 };
    if (collides(piece.shape, piecePos.x, piecePos.y)) {
        if (gameLoop) clearInterval(gameLoop);
        drawTetris();
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff5f1f';
        ctx.font = 'bold 20px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillStyle = '#888';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('Tap card to play again', canvas.width / 2, canvas.height / 2 + 15);
    }
}

function collides(shape: number[][], ox: number, oy: number) {
    for (let r = 0; r < shape.length; r++)
        for (let c = 0; c < shape[r].length; c++)
            if (shape[r][c]) {
                const nx = ox + c, ny = oy + r;
                if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
                // @ts-ignore
                if (ny >= 0 && board[ny][nx]) return true;
            }
    return false;
}

function movePiece(dx: number, dy: number) {
    if (!collides(piece.shape, piecePos.x + dx, piecePos.y + dy)) {
        piecePos.x += dx;
        piecePos.y += dy;
        drawTetris();
        return true;
    }
    return false;
}

function rotatePiece() {
    const s = piece.shape;
    const rotated = s[0].map((_, i) => s.map(row => row[i]).reverse());
    if (!collides(rotated, piecePos.x, piecePos.y)) {
        piece.shape = rotated;
        drawTetris();
    }
}

function lockPiece() {
    for (let r = 0; r < piece.shape.length; r++)
        for (let c = 0; c < piece.shape[r].length; c++)
            if (piece.shape[r][c] && piecePos.y + r >= 0)
                // @ts-ignore
                board[piecePos.y + r][piecePos.x + c] = piece.color;
    // Clear lines
    let lines = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
        // @ts-ignore
        if (board[r].every(c => c)) {
            board.splice(r, 1);
            board.unshift(Array(COLS).fill(0));
            lines++; r++;
        }
    }
    if (lines) { tetScore += lines * 100; scoreEl.textContent = tetScore.toString(); }
    spawnPiece();
}

function tetTick() {
    if (!movePiece(0, 1)) { lockPiece(); }
}

function drawTetris() {
    const cellW = canvas.width / COLS;
    const cellH = canvas.height / ROWS;
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        ctx.strokeRect(c * cellW, r * cellH, cellW, cellH);
    }
    // Board
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        if (board[r][c]) {
            // @ts-ignore
            ctx.fillStyle = board[r][c];
            ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2);
        }
    }
    // Current piece
    if (piece) {
        ctx.shadowBlur = 6;
        ctx.shadowColor = piece.color;
        ctx.fillStyle = piece.color;
        for (let r = 0; r < piece.shape.length; r++)
            for (let c = 0; c < piece.shape[r].length; c++)
                if (piece.shape[r][c])
                    ctx.fillRect((piecePos.x + c) * cellW + 1, (piecePos.y + r) * cellH + 1, cellW - 2, cellH - 2);
        ctx.shadowBlur = 0;
    }
}

document.addEventListener('keydown', (e) => {
    if (currentGame !== 'tetris') return;
    const map: Record<string, string> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    if (map[e.key]) { e.preventDefault(); tetrisDir(map[e.key]); }
});
