import { SettingsManager } from '../utils/SettingsManager';

export function initSidebar() {
    const settings = SettingsManager.getInstance();
    const path = window.location.pathname;
    // Handle both /about and /about.html formats for clean URLs
    let page = path.split("/").pop() || "index.html";
    if (!page.includes('.html') && page !== '') {
        page = page + '.html';
    } else if (page === '' || path === '/') {
        page = 'index.html';
    }
    const isCollapsed = settings.state.sidebarCollapsed;

    // Render Sidebar HTML
    // We add an ID to the toggle button for event listening
    const sidebarHTML = `
    <aside class="sidebar ${isCollapsed ? 'collapsed' : ''}">
        <div class="sidebar-header">
            <div class="logo-container">
                 <div class="logo">Direction</div>
                 <button id="sidebar-toggle" class="sidebar-toggle" aria-label="Toggle Sidebar">
                    <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75Zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25H1.75ZM2 7h12v2H2V7Z"></path>
                    </svg>
                 </button>
            </div>
        </div>
        
        <nav class="sidebar-nav">
             ${renderNavLink('about.html', 'About', page)}
             ${renderNavLink('repos.html', 'Repositories', page)}
             ${renderNavLink('games.html', 'Games', page)}
             ${renderNavLink('projects.html', 'Projects', page)}
             ${renderNavLink('notes.html', 'Notes', page)}
             ${renderNavLink('contact.html', 'Contact', page)}
             ${renderNavLink('settings.html', 'Settings', page)}
        </nav>

        <div class="sidebar-section">
            <div class="section-header-row">
                <span class="section-header">Pinned</span>
                <a href="repos.html" class="section-link">View all</a>
            </div>
            <div class="repo-list" id="github-repos">
                <div class="repo-skeleton"></div>
                <div class="repo-skeleton"></div>
                <div class="repo-skeleton"></div>
            </div>
        </div>
    </aside>
  `;

    const container = document.getElementById('sidebar-container');
    if (container) {
        container.innerHTML = sidebarHTML;

        // Attach Event Listeners for sidebar toggle
        const toggleBtn = document.getElementById('sidebar-toggle');
        const sidebar = container.querySelector('.sidebar');

        toggleBtn?.addEventListener('click', () => {
            const newState = !settings.state.sidebarCollapsed;
            settings.update('sidebarCollapsed', newState);

            // Update UI immediately
            sidebar?.classList.toggle('collapsed');
            // Body class is handled by SettingsManager applySettings()
        });

        // Fetch GitHub repos
        fetchGitHubRepos();
    }

}

function renderNavLink(href: string, label: string, currentPage: string) {
    const isActive = currentPage === href || (href === 'index.html' && currentPage === '');
    const activeClass = isActive ? 'active' : '';

    // Map icons (simplified for brevity, normally separate map)
    const icons: Record<string, string> = {
        'Home': '<path d="M8.138.056c-.073-.09-.168-.155-.276-.196a.7.7 0 0 0-.724 0c-.108.041-.203.106-.276.196L.834 8.02A.724.724 0 0 0 1.5 9h1v5.25c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75V10.5h1v3.75c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75V9h1a.724.724 0 0 0 .666-.98L8.139.056Z"></path>',
        'About': '<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm6.5 2.75A.75.75 0 1 1 8 12a.75.75 0 0 1 0-1.5ZM7 4.25a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0v-4Z"></path>',
        'Repositories': '<path d="M4.536 2.308a3.75 3.75 0 0 1 6.928 0 3.75 3.75 0 0 1 .15 7.425.75.75 0 0 1-1.494.133A2.25 2.25 0 0 0 9 7.75h-.75V10h1.75a.75.75 0 0 1 0 1.5H8.25v2.247a.75.75 0 0 1-1.5 0V11.5H5a.75.75 0 0 1 0-1.5h1.75V7.75h-.75a2.25 2.25 0 0 0-1.12 4.116.75.75 0 0 1-1.495-.133 3.75 3.75 0 0 1 .15-7.425ZM8 1.5a2.25 2.25 0 1 0 0 4.5A2.25 2.25 0 0 0 8 1.5Z"></path>',
        'Games': '<path d="M9.5 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"></path><path d="M2.5 5a2.5 2.5 0 0 1 2.5-2.5h6a2.5 2.5 0 0 1 2.5 2.5v1.25a.75.75 0 0 1-.75.75h-1 v3a2.5 2.5 0 0 1-2.5 2.5H7.5A2.5 2.5 0 0 1 5 10v-3H4.25a.75.75 0 0 1-.75-.75V5Z"></path>',
        'Projects': '<path d="M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25ZM3.75 4h8.5a.75.75 0 0 1 0 1.5h-8.5a.75.75 0 0 1 0-1.5ZM3 7.75A.75.75 0 0 1 3.75 7h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 7.75Zm.75 3.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z"></path>',
        'Notes': '<path d="M0 3.75C0 2.784.784 2 1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25Zm1.75-.25a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25ZM3.5 6.25a.75.75 0 0 1 .75-.75h7a.75.75 0 0 1 0 1.5h-7a.75.75 0 0 1-.75-.75Zm.75 2.25h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1 0-1.5Z"></path>',
        'Contact': '<path d="M1.75 1h12.5c.966 0 1.75.784 1.75 1.75v9.5A1.75 1.75 0 0 1 14.25 14H8.061l-2.574 2.573A1.458 1.458 0 0 1 3 15.543V14H1.75A1.75 1.75 0 0 1 0 12.25v-9.5C0 1.784.784 1 1.75 1ZM1.5 2.75v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.75.75 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25Z"></path>',
        'Settings': '<path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.05.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a9.116 9.116 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.17.645-.716 1.195-1.46 1.26a8.037 8.037 0 0 1-1.402 0c-.744-.065-1.29-.615-1.46-1.26l-.288-1.106c-.018-.066-.079-.158-.212-.224a8.96 8.96 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.364-1.891l.814-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.814-.806c-.475-.469-.679-1.216-.364-1.891.198-.426.435-.833.704-1.218.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.3.031A8.208 8.208 0 0 1 8 0Zm0 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"></path>'
    };

    return `
    <a href="${href}" class="nav-item ${activeClass}">
        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor">
            ${icons[label] || ''}
        </svg>
        <span class="nav-label">${label}</span>
    </a>
    `;
}

async function fetchGitHubRepos() {
    const repoList = document.getElementById('github-repos');
    if (!repoList) return;

    try {
        const response = await fetch('https://api.github.com/users/AM4517UMOR4NG/repos?per_page=100');
        const repos = await response.json();

        if (Array.isArray(repos) && repos.length > 0) {
            // Sort by stars (descending)
            const sortedRepos = repos.sort((a: { stargazers_count: number }, b: { stargazers_count: number }) => 
                b.stargazers_count - a.stargazers_count
            ).slice(0, 5);

            repoList.innerHTML = sortedRepos.map((repo: { name: string; html_url: string; stargazers_count: number }) => `
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-item">
                    <svg class="repo-icon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                    </svg>
                    <span class="repo-name">${repo.name}</span>
                </a>
            `).join('');
        } else {
            repoList.innerHTML = '<span class="repo-loading">No repos found</span>';
        }
    } catch (error) {
        repoList.innerHTML = '<span class="repo-loading">Failed to load</span>';
    }
}
