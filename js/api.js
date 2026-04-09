// API Configuration
const API_BASE_URL = window.location.origin;
const API_ENDPOINTS = {
    teams: '/api/teams',
    team: (id) => `/api/team/${id}`,
    players: '/api/players',
    matches: '/api/matches'
};

// API Service
class FootballAPI {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }
    
    async fetchWithCache(url) {
        const cached = this.cache.get(url);
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            return cached.data;
        }
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            this.cache.set(url, { data, timestamp: Date.now() });
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    async getAllTeams() {
        return this.fetchWithCache(`${API_BASE_URL}${API_ENDPOINTS.teams}`);
    }
    
    async getTeamById(id) {
        return this.fetchWithCache(`${API_BASE_URL}${API_ENDPOINTS.team(id)}`);
    }
    
    async getAllPlayers() {
        return this.fetchWithCache(`${API_BASE_URL}${API_ENDPOINTS.players}`);
    }
    
    async getAllMatches() {
        return this.fetchWithCache(`${API_BASE_URL}${API_ENDPOINTS.matches}`);
    }
    
    async searchTeams(query) {
        const teams = await this.getAllTeams();
        return teams.filter(team => 
            team.name.toLowerCase().includes(query.toLowerCase()) ||
            team.city.toLowerCase().includes(query.toLowerCase()) ||
            team.stadium.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    async getTopScorers(limit = 10) {
        const players = await this.getAllPlayers();
        return players
            .sort((a, b) => b.goals - a.goals)
            .slice(0, limit);
    }
    
    async getRecentMatches(limit = 10) {
        const matches = await this.getAllMatches();
        return matches
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }
}

const footballAPI = new FootballAPI();
