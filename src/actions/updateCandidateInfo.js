const { viewCallBackIds } = require('../constants/common');

const handleUpdateCandidateInfo = (app) => async ({ ack, context, logger, body }) => {
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
                callback_id: viewCallBackIds.UPDATE_CANDIDATE_INFO_FORM_SUBMISSION,
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
}

module.exports = handleUpdateCandidateInfo