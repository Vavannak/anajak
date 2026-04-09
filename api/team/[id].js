// Vercel Serverless Function - GET /api/team/:id
const database = require('../../data/database.json');

module.exports = (req, res) => {
    const { id } = req.query;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const teamId = parseInt(id);
    const team = database.teams.find(t => t.id === teamId);
    
    if (!team) {
        return res.status(404).json({ error: 'Team not found' });
    }
    
    const players = database.players.filter(p => p.team_id === teamId);
    const matches = database.matches.filter(m => m.home_team_id === teamId || m.away_team_id === teamId)
        .map(match => {
            const homeTeam = database.teams.find(t => t.id === match.home_team_id);
            const awayTeam = database.teams.find(t => t.id === match.away_team_id);
            return {
                ...match,
                home_team_name: homeTeam?.name,
                away_team_name: awayTeam?.name
            };
        });
    
    res.status(200).json({
        ...team,
        players,
        matches
    });
};
