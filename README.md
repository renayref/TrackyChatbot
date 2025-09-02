# Tracky ChatBot
## Overview

Tracky ChatBot is a simple customer service chatbot built in React.js that helps users track their packages, report lost or damaged items, and receive guidance on next steps. The chatbot demonstrates a clear conversation flow with error handling, suggested responses, and interactive decision-making.

This project is a demonstration of creative conversation design and basic frontend implementation using React.

---

## Starting / Running the App

To start the app, go to your terminal make sure you have node installed on your device: 

Once node is installed, install the app by running the following command in your terminal:
```npm install ```

Run the app locally run: 
```npm start```

This will start the development server and open the chatbot in your default browser at http://localhost:3000.


To stop the server Press ```Ctrl + C``` in the terminal 


---

## Approach

1. Conversation Flow

The chatbot uses a step-based approach to track conversation progress.

Steps include tracking a package, confirming package delivery, reporting lost or damaged packages, and collecting necessary details such as email or description.

Suggested responses are dynamically displayed to guide the user and reduce errors.

2. User Input Handling

Text input is validated at certain steps (e.g., email format).

The chatbot handles unexpected inputs with polite fallback messages.

3. State Management

React useState is used to manage user input, chatbot messages, current step, and auxiliary data (damage description, tracking numbers, etc.).

useEffect ensures the chat scrolls automatically as new messages are added.

4. Creativity

The chatbot simulates empathy and human-like responses.

Includes dynamic tracking number generation and support for multiple conversation paths.

Provides guided suggestions for faster interactions.

5. Error Handling

Invalid tracking numbers prompt email lookup.

Missing details in lost or damaged reports trigger follow-up prompts.

---

## Screenshots / Examples

Initial Chat
(src/readme_img/initialChat.png)

Tracking a Package
(src/readme_img/trackingPackage.png)

Reporting a Lost Package
(src/readme_img/lostPackage.png)

Reporting a Damaged Package
(src/readme_img/damagedPackage.png)

Confirmation and Exit
(src/readme_img/confirmationExit.png)


---

## Notes

The chatbot is built entirely in React.js and does not require a backend for demonstration purposes.

This implementation can easily be extended to integrate with real tracking APIs or backend services for production use.

Styling is handled via App.css and can be customized to match branding requirements.



