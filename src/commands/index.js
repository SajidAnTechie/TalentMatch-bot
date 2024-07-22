const app = require('../app');
const handleCandidateCommand = require('./candidate');

app.command('/candidate', handleCandidateCommand(app))