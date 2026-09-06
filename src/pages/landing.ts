export { }; // Force module scope

const exploreBtn = document.getElementById('exploreBtn');
const flowContent = document.getElementById('flowContent');
const svgLayer = document.getElementById('svgLayer');
const introOverlay = document.getElementById('introOverlay');
let isActive = false;
let introShown = false;

const showDiagram = () => {
    if (flowContent) flowContent.classList.add('active');
    drawDiagram();
};

const runIntro = () => {
    if (!introOverlay) return;
    introOverlay.classList.add('visible');
    setTimeout(() => {
        introOverlay.classList.add('exit');
        setTimeout(() => {
            introOverlay.style.display = 'none';
            showDiagram();
        }, 500);
    }, 4500);
};

if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
        if (isActive) return;
        isActive = true;
        exploreBtn.classList.add('hidden');
        introShown ? showDiagram() : (introShown = true, runIntro());
    });
}

// Global state for current pattern
let currentPattern = 'circuit';
const patterns = ['circuit', 'direct', 'curve', 'glitch'];

// Function to update visual state
function updatePatternVisuals(patternIndex: number) {
    const modeIndicator = document.getElementById('modeIndicator');
    if (modeIndicator) {
        modeIndicator.textContent = patterns[patternIndex].toUpperCase() + ' MODE';
    }

    // Update palette label
    const paletteLabel = document.querySelector('.palette-label');
    if (paletteLabel) {
        paletteLabel.textContent = patterns[patternIndex].toUpperCase();
    }

    // Reset all dots
    document.querySelectorAll('.control-item .color-dot').forEach((d) => {
        (d as HTMLElement).style.transform = 'scale(1)';
        (d as HTMLElement).style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    });
    document.querySelectorAll('.control-item span').forEach((s) => (s as HTMLElement).style.color = '#666');

    // Highlight active
    const activeItem = document.querySelectorAll('.control-item')[patternIndex];
    if (activeItem) {
        const dot = activeItem.querySelector('.color-dot') as HTMLElement;
        const label = activeItem.querySelector('span') as HTMLElement;
        if (dot) {
            dot.style.transform = 'scale(1.5)';
            dot.style.boxShadow = '0 0 15px currentColor';
        }
        if (label) label.style.color = '#fff';
    }
}

// Mode indicator click - cycle through patterns
const modeIndicator = document.getElementById('modeIndicator');
if (modeIndicator) {
    modeIndicator.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentIndex = patterns.indexOf(currentPattern);
        const nextIndex = (currentIndex + 1) % patterns.length;
        currentPattern = patterns[nextIndex];

        updatePatternVisuals(nextIndex);

        if (isActive) {
            drawDiagram();
        }
    });
}

// Listen to control item clicks
document.querySelectorAll('.control-item').forEach((item, index) => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        currentPattern = patterns[index] || 'circuit';

        updatePatternVisuals(index);

        if (isActive) {
            drawDiagram();
        }
    });
});

function drawDiagram() {
    if (!svgLayer) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w <= 768;

    // Responsive Layout Config
    let leftX, rightX;

    if (isMobile) {
        leftX = 20;
        rightX = w - 150; // Increased spacing for label fit
    } else {
        leftX = 80;
        rightX = w * 0.65;
    }

    const diamondSize = isMobile ? 12 : 18;

    // Vertical Spacing Logic
    // Updated: Increase top margin on mobile to push content below the fixed mode button
    const topMargin = isMobile ? 150 : Math.max(h * 0.12, 120);
    // Drastically increase bottom margin for mobile to avoid overlap
    // Updated: Increase desktop bottom margin to 200px to clear Control Panel (User "mode laptop tabrakan")
    const bottomMargin = isMobile ? 250 : 200;

    let availableHeight = h - topMargin - bottomMargin;

    // If screen is really short, ensure minimum spacing but allow scroll if needed? 
    // Better to compact.
    if (isMobile && availableHeight < 250) {
        availableHeight = 250; // Force minimum height
    }

    const itemStep = availableHeight / 3;

    const d1y = topMargin;
    const d2y = d1y + itemStep;
    const d3y = d2y + itemStep;
    const d4y = d3y + itemStep;

    const projY = d1y + (isMobile ? 25 : 30);
    const repoY = d2y + (isMobile ? 25 : 30);
    const contY = d3y + (isMobile ? 25 : 30);
    const abutY = d4y + (isMobile ? 25 : 30);

    // Target X for the LINE (Arrow tip will be beyond this by ~10px)
    // Subtracting to account for refX=0 adjustment
    const endLineX = rightX - 12;

    // Lanes for circuit/glitch
    const lanes: any[] = [
        { x1: 100, x2: 180 },
        { x1: 220, x2: 300 },
        { x1: 340, x2: 420 },
        { x1: 460, x2: 540 }
    ];

    // If mobile, simplify lanes to avoid off-screen
    if (isMobile) {
        // Keep lanes very compact on the left
        lanes[0] = { x1: leftX + 5, x2: leftX + 15 };
        lanes[1] = { x1: leftX + 10, x2: leftX + 25 };
        lanes[2] = { x1: leftX + 15, x2: leftX + 20 };
        lanes[3] = { x1: leftX + 5, x2: leftX + 25 };
    }

    // --- PATTERN GENERATORS ---

    // 1. CIRCUIT (Tech Trace with Chamfers & Nodes)
    function getCircuitPath(sx: number, sy: number, lane: any, ey: number, ex: number) {
        // Mobile: Simple L-shape with chamfer (Straight look)
        if (isMobile) {
            const c = 8; // Smaller chamfer for mobile
            const turnX = sx + 15; // Turn shortly after start

            // Simple path: Start -> Right to TurnX -> Down to EY -> Right to End
            let path = `M ${sx} ${sy} `;
            // First corner (Right -> Down)
            path += `L ${turnX - c} ${sy} L ${turnX} ${sy + c} `;
            // Vertical line down to ey
            // Second corner (Down -> Right)
            path += `L ${turnX} ${ey - c} L ${turnX + c} ${ey} `;
            // Final line to target
            path += `L ${ex} ${ey}`;
            return path;
        }

        // Desktop: Original Double-Step Logic
        const midY = sy + (ey - sy) * 0.5;
        const c = 15; // Chamfer size

        let path = `M ${sx} ${sy} `;
        path += `L ${lane.x1 - c} ${sy} L ${lane.x1} ${sy + c} `; // Corner 1
        path += `L ${lane.x1} ${midY - c} L ${lane.x1 + c} ${midY} `; // Corner 2
        path += `L ${lane.x2 - c} ${midY} L ${lane.x2} ${midY + c} `; // Corner 3
        path += `L ${lane.x2} ${ey - c} L ${lane.x2 + c} ${ey} `; // Corner 4
        path += `L ${ex} ${ey}`;
        return path;
    }

    // 2. DIRECT (Sharp & Clean)
    function getDirectPath(sx: number, sy: number, lane: any, ey: number, ex: number) {
        return `M ${sx} ${sy} H ${lane.x2} V ${ey} H ${ex}`;
    }

    // 3. CURVE (Smooth Sigmoid)
    function getCurvePath(sx: number, sy: number, lane: any, ey: number, ex: number) {
        // Double Bezier for S-shape
        const midX = (sx + ex) * 0.5;
        const midY = (sy + ey) * 0.5;
        return `M ${sx} ${sy} 
               C ${lane.x1} ${sy}, ${lane.x1} ${midY}, ${midX} ${midY}
               S ${ex} ${ey}, ${ex} ${ey}`;
    }

    // 4. GLITCH (Random Stepped)
    function getGlitchPath(sx: number, sy: number, lane: any, ey: number, ex: number) {
        const midY = (sy + ey) / 2;
        const noise = () => (Math.random() - 0.5) * 30;
        // Jagged path
        return `M ${sx} ${sy} 
                H ${lane.x1 + noise()} V ${midY + noise()} 
                H ${lane.x2 + noise()} V ${ey + noise()} 
                H ${ex}`;
    }

    let path1, path2, path3, path4;
    let nodesHTML = ''; // Only for circuit

    if (currentPattern === 'circuit') {
        path1 = getCircuitPath(leftX, d1y, lanes[0], projY, endLineX);
        path2 = getCircuitPath(leftX, d2y, lanes[1], repoY, endLineX);
        path3 = getCircuitPath(leftX, d3y, lanes[2], contY, endLineX);
        path4 = getCircuitPath(leftX, d4y, lanes[3], abutY, endLineX);

        // Add tech nodes at chamfer points
        const createNodes = (lane: any, sy: number, ey: number) => {
            const midY = sy + (ey - sy) * 0.5;
            const c = 15;
            // 8 points per line for max tech feels
            return `
                <!-- Corner 1 -->
                <circle class="circuit-node" cx="${lane.x1 - c}" cy="${sy}" r="1.5" />
                <circle class="circuit-node" cx="${lane.x1}" cy="${sy + c}" r="1.5" />
                <!-- Corner 2 -->
                <circle class="circuit-node" cx="${lane.x1}" cy="${midY - c}" r="1.5" />
                <circle class="circuit-node" cx="${lane.x1 + c}" cy="${midY}" r="1.5" />
                <!-- Corner 3 -->
                <circle class="circuit-node" cx="${lane.x2 - c}" cy="${midY}" r="1.5" />
                <circle class="circuit-node" cx="${lane.x2}" cy="${midY + c}" r="1.5" />
                <!-- Corner 4 -->
                <circle class="circuit-node" cx="${lane.x2}" cy="${ey - c}" r="1.5" />
                <circle class="circuit-node" cx="${lane.x2 + c}" cy="${ey}" r="1.5" />
            `;
        };
        nodesHTML = createNodes(lanes[0], d1y, projY) + createNodes(lanes[1], d2y, repoY) +
            createNodes(lanes[2], d3y, contY) + createNodes(lanes[3], d4y, abutY);

    } else if (currentPattern === 'direct') {
        path1 = getDirectPath(leftX, d1y, lanes[0], projY, endLineX);
        path2 = getDirectPath(leftX, d2y, lanes[1], repoY, endLineX);
        path3 = getDirectPath(leftX, d3y, lanes[2], contY, endLineX);
        path4 = getDirectPath(leftX, d4y, lanes[3], abutY, endLineX);

    } else if (currentPattern === 'curve') {
        path1 = getCurvePath(leftX, d1y, lanes[0], projY, endLineX);
        path2 = getCurvePath(leftX, d2y, lanes[1], repoY, endLineX);
        path3 = getCurvePath(leftX, d3y, lanes[2], contY, endLineX);
        path4 = getCurvePath(leftX, d4y, lanes[3], abutY, endLineX);

    } else { // GLITCH
        path1 = getGlitchPath(leftX, d1y, lanes[0], projY, endLineX);
        path2 = getGlitchPath(leftX, d2y, lanes[1], repoY, endLineX);
        path3 = getGlitchPath(leftX, d3y, lanes[2], contY, endLineX);
        path4 = getGlitchPath(leftX, d4y, lanes[3], abutY, endLineX);
    }


    svgLayer.innerHTML = `
        <defs>
            <!-- Sleek Cyber Arrow (Stealth) -->
            <!-- refX=0 means the line stops at the very back (x=0) of the arrow -->
            <marker id="arrow" viewBox="0 0 12 12" refX="0" refY="6" 
                    markerWidth="10" markerHeight="10" orient="auto">
                <path d="M 0 2 L 10 6 L 0 10 L 3 6 z" fill="#ff0055"/>
            </marker>
            
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#00f3ff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ff0055;stop-opacity:1" />
            </linearGradient>
        </defs>

        <!-- Main Vertical Line -->
        <line class="main-line" x1="${leftX}" y1="${d1y}" x2="${leftX}" y2="${h - 40}"/>

        <!-- Circuit Nodes (Only if circuit pattern) -->
        <g class="circuit-group">${nodesHTML}</g>

        <!-- Branch Lines (Paths) -->
        <!-- Subtracting offset from rightX to allow space for arrow body -->
        <path id="p1" class="branch-line" d="${path1}" marker-end="url(#arrow)" />
        <path id="p2" class="branch-line" d="${path2}" marker-end="url(#arrow)" />
        <path id="p3" class="branch-line" d="${path3}" marker-end="url(#arrow)" />
        <path id="p4" class="branch-line" d="${path4}" marker-end="url(#arrow)" />

        <!-- Diamonds (Groups) - Hide on Mobile -->
        ${!isMobile ? `
        <g class="diamond-group" transform="translate(${leftX}, ${d1y}) rotate(45)">
            <rect class="diamond-shape" x="${-diamondSize}" y="${-diamondSize}" width="${diamondSize * 2}" height="${diamondSize * 2}"/>
            <circle class="diamond-center" cx="0" cy="0" r="4"/>
        </g>
        <g class="diamond-group" transform="translate(${leftX}, ${d2y}) rotate(45)">
            <rect class="diamond-shape" x="${-diamondSize}" y="${-diamondSize}" width="${diamondSize * 2}" height="${diamondSize * 2}"/>
            <circle class="diamond-center" cx="0" cy="0" r="4"/>
        </g>
        <g class="diamond-group" transform="translate(${leftX}, ${d3y}) rotate(45)">
            <rect class="diamond-shape" x="${-diamondSize}" y="${-diamondSize}" width="${diamondSize * 2}" height="${diamondSize * 2}"/>
            <circle class="diamond-center" cx="0" cy="0" r="4"/>
        </g>
        <g class="diamond-group" transform="translate(${leftX}, ${d4y}) rotate(45)">
            <rect class="diamond-shape" x="${-diamondSize}" y="${-diamondSize}" width="${diamondSize * 2}" height="${diamondSize * 2}"/>
            <circle class="diamond-center" cx="0" cy="0" r="4"/>
        </g>
        ` : ''}

        <!-- Flow Particles -->
        <circle class="particle" r="3"><animateMotion dur="3s" repeatCount="indefinite" path="${path1}" keyTimes="0;1" keyPoints="0;1"/></circle>
        <circle class="particle" r="3"><animateMotion dur="4s" repeatCount="indefinite" begin="0.5s" path="${path2}" keyTimes="0;1" keyPoints="0;1"/></circle>
        <circle class="particle" r="3"><animateMotion dur="3.5s" repeatCount="indefinite" begin="1s" path="${path3}" keyTimes="0;1" keyPoints="0;1"/></circle>
        <circle class="particle" r="3"><animateMotion dur="4.2s" repeatCount="indefinite" begin="0.2s" path="${path4}" keyTimes="0;1" keyPoints="0;1"/></circle>
    `;

    // Position labels (DOM Elements)
    // On mobile, keep them closer to the arrow but not touching
    // Increased margin to 40px to absolutely prevent overlap (User "masih timpa")
    const labelMargin = isMobile ? 40 : 25;
    const labelLeft = endLineX + labelMargin;
    const mobileScale = isMobile ? 'transform: scale(0.85); transform-origin: left;' : '';

    // Helper to set style
    const setLabelPos = (id: string, y: number) => {
        const el = document.getElementById(id);
        if (el) {
            el.style.cssText = `top: ${y - (isMobile ? 15 : 20)}px; left: ${labelLeft}px; ${mobileScale}`;
        }
    };

    setLabelPos('label-projects', projY);
    setLabelPos('label-repos', repoY);
    setLabelPos('label-contact', contY);
    setLabelPos('label-about', abutY);

    // Hover interactions (JS for path lighting)
    setupHoverEffect('label-projects', 'p1');
    setupHoverEffect('label-repos', 'p2');
    setupHoverEffect('label-contact', 'p3');
    setupHoverEffect('label-about', 'p4');
}

function setupHoverEffect(labelId: string, pathId: string) {
    const label = document.getElementById(labelId);
    const path = document.getElementById(pathId);

    if (label && path) {
        label.addEventListener('mouseenter', () => {
            path.style.stroke = '#fff';
            path.style.filter = 'drop-shadow(0 0 10px #fff)';
            path.style.strokeWidth = '3';
        });

        label.addEventListener('mouseleave', () => {
            path.style.stroke = '';
            path.style.filter = '';
            path.style.strokeWidth = '';
        });
    }
}

window.addEventListener('resize', () => {
    if (isActive) drawDiagram();
});
