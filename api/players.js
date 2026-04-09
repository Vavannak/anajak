// Vercel Serverless Function - GET /api/players
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
    
    const playersWithTeams = database.players.map(player => {
        const team = database.teams.find(t => t.id === player.team_id);
        return {
            ...player,
            team_name: team?.name
        };
    });
    
    res.status(200).json(playersWithTeams);
};
