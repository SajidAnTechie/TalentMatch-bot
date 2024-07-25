const { getCurrentDateAndTime } = require("../utils/date");
const { viewCallBackIds } = require("../constants/common");

const handleInterviewRequest =
    (app) =>
        async ({ ack, context, logger, body }) => {
            ack();

            try {
                const result = await app.client.users.info({
                    user: body.user.id,
                });
                const clientTimeZone = result.user.tz;
                const { date } = getCurrentDateAndTime(clientTimeZone);
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
                        callback_id:
                            viewCallBackIds.REQUEST_INTERVIEWER_FOR_INTERVIEW_FORM_SUBMISSION,
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
        };

module.exports = handleInterviewRequest;
