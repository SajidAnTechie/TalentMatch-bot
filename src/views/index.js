const app = require("../app");
const { viewCallBackIds } = require("../constants/common");
const addCandidateFormSubmission = require("./addCandidateFormSubmission");
const updateCandidateFormSubmission = require("./updateCandidateInfoFormSubmission");
const rescheduleInterviewFormSubmission = require("./rescheduleInterviewFormSubmission");
const candidateInterviewRequestFormSubmission = require("./candidateInterviewRequestFormSubmission");

app.view(
    viewCallBackIds.ADD_CANDIDATE_FORM_SUBMISSION,
    addCandidateFormSubmission(app)
);
app.view(
    viewCallBackIds.UPDATE_CANDIDATE_INFO_FORM_SUBMISSION,
    updateCandidateFormSubmission(app)
);
app.view(
    viewCallBackIds.REQUEST_INTERVIEWER_FOR_INTERVIEW_FORM_SUBMISSION,
    candidateInterviewRequestFormSubmission(app)
);
app.view(
    viewCallBackIds.RESCHEDULE_INTERVIEW_FORM_SUBMISSION,
    rescheduleInterviewFormSubmission(app)
);
