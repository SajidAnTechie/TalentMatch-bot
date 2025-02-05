const { isValidHttpUrl } = require("../utils/url");
const { actionCallBackIds } = require("../constants/common");

const addCandidateFormSubmission =
    (app) =>
        async ({ ack, view, payload }) => {
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
                                    action_id: actionCallBackIds.UPDATE_CANDIDATE_INFO,
                                },
                                {
                                    type: "button",
                                    text: {
                                        type: "plain_text",
                                        emoji: true,
                                        text: "Request for interview",
                                    },
                                    style: "primary",
                                    value: "request",
                                    action_id: actionCallBackIds.REQUEST_INTERVIEWER_FOR_INTERVIEW,
                                },
                                {
                                    type: "button",
                                    text: {
                                        type: "plain_text",
                                        emoji: true,
                                        text: "Schedule interview",
                                    },
                                    style: "primary",
                                    value: "reschedule",
                                    action_id: actionCallBackIds.RESCHEDULE_INTERVIEW_MEETING,
                                },
                            ],
                        },
                    ],
                });
            } catch (error) {
                console.error(error);
            }
        };

module.exports = addCandidateFormSubmission;
