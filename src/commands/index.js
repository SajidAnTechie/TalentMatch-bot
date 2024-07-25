const app = require("../app");
const { commands } = require("../constants/common");
const handleCandidateCommand = require("./candidate");

app.command(commands.CANDIDATE, handleCandidateCommand(app));
