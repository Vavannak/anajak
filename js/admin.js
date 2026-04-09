// Admin Panel Logic
let authToken = localStorage.getItem('adminToken');

// Check authentication
if (!authToken) {
    window.location.href = 'admin-login.html';
}

// DOM Elements
let currentSection = 'dashboard';
let teamsData = [];
let playersData = [];
let matchesData = [];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    setupMenuNavigation();
    setupLogout();
});

function setupMenuNavigation() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(section) {
    currentSection = section;
    
    // Update menu active state
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === section);
    });
    
    // Show/hide sections
    document.querySelectorAll('.admin-section').forEach(sectionEl => {
        sectionEl.classList.toggle('active', sectionEl.id === `${section}Section`);
    });
    
    // Load section data
    switch(section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'teams':
            loadTeamsTable();
            break;
        case 'players':
            loadPlayersTable();
            break;
        case 'matches':
            loadMatchesTable();
            break;
    }
}

async function loadDashboard() {
    try {
        const [teams, players, matches] = await Promise.all([
            footballAPI.getAllTeams(),
            footballAPI.getAllPlayers(),
            footballAPI.getAllMatches()
        ]);
        
        teamsData = teams;
        playersData = players;
        matchesData = matches;
        
        document.getElementById('totalTeams').textContent = teams.length;
        document.getElementById('totalPlayers').textContent = players.length;
        document.getElementById('totalMatches').textContent = matches.length;
        
        // Create activity chart
        createActivityChart(teams, players, matches);
        
        // Load activity log
        loadActivityLog();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function createActivityChart(teams, players, matches) {
    const ctx = document.getElementById('activityChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Teams',
                    data: [teams.length - 2, teams.length - 1, teams.length],
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Players',
                    data: [players.length - 5, players.length - 3, players.length],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#f1f5f9' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    });
}

function loadActivityLog() {
    const logContainer = document.getElementById('activityLog');
    const activities = [
        { action: 'Admin logged in', time: 'Just now', icon: 'fa-sign-in-alt' },
        { action: 'System data loaded', time: '1 minute ago', icon: 'fa-database' },
        { action: 'Dashboard accessed', time: '2 minutes ago', icon: 'fa-chart-line' }
    ];
    
    logContainer.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <i class="fas ${activity.icon}"></i>
            <div class="activity-details">
                <p>${activity.action}</p>
                <small>${activity.time}</small>
            </div>
        </div>
    `).join('');
}

async function loadTeamsTable() {
    try {
        const teams = await footballAPI.getAllTeams();
        const tbody = document.getElementById('teamsTableBody');
        
        tbody.innerHTML = teams.map(team => `
            <tr>
                <td>${team.id}</td>
                <td>${team.name}</td>
                <td>${team.city}</td>
                <td>${team.stadium}</td>
                <td>${team.founded || 'N/A'}</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editTeam(${team.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteTeam(${team.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading teams table:', error);
    }
}

async function loadPlayersTable() {
    try {
        const players = await footballAPI.getAllPlayers();
        const tbody = document.getElementById('playersTableBody');
        
        tbody.innerHTML = players.map(player => `
            <tr>
                <td>${player.id}</td>
                <td>${player.name}</td>
                <td>${player.team_name || 'N/A'}</td>
                <td>${player.position}</td>
                <td>${player.goals}</td>
                <td>${player.assists}</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editPlayer(${player.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deletePlayer(${player.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading players table:', error);
    }
}

async function loadMatchesTable() {
    try {
        const matches = await footballAPI.getAllMatches();
        const tbody = document.getElementById('matchesTableBody');
        
        tbody.innerHTML = matches.map(match => `
            <tr>
                <td>${match.id}</td>
                <td>${match.home_team_name}</td>
                <td>${match.away_team_name}</td>
                <td>${match.home_score} - ${match.away_score}</td>
                <td>${new Date(match.date).toLocaleDateString()}</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editMatch(${match.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteMatch(${match.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading matches table:', error);
    }
}

// Team CRUD Operations
function openTeamModal(team = null) {
    const modal = document.getElementById('teamModal');
    const title = document.getElementById('teamModalTitle');
    
    if (team) {
        title.textContent = 'Edit Team';
        document.getElementById('teamId').value = team.id;
        document.getElementById('teamName').value = team.name;
        document.getElementById('teamCity').value = team.city;
        document.getElementById('teamStadium').value = team.stadium;
        document.getElementById('teamFounded').value = team.founded;
        document.getElementById('teamCoach').value = team.coach;
        document.getElementById('teamLeague').value = team.league;
    } else {
        title.textContent = 'Add Team';
        document.getElementById('teamForm').reset();
        document.getElementById('teamId').value = '';
    }
    
    modal.style.display = 'block';
}

function closeTeamModal() {
    document.getElementById('teamModal').style.display = 'none';
}

document.getElementById('teamForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const team = {
        id: document.getElementById('teamId').value ? parseInt(document.getElementById('teamId').value) : Date.now(),
        name: document.getElementById('teamName').value,
        city: document.getElementById('teamCity').value,
        stadium: document.getElementById('teamStadium').value,
        founded: parseInt(document.getElementById('teamFounded').value),
        coach: document.getElementById('teamCoach').value,
        league: document.getElementById('teamLeague').value
    };
    
    // In production, this would be an API call
    console.log('Saving team:', team);
    
    // Simulate save
    alert('Team saved successfully!');
    closeTeamModal();
    loadTeamsTable();
    loadDashboard();
});

async function editTeam(id) {
    const team = teamsData.find(t => t.id === id);
    if (team) openTeamModal(team);
}

async function deleteTeam(id) {
    if (confirm('Are you sure you want to delete this team?')) {
        // In production, this would be an API call
        console.log('Deleting team:', id);
        alert('Team deleted successfully!');
        loadTeamsTable();
        loadDashboard();
    }
}

// Player CRUD Operations
function openPlayerModal(player = null) {
    // Implementation similar to team modal
    alert('Player modal would open here');
}

async function editPlayer(id) {
    const player = playersData.find(p => p.id === id);
    if (player) openPlayerModal(player);
}

async function deletePlayer(id) {
    if (confirm('Are you sure you want to delete this player?')) {
        console.log('Deleting player:', id);
        alert('Player deleted successfully!');
        loadPlayersTable();
        loadDashboard();
    }
}

// Match CRUD Operations
function openMatchModal(match = null) {
    alert('Match modal would open here');
}

async function editMatch(id) {
    const match = matchesData.find(m => m.id === id);
    if (match) openMatchModal(match);
}

async function deleteMatch(id) {
    if (confirm('Are you sure you want to delete this match?')) {
        console.log('Deleting match:', id);
        alert('Match deleted successfully!');
        loadMatchesTable();
        loadDashboard();
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('adminToken');
            window.location.href = 'admin-login.html';
        });
    }
}

// Modal close handlers
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    });
});

window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};
