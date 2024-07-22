const handleCandidateCommand = (app) => async ({ ack, payload, context, logger }) => {
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
}

module.exports = handleCandidateCommand;