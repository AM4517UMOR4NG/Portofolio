
export function initCursorTrail() {
    // 1. Create Canvas if it doesn't exist
    if (!document.getElementById('cursorCanvas')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'cursorCanvas';
        // Ensure styles are set inline or via CSS, but inline guarantees instant feedback
        canvas.style.position = 'fixed'; // Use fixed to follow scroll
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);
    }

    const cursorCanvas = document.getElementById('cursorCanvas') as HTMLCanvasElement;
    if (!cursorCanvas) return;

    const ctx = cursorCanvas.getContext('2d');
    if (!ctx) return;

    // 2. Setup Dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set explicit canvas size
    cursorCanvas.width = width;
    cursorCanvas.height = height;

    const resizeCanvas = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        cursorCanvas.width = width;
        cursorCanvas.height = height;
    };
    window.addEventListener('resize', resizeCanvas);

    // 3. Trail Logic
    // We start 'mouse' off-screen so lines don't streak across on load
    let mouse = { x: width / 2, y: height / 2 };
    const trail: { x: number, y: number }[] = [];
    // Increase trail length for more "swag"
    const TRAIL_LENGTH = 35;

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Animation Loop
    const animateCursor = () => {
        ctx.clearRect(0, 0, width, height);

        // Add current position to trail
        trail.push({ x: mouse.x, y: mouse.y });

        // Remove old points
        if (trail.length > TRAIL_LENGTH) {
            trail.shift();
        }

        // Draw Trail (Quadratic Curve for smoothness)
        if (trail.length > 2) {
            ctx.beginPath();
            ctx.moveTo(trail[0].x, trail[0].y);

            for (let i = 1; i < trail.length - 1; i++) {
                const xc = (trail[i].x + trail[i + 1].x) / 2;
                const yc = (trail[i].y + trail[i + 1].y) / 2;
                ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
            }

            // Connect to last point
            ctx.quadraticCurveTo(
                trail[trail.length - 1].x, trail[trail.length - 1].y,
                trail[trail.length - 1].x, trail[trail.length - 1].y
            );

            // Styling
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Create Gradient (Fade out tail)
            const gradient = ctx.createLinearGradient(
                trail[0].x, trail[0].y,
                trail[trail.length - 1].x, trail[trail.length - 1].y
            );
            // Transparent tail
            gradient.addColorStop(0, 'rgba(255, 0, 85, 0)');
            // Solid bright head
            gradient.addColorStop(1, 'rgba(255, 0, 85, 0.9)');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3; // Thicker line

            // Glow Effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff0055';

            ctx.stroke();
        }

        requestAnimationFrame(animateCursor);
    };

    animateCursor();
}
