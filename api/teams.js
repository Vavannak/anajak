// Vercel Serverless Function - GET /api/teams
const database = require('../data/database.json');

module.exports = (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const teamsWithStats = database.teams.map(team => ({
            ...team,
            player_count: database.players.filter(p => p.team_id === team.id).length,
            matches_count: database.matches.filter(m => m.home_team_id === team.id || m.away_team_id === team.id).length
        }));
        
        res.status(200).json(teamsWithStats);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
