const app = require("../app");
const handleUpdateCandidate = require("./updateCadidate");
const handleCandidateRequest = require("./candidateRequest");
const handleRescheduleInterviewMeeting = require("./rescheduleInterviewMeeting");

app.action('update_candidate', handleUpdateCandidate(app));
app.action('candidate_request', handleCandidateRequest(app));
app.action('reschedule_interview_meeting', handleRescheduleInterviewMeeting(app));