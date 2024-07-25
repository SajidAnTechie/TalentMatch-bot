// Commands
const commands = {
    CANDIDATE: "/candidate",
};

//views
const viewCallBackIds = {
    ADD_CANDIDATE_FORM_SUBMISSION: "add_candidate_form_submission",
    UPDATE_CANDIDATE_INFO_FORM_SUBMISSION:
        "update_candidate_info_form_submission",
    REQUEST_INTERVIEWER_FOR_INTERVIEW_FORM_SUBMISSION:
        "request_interviewer_for_interview_form_submission",
    RESCHEDULE_INTERVIEW_FORM_SUBMISSION: "reschedule_interview_form_submission",
};

//actions
const actionCallBackIds = {
    UPDATE_CANDIDATE_INFO: "update_candidate_info",
    REQUEST_INTERVIEWER_FOR_INTERVIEW: "request_interviewer_for_interview",
    RESCHEDULE_INTERVIEW_MEETING: "reschedule_interview_meeting",
};

module.exports = {
    commands,
    viewCallBackIds,
    actionCallBackIds,
};
