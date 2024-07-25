const app = require("../app");
const { actionCallBackIds } = require("../constants/common");
const handleUpdateCandidateInfo = require("./updateCandidateInfo");
const handleInterviewRequest = require("./candidateInterviewRequest");
const handleRescheduleInterviewMeeting = require("./rescheduleInterviewMeeting");

app.action(
    actionCallBackIds.UPDATE_CANDIDATE_INFO,
    handleUpdateCandidateInfo(app)
);
app.action(
    actionCallBackIds.REQUEST_INTERVIEWER_FOR_INTERVIEW,
    handleInterviewRequest(app)
);
app.action(
    actionCallBackIds.RESCHEDULE_INTERVIEW_MEETING,
    handleRescheduleInterviewMeeting(app)
);
