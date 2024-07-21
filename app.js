// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// All the room in the world for your code

app.event("app_home_opened", async ({ ack, event, client, context }) => {
  ack();
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await client.views.publish({
      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view object that appears in the app home*/
      view: {
        type: "home",
        callback_id: "home_view",

        /* body of the view */
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Welcome to your _App's Home tab_* :tada:",
            },
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "This button won't do much for now but you can set up a listener for it using the `actions()` method and passing its unique `action_id`. See an example in the `examples` folder within your Bolt app.",
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Click me!",
                },
              },
            ],
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
});

app.command('/helloworld', async ({ ack, payload, context }) => {
  // Acknowledge the command request
  ack();

  try {
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: payload.channel_id,
      // Include a button in the message (or whatever blocks you want!)
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Go ahead. Click it.'
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Click me!'
            },
            action_id: 'button_abc1'
          }
        }
      ],
      // Text in the notification
      text: 'Message from Test App'
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

// Listen for a button invocation with action_id `button_abc`
// You must set up a Request URL under Interactive Components on your app configuration page
app.action('button_abc1', async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();
  console.log("channel id", body.channel.id)

  try {
    // Update the message
    const result = await app.client.chat.update({
      token: context.botToken,
      // ts of message to update
      ts: body.message.ts,
      // Channel of message
      channel: body.channel.id,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*The button was clicked!*'
          }
        }
      ],
      text: 'Message from Test App'
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

app.command('/openmodal', async ({ ack, payload, context }) => {
  // Acknowledge the command request
  ack();

  try {
    const result = await app.client.views.open({
      token: context.botToken,
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: payload.trigger_id,
      // View payload
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'view_1',
        title: {
          type: 'plain_text',
          text: 'Modal title'
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Welcome to a modal with _blocks_'
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Click me!'
              },
              action_id: 'button_abc'
            }
          },
          {
            type: 'input',
            block_id: 'test_input',
            label: {
              type: 'plain_text',
              text: 'What are your hopes and dreams?'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'dreamy_input',
              multiline: true
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit'
        }
      }
    });
    console.log("Result", result);
  }
  catch (error) {
    console.error(error);
  }
});

// Listen for a button invocation with action_id `button_abc` (assume it's inside of a modal)
// You must set up a Request URL under Interactive Components on your app configuration page
app.action('button_abc', async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();

  try {
    const result = await app.client.views.update({
      token: context.botToken,
      // Pass the view_id
      view_id: body.view.id,
      // View payload with updated blocks
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'view_1',
        title: {
          type: 'plain_text',
          text: 'Updated modal'
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: 'You updated the modal!'
            }
          },
          {
            type: 'image',
            image_url: 'https://media.giphy.com/media/SVZGEcYt7brkFUyU90/giphy.gif',
            alt_text: 'Yay! The modal was updated'
          }
        ]
      }
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

app.view('view_1', async ({ ack, body, view, context }) => {
  // Acknowledge the view_submission event
  ack();
  console.log("Body", body)

  // Do whatever you want with the input data - here we're saving it to a DB then sending the user a verifcation of their submission

  // Assume there's an input block with `test_input` as the block_id and `dreamy_input` as the action_id
  const val = view['state']['values']['test_input']['dreamy_input'].value;
  const user = body['user']['id'];

  // You'll probably want to store these values somewhere
  console.log("Value", val);
  console.log("User", user);
  const message = `You have typed ${val}`

  try {
    await app.client.chat.postMessage({
      channel: user,
      text: message
    });
  }
  catch (error) {
    console.error(error);
  }
});


app.shortcut('open_modal', async ({ ack, payload, context }) => {
  // Acknowledge the command request
  ack();

  try {
    const result = await app.client.views.open({
      token: context.botToken,
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: payload.trigger_id,
      // View payload
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'view_1',
        title: {
          type: 'plain_text',
          text: 'Modal title'
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Welcome to a modal with _blocks_'
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Click me!'
              },
              action_id: 'button_abc'
            }
          },
          {
            type: 'input',
            block_id: 'test_input',
            label: {
              type: 'plain_text',
              text: 'What are your hopes and dreams?'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'dreamy_input',
              multiline: true
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit'
        }
      }
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

app.action(
  { callback_id: "candidate_actions" },
  async ({ body, ack, context }) => {
    ack();

    const action = body.actions[0];
    const user = body.user.id;
    const channelId = body.channel.id;

    if (action.value === "edit") {
      // Handle the "Edit" action
      try {
        await app.client.chat.postEphemeral({
          token: context.botToken,
          channel: channelId,
          user: user,
          text: 'You clicked "Edit". Here, you can implement the logic to edit the candidate details.',
        });
      } catch (error) {
        console.error(error);
      }
    } else if (action.value === "reschedule") {
      // Handle the "Reschedule" action
      try {
        await app.client.chat.postEphemeral({
          token: context.botToken,
          channel: channelId,
          user: user,
          text: 'You clicked "Reschedule". Here, you can implement the logic to reschedule the interview.',
        });
      } catch (error) {
        console.error(error);
      }
    } else if (action.value === "request") {
      // Handle the "Reschedule" action
      try {
        await app.client.chat.postEphemeral({
          token: context.botToken,
          channel: channelId,
          user: user,
          text: 'You clicked "Request". Here, you can implement the logic to Request the interview.',
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
);



(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
