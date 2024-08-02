# TalentMatch Bot

TalentMatch Bot is a Slack bot designed to streamline the candidate interview process by allowing users to easily manage and schedule interviews within Slack.

## Features

1. **Candidate Request Command**

   - The bot receives requests from the `/candidate` command.
   - A modal with form will pop-up and users can input candidate information to initiate the process.
   - Example: `/candidate`
     ![Candidate Request Form](https://github.com/user-attachments/assets/d9d36ad0-0de8-4d17-92b4-30230d7d0a89)

2. **Candidate Notification**

   - The bot notifies the channel when we submit the above form.
     ![Candidate Found](https://github.com/user-attachments/assets/2bfc14a3-c3c3-4c11-be69-236f8c2b657e)

3. **Candidate Management**

   - Provides options to edit, request interview, and schedule interview for the candidate.
   - Example: Options include "Edit," "Request for interview," and "Schedule interview."

4. **Candidate Profile**

   - Displays the candidate's profile including name, and resume link.
   - Example: "SAJID ANSARI" with a link to the resume.

5. **Edit Profile**

   - Allow users to edit candidate profile
     ![Edit](https://github.com/user-attachments/assets/81c1f7ed-7dae-416b-9e92-43db6c03e27d)

6. **Request For Interview**

   - Allow users to request candidate for interview
     ![Request For Interview](https://github.com/user-attachments/assets/1a0fe28e-b689-4bc0-97aa-0b55af47bc42)

7. **Interview Scheduling**
   - Allows users to request an interview with the candidate.
     ![Schedule Interview](https://github.com/user-attachments/assets/23dcb362-2e56-4087-9715-9dc6e057455c)

## Installation

To install and set up the TalentMatch Bot, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/SajidAnTechie/TalentMatch-bot.git
   cd TalentMatch-bot
   ```

2. Install the necessary dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```env
   SLACK_BOT_TOKEN=your-slack-bot-token
   SLACK_SIGNING_SECRET=your-slack-signing-secret
   ```

4. Start the bot:
   ```bash
   npm start
   ```

## Usage

1. **Setting Up the Bot in Slack**

   - Invite the TalentMatch Bot to your Slack workspace.
   - Configure the bot with the appropriate permissions to manage channels and messages.

2. **Using the `/candidate` Command**

   - Initiate the candidate process by using the `/candidate` commands.
   - Example: `/candidate`

3. **Interacting with the Bot**
   - Use options like `Edit`, `Request For Interview`, and `Schedule Interview` to manage candidate interviews.
   - The bot will notify the channel about candidate updates and scheduled interviews.

## Contributing

We welcome contributions to enhance the TalentMatch Bot. If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.
