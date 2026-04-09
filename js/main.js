// Main Page Logic
document.addEventListener('DOMContentLoaded', async () => {
    await loadStats();
    await loadFeaturedTeams();
    await loadTopScorers();
    await loadRecentMatches();
    setupMobileMenu();
    setupEventListeners();
});

async function loadStats() {
    try {
        const [teams, players, matches] = await Promise.all([
            footballAPI.getAllTeams(),
            footballAPI.getAllPlayers(),
            footballAPI.getAllMatches()
        ]);
        
        document.getElementById('totalTeams').textContent = teams.length;
        document.getElementById('totalPlayers').textContent = players.length;
        document.getElementById('totalMatches').textContent = matches.length;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadFeaturedTeams() {
    try {
        const teams = await footballAPI.getAllTeams();
        const featuredTeams = teams.slice(0, 6);
        
        const container = document.getElementById('featuredTeams');
        container.innerHTML = featuredTeams.map(team => createTeamCard(team)).join('');
        
        // Add click handlers
        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('click', () => {
                const teamId = card.dataset.teamId;
                window.location.href = `team-detail.html?id=${teamId}`;
            });
        });
    } catch (error) {
        console.error('Error loading featured teams:', error);
        document.getElementById('featuredTeams').innerHTML = '<div class="error">Failed to load teams</div>';
    }
}

async function loadTopScorers() {
    try {
        const scorers = await footballAPI.getTopScorers(5);
        const container = document.getElementById('topScorers');
        
        container.innerHTML = `
            <div class="scorers-grid">
                ${scorers.map((scorer, index) => `
                    <div class="scorer-card">
                        <div class="scorer-rank">#${index + 1}</div>
                        <div class="scorer-info">
                            <div class="scorer-name">${scorer.name}</div>
                            <div class="scorer-team">${scorer.team_name || 'Unknown Team'}</div>
                        </div>
                        <div class="scorer-goals">
                            <span class="goal-count">${scorer.goals}</span>
                            <span class="goal-label">goals</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Error loading top scorers:', error);
    }
}

async function loadRecentMatches() {
    try {
        const matches = await footballAPI.getRecentMatches(5);
        const container = document.getElementById('recentMatches');
        
        container.innerHTML = matches.map(match => `
            <div class="match-card">
                <div class="match-teams">
                    <div class="team">
                        <div class="team-name-small">${match.home_team_name}</div>
                    </div>
                    <div class="match-score">
                        ${match.home_score} - ${match.away_score}
                    </div>
                    <div class="team">
                        <div class="team-name-small">${match.away_team_name}</div>
                    </div>
                </div>
                <div class="match-info">
                    <div>${new Date(match.date).toLocaleDateString()}</div>
                    <div>${match.competition || 'League Match'}</div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading recent matches:', error);
    }
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

function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

function setupEventListeners() {
    // Live matches button
    const liveMatchesBtn = document.getElementById('liveMatchesBtn');
    if (liveMatchesBtn) {
        liveMatchesBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await loadRecentMatches();
            document.querySelector('.matches-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Navigation links
    document.getElementById('matchesLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'teams.html';
    });
    
    document.getElementById('statsLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'teams.html';
    });
}
