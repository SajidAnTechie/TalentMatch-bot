const { isValidHttpUrl } = require('../utils/url');
const { formatDateToDayMonthDate, convertTo12HourFormat } = require('../utils/date');

const requestCandidateFormSubmission = (app) => async ({ ack, view, payload }) => {
    const data = view.state.values;

    const candidateName =
        data.candidate_name_block_id.candidate_name_input_action.value;
    const recruiteeUrl =
        data.recruitee_url_block_id.recruitee_url_input_action.value;
    const assignees =
        data.assignee_select_block_id.assignee_select_input_action.selected_users;
    const date =
        data.interview_date_block_id.interview_date_input_action.selected_date;
    const time =
        data.interview_time_block_id.interview_time_input_action.selected_time;

    if (!isValidHttpUrl(recruiteeUrl)) {
        await ack({
            response_action: "errors",
            errors: {
                recruitee_url_block_id: "Please provide a valid url.",
            },
        });
        return;
    } else {
        ack();
    }

    const formatedDate = formatDateToDayMonthDate(date);
    const formagtedTime = convertTo12HourFormat(time);

    let usersToMention = "";

    assignees.forEach((userId) => {
        usersToMention += `<@${userId}> `;
    });

    const message =
        `:wave: Hey, <!channel> \n\nRequesting ` +
        usersToMention +
        " " +
        `:bust_in_silhouette: to interview \n\n<${recruiteeUrl}|*${candidateName}*> at ${formagtedTime} on ${formatedDate}`;

    try {
        await app.client.chat.postMessage({
            channel: payload.private_metadata,
            text: message,
            mrkdwn: true,
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = requestCandidateFormSubmission