const {
    formatDateToDayMonthDate,
    convertTo12HourFormat,
} = require("../utils/date");

const rescheduleInterviewFormSubmission =
    (app) =>
        async ({ ack, view, payload, body }) => {
            ack();

            const data = view.state.values;

            const date =
                data.interview_date_block_id.interview_date_input_action.selected_date;
            const time =
                data.interview_time_block_id.interview_time_input_action.selected_time;

            const userId = body.user.id;

            const formatedDate = formatDateToDayMonthDate(date);
            const formagtedTime = convertTo12HourFormat(time);

            const message = `:wave: Hey, <!channel> \n\nInterview reschedule by the <@${userId}> at ${formagtedTime} on ${formatedDate}`;

            try {
                await app.client.chat.postMessage({
                    channel: payload.private_metadata,
                    text: message,
                    mrkdwn: true,
                });
            } catch (error) {
                console.log(error);
            }
        };

module.exports = rescheduleInterviewFormSubmission;
