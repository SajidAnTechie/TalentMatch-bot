const { App } = require("@slack/bolt");
const { getCurrentDateAndTime,
    formatDateToDayMonthDate,
    convertTo12HourFormat
} = require('./utils/date');
const { isValidHttpUrl } = require("./utils/url");
const dotenv = require("dotenv");
dotenv.config()

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.command("/candidate", async ({ ack, payload, context, logger }) => {
    ack();

    try {
        await app.client.views.open({
            token: context.botToken,
            trigger_id: payload.trigger_id,
            view: {
                type: "modal",
                title: {
                    type: "plain_text",
                    text: "Add candidate",
                },
                callback_id: "add_candidate_form_submission",
                private_metadata: payload.channel_id,
                blocks: [
                    {
                        type: "input",
                        block_id: "candidate_name_block_id",
                        element: {
                            type: "plain_text_input",
                            action_id: "candidate_name_input_action",
                            placeholder: {
                                type: "plain_text",
                                text: "Write a candidate name",
                            },
                        },
                        label: {
                            type: "plain_text",
                            text: "Candidate Name",
                            emoji: true,
                        },
                        hint: {
                            type: "plain_text",
                            text: "Ram",
                        },
                    },
                    {
                        type: "input",
                        block_id: "recruitee_url_block_id",
                        element: {
                            type: "url_text_input",
                            action_id: "recruitee_url_input_action",
                            placeholder: {
                                type: "plain_text",
                                text: "https://three-mulberry-fragrance.glitch.me",
                            },
                        },
                        label: {
                            type: "plain_text",
                            text: "Recruitee url",
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
    } catch (err) {
        logger.error(err);
    }
});

// Add candidate form submission handler
app.view("add_candidate_form_submission", async ({ ack, view, payload }) => {
    const data = view.state.values;

    const candidateName =
        data.candidate_name_block_id.candidate_name_input_action.value;
    const recruiteeUrl =
        data.recruitee_url_block_id.recruitee_url_input_action.value;

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

    const message = `:wave: Hey, <!channel> \n\nFound a candidate :star2: <${recruiteeUrl}|*${candidateName}*> :white_check_mark: who is ready for an interview.`;

    try {
        await app.client.chat.postMessage({
            channel: payload.private_metadata,
            text: message,
            mrkdwn: true,
            metadata: {
                event_type: "candidate_state",
                event_payload: {
                    candidateDetails: {
                        candidateName: candidateName,
                        recruiteeUrl: recruiteeUrl,
                    },
                },
            },
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: message,
                    },
                },
                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                emoji: true,
                                text: "Edit",
                            },
                            style: "primary",
                            value: "edit",
                            action_id: "candidate_edit",
                        },
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                emoji: true,
                                text: "Request",
                            },
                            style: "primary",
                            value: "request",
                            action_id: "candidate_request",
                        },
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                emoji: true,
                                text: "Schedule",
                            },
                            style: "primary",
                            value: "reschedule",
                            action_id: "reschedule_interview_meeting",
                        },
                    ],
                },
            ],
        });
    } catch (error) {
        console.error(error);
    }
});

app.action("candidate_request", async ({ ack, context, logger, body }) => {
    ack();

    try {
        const result = await app.client.users.info({
            user: body.user.id,
        });
        const clientTimeZone = result.user.tz;
        const { date, time } = getCurrentDateAndTime(clientTimeZone);
        const {
            event_payload: { candidateDetails },
        } = body.message.metadata;
        const { candidateName, recruiteeUrl } = candidateDetails;

        await app.client.views.open({
            token: context.botToken,
            trigger_id: body.trigger_id,
            view: {
                type: "modal",
                title: {
                    type: "plain_text",
                    text: "Request candidate",
                },
                callback_id: "request_candidate_form_submission",
                private_metadata: body.channel.id,
                blocks: [
                    {
                        type: "input",
                        block_id: "candidate_name_block_id",
                        element: {
                            type: "plain_text_input",
                            action_id: "candidate_name_input_action",
                            placeholder: {
                                type: "plain_text",
                                text: "Write a candidate name",
                            },
                            initial_value: candidateName,
                        },
                        label: {
                            type: "plain_text",
                            text: "Candidate Name",
                            emoji: true,
                        },
                        hint: {
                            type: "plain_text",
                            text: "Ram",
                        },
                    },
                    {
                        type: "input",
                        block_id: "recruitee_url_block_id",
                        element: {
                            type: "url_text_input",
                            action_id: "recruitee_url_input_action",
                            placeholder: {
                                type: "plain_text",
                                text: "https://three-mulberry-fragrance.glitch.me",
                            },
                            initial_value: recruiteeUrl,
                        },
                        label: {
                            type: "plain_text",
                            text: "Recruitee url",
                            emoji: true,
                        },
                    },
                    {
                        type: "input",
                        block_id: "assignee_select_block_id",
                        element: {
                            type: "multi_users_select",
                            placeholder: {
                                type: "plain_text",
                                text: "Select Assignee",
                                emoji: true,
                            },
                            action_id: "assignee_select_input_action",
                        },
                        label: {
                            type: "plain_text",
                            text: "Assignee",
                            emoji: true,
                        },
                    },
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
                            initial_time: time,
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
});

app.view(
    "request_candidate_form_submission",
    async ({ ack, view, payload }) => {
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
);

app.action(
    "reschedule_interview_meeting",
    async ({ ack, context, logger, body }) => {
        ack();

        try {
            const result = await app.client.users.info({
                user: body.user.id,
            });
            const clientTimeZone = result.user.tz;
            const { date, time } = getCurrentDateAndTime(clientTimeZone);

            await app.client.views.open({
                token: context.botToken,
                trigger_id: body.trigger_id,
                view: {
                    type: "modal",
                    title: {
                        type: "plain_text",
                        text: "Request candidate",
                    },
                    callback_id: "reschedule_interview_form_submission",
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
                                initial_time: time,
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
);

app.view(
    "reschedule_interview_form_submission",
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
    }
);

app.action("candidate_edit", async ({ ack, context, logger, body }) => {
    ack();

    const {
        event_payload: { candidateDetails },
    } = body.message.metadata;
    const { candidateName, recruiteeUrl } = candidateDetails;

    try {
        await app.client.views.open({
            token: context.botToken,
            trigger_id: body.trigger_id,
            view: {
                type: "modal",
                title: {
                    type: "plain_text",
                    text: "Update candidate",
                },
                callback_id: "update_candidate_view_form",
                private_metadata: `${body.channel.id}-${body.message.ts}`,
                blocks: [
                    {
                        type: "input",
                        block_id: "candidate_name_block_id",
                        element: {
                            type: "plain_text_input",
                            action_id: "candidate_name_input_action",
                            placeholder: {
                                type: "plain_text",
                                text: "Write a candidate name",
                            },
                            initial_value: candidateName,
                        },
                        label: {
                            type: "plain_text",
                            text: "Candidate Name",
                            emoji: true,
                        },
                    },
                    {
                        type: "input",
                        block_id: "recruitee_url_block_id",
                        element: {
                            type: "url_text_input",
                            action_id: "recruitee_url_input_action",
                            placeholder: {
                                type: "plain_text",
                                text: "https://three-mulberry-fragrance.glitch.me",
                            },
                            initial_value: recruiteeUrl,
                        },
                        label: {
                            type: "plain_text",
                            text: "Recruitee url",
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
    } catch (err) {
        logger.error(err);
    }
});

app.view("update_candidate_view_form", async ({ ack, view, payload }) => {
    const data = view.state.values;

    const candidateName =
        data.candidate_name_block_id.candidate_name_input_action.value;
    const recruiteeUrl =
        data.recruitee_url_block_id.recruitee_url_input_action.value;

    const metaData = payload.private_metadata.split("-");
    const channelId = metaData[0];
    const messageTS = metaData[1];

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

    const message = `:wave: Hey, <!channel> \n\nFound a candidate :star2: <${recruiteeUrl}|*${candidateName}*> :white_check_mark: who is ready for an interview.`;

    try {
        await app.client.chat.update({
            channel: channelId,
            ts: messageTS,
            text: message,
            mrkdwn: true,
            metadata: {
                event_type: "candidate_state",
                event_payload: {
                    candidateDetails: {
                        candidateName: candidateName,
                        recruiteeUrl: recruiteeUrl,
                    },
                },
            },
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: message,
                    },
                },
                {
                    type: "actions",
                    elements: [
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                emoji: true,
                                text: "Edit",
                            },
                            style: "primary",
                            value: "edit",
                            action_id: "candidate_edit",
                        },
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                emoji: true,
                                text: "Request",
                            },
                            style: "primary",
                            value: "request",
                            action_id: "candidate_request",
                        },
                        {
                            type: "button",
                            text: {
                                type: "plain_text",
                                emoji: true,
                                text: "Schedule",
                            },
                            style: "primary",
                            value: "reschedule",
                            action_id: "reschedule_interview_meeting",
                        },
                    ],
                },
            ],
        });
    } catch (error) {
        logger.error(error);
    }
});

(async () => {
    // Start your app
    const port = process.env.PORT || 3000
    await app.start(port);

    console.log(`⚡️ Bolt app is running at port ${port}`);
})();
