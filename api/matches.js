// Vercel Serverless Function - GET /api/matches
const database = require('../data/database.json');

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const matchesWithTeams = database.matches.map(match => {
        const homeTeam = database.teams.find(t => t.id === match.home_team_id);
        const awayTeam = database.teams.find(t => t.id === match.away_team_id);
        return {
            ...match,
            home_team_name: homeTeam?.name,
            away_team_name: awayTeam?.name
        };
    });
    
    res.status(200).json(matchesWithTeams);
};
