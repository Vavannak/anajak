// Teams Page Logic
let allTeams = [];
let currentFilter = 'all';
let currentPage = 1;
const itemsPerPage = 12;

document.addEventListener('DOMContentLoaded', async () => {
    await loadAllTeams();
    setupSearchAndFilters();
    setupPagination();
});

async function loadAllTeams() {
    try {
        allTeams = await footballAPI.getAllTeams();
        displayTeams();
    } catch (error) {
        console.error('Error loading teams:', error);
        document.getElementById('allTeams').innerHTML = '<div class="error">Failed to load teams</div>';
    }
}

function displayTeams() {
    let filteredTeams = allTeams;
    
    // Apply filter
    if (currentFilter !== 'all') {
        filteredTeams = allTeams.filter(team => team.league === currentFilter);
    }
    
    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTeams = filteredTeams.slice(startIndex, endIndex);
    
    // Display teams
    const container = document.getElementById('allTeams');
    container.innerHTML = paginatedTeams.map(team => createTeamCard(team)).join('');
    
    // Add click handlers
    document.querySelectorAll('.team-card').forEach(card => {
        card.addEventListener('click', () => {
            const teamId = card.dataset.teamId;
            window.location.href = `team-detail.html?id=${teamId}`;
        });
    });
    
    // Update pagination
    updatePaginationControls(filteredTeams.length);
}

function setupSearchAndFilters() {
    // Search functionality
    const searchInput = document.getElementById('searchTeams');
    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value;
        if (query.length > 2) {
            allTeams = await footballAPI.searchTeams(query);
        } else if (query.length === 0) {
            allTeams = await footballAPI.getAllTeams();
        }
        currentPage = 1;
        displayTeams();
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            currentPage = 1;
            displayTeams();
        });
    });
}

function setupPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-btn')) {
            const page = parseInt(e.target.dataset.page);
            if (!isNaN(page)) {
                currentPage = page;
                displayTeams();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });
}

function updatePaginationControls(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>←</button>`;
    
    // Page numbers
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        html += `<button class="page-btn ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    if (totalPages > 5) {
        html += '<span>...</span>';
        html += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    // Next button
    html += `<button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>→</button>`;
    
    paginationContainer.innerHTML = html;
}

function createTeamCard(team) {
    return `
        <div class="team-card" data-team-id="${team.id}">
            <div class="team-banner">
                <div class="team-logo">
                    <i class="fas fa-shield-alt"></i>
                </div>
            </div>
            <div class="team-info">
                <div class="team-name">${team.name}</div>
                <div class="team-details">
                    <i class="fas fa-map-marker-alt"></i> ${team.city}<br>
                    <i class="fas fa-stadium"></i> ${team.stadium}
                </div>
                <div class="team-stats">
                    <div class="stat-item">
                        <div class="stat-value">${team.founded || 'N/A'}</div>
                        <div class="stat-label">Founded</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${team.player_count || 0}</div>
                        <div class="stat-label">Players</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
