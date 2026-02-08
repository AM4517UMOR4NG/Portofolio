import './style.css';
import { initSidebar } from './components/sidebar';
import { SettingsManager } from './utils/SettingsManager';

// Initialize Dynamic Sidebar
initSidebar();

// Settings Page Logic - check for both /settings and /settings.html
const isSettingsPage = window.location.pathname.includes('settings');
if (isSettingsPage) {
    const settings = SettingsManager.getInstance();

    const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
    const sidebarPrefToggle = document.getElementById('sidebar-pref-toggle') as HTMLInputElement;
    const animToggle = document.getElementById('anim-toggle') as HTMLInputElement;

    // Sync UI with State
    if (themeToggle) {
        themeToggle.checked = settings.state.theme === 'dark'; // Assuming dark default
        themeToggle.addEventListener('change', (e) => {
            const isDark = (e.target as HTMLInputElement).checked;
            settings.update('theme', isDark ? 'dark' : 'light');
        });
    }

    if (sidebarPrefToggle) {
        sidebarPrefToggle.checked = settings.state.sidebarCollapsed;
        sidebarPrefToggle.addEventListener('change', (e) => {
            const isCollapsed = (e.target as HTMLInputElement).checked;
            settings.update('sidebarCollapsed', isCollapsed);
            // Force redraw of sidebar if needed, or let the CSS/Manager handle it
            // The Manager applies the body class, which triggers the layout change
        });
    }

    if (animToggle) {
        animToggle.checked = settings.state.animationsEnabled;
        animToggle.addEventListener('change', (e) => {
            const isEnabled = (e.target as HTMLInputElement).checked;
            settings.update('animationsEnabled', isEnabled);
        });
    }
}


console.log('Portfolio initialized');


import { initCursorTrail } from './effects/cursor';

// --- GLOBAL EFFECTS INITIALIZATION ---
function initGlobalEffects() {
    // 1. Inject simple fade transition overlay
    if (!document.querySelector('.page-transition-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        document.body.appendChild(overlay);
    }

    // 2. Initialize Cursor Trail (New Module)
    initCursorTrail();

    // 3. Page Transition Logic - simple fade
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a');

        if (link) {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('http') && !href.startsWith('javascript:')) {
                e.preventDefault();
                const overlay = document.querySelector('.page-transition-overlay');
                overlay?.classList.add('active');
                setTimeout(() => {
                    window.location.href = href;
                }, 350);
            }
        }
    });

    // 4. Inject Home Button on non-index pages
    const path = window.location.pathname;
    const isHomePage = path === '/' || path === '/index.html' || path.endsWith('/index.html');
    if (!isHomePage) {
        const homeBtn = document.createElement('a');
        homeBtn.href = '/index.html';
        homeBtn.className = 'home-btn-global';
        homeBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
        homeBtn.title = 'Back to Home';
        document.body.appendChild(homeBtn);
    }

    // Remove old cursor elements if they exist to avoid conflict
    const oldDot = document.querySelector('.cursor-dot');
    const oldOutline = document.querySelector('.cursor-outline');
    if (oldDot) oldDot.remove();
    if (oldOutline) oldOutline.remove();
}

// Call global effects
initGlobalEffects();




// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-text').forEach(el => {
    observer.observe(el);
});


