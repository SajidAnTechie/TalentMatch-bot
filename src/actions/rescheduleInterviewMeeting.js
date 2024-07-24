const { getCurrentDateAndTime } = require("../utils/date");
const { viewCallBackIds } = require('../constants/common');

const handleRescheduleInterviewMeeting = (app) => async ({ ack, context, logger, body }) => {
    ack();

    try {
        const result = await app.client.users.info({
            user: body.user.id,
        });
        const clientTimeZone = result.user.tz;
        const { date } = getCurrentDateAndTime(clientTimeZone);

        await app.client.views.open({
            token: context.botToken,
            trigger_id: body.trigger_id,
            view: {
                type: "modal",
                title: {
                    type: "plain_text",
                    text: "Request candidate",
                },
                callback_id: viewCallBackIds.RESCHEDULE_INTERVIEW_FORM_SUBMISSION,
                private_metadata: body.channel.id,
                blocks: [
                    {
                        type: "input",
                        block_id: "interview_date_block_id",
                        element: {
                            type: "datepicker",
                            initial_date: date,
                            placeholder: {
                                type: "plain_text",
                                text: "Select a date",
                                emoji: true,
                            },
                            action_id: "interview_date_input_action",
                        },
                        label: {
                            type: "plain_text",
                            text: "Date",
                            emoji: true,
                        },
                    },
                    {
                        type: "input",
                        block_id: "interview_time_block_id",
                        element: {
                            type: "timepicker",
                            placeholder: {
                                type: "plain_text",
                                text: "Select time",
                                emoji: true,
                            },
                            action_id: "interview_time_input_action",
                            timezone: clientTimeZone,
                        },
                        label: {
                            type: "plain_text",
                            text: "Time",
                            emoji: true,
                        },
                    },
                ],
                submit: {
                    type: "plain_text",
                    text: "save",
                },
            },
        });
    } catch (error) {
        logger.error(error);
    }
}

module.exports = handleRescheduleInterviewMeeting