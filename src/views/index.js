const app = require('../app');
const addCandidateFormSubmission = require('./addCandidateForm');
const requestCandidateFormSubmission = require('./requestCandidateForm');
const rescheduleInterviewFormSubmission = require('./rescheduleInterviewForm');
const updateCandidateFormSubmission = require('./updateCandidateForm');

app.view('add_candidate_form_submission', addCandidateFormSubmission(app));
app.view('update_candidate_form_submission', updateCandidateFormSubmission(app));
app.view('request_candidate_form_submission', requestCandidateFormSubmission(app));
app.view('reschedule_interview_form_submission', rescheduleInterviewFormSubmission(app));