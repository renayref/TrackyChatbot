import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const TRACK_SUGGESTION = 'Track a package';
const TRACKING_NUMBER = '3327194A0092';
const EXIT_CHAT = 'Exit chat';
const REPORT_LOST = 'Report a lost package';
const NOT_RECEIVED_1 = 'I have not received my package';
const NOT_RECEIVED_2 = 'Package not received'; // not suggested, but handled
const DAMAGED = 'Package was damaged';
const SEND_IMAGE = '[Send image of damage]';
const YES = 'Yes';
const NO = 'No';
const REENTER_DETAILS = 'Re-enter details';

function getRandomTrackingNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function isValidEmail(email) {
  // Simple email validation
  return /.+@.+\..+/.test(email);
}

function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello, how can I help you?' },
  ]);
  // 0: initial, 1: waiting for tracking number, 2: after tracking, 3: after issue, 4: end, 5: damage details, 6: claim, 7: ask for email, 8: suggest tracking, 9: confirm tracking, 10: lost claim description, 11: lost claim confirm, 13: damaged claim confirm
  const [step, setStep] = useState(0);
  const [damageDesc, setDamageDesc] = useState('');
  const [damageImage, setDamageImage] = useState(false);
  const [suggestedTracking, setSuggestedTracking] = useState('');
  const [lostClaimDesc, setLostClaimDesc] = useState('');
  const [lostClaimTracking, setLostClaimTracking] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const sendMessage = (text) => {
    if (text.trim() === '') return;
    const userMessage = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setTimeout(() => {
      setMessages((msgs) => {
        let botReply = '';
        let nextStep = step;
        if (step === 0) {
          if (text === TRACK_SUGGESTION) {
            botReply = 'Great! Can you enter in your tracking number.';
            nextStep = 1;
          } else {
            botReply = 'Sorry can you rephrase that';
          }
        } else if (step === 1) {
          if (text === TRACKING_NUMBER) {
            botReply = 'Your package has been delivered. Can I help you with anything else?';
            nextStep = 2;
          } else {
            botReply = 'Sorry tracking number not recognized. Would you like to search for your tracking number by entering your email?';
            nextStep = 7;
          }
        } else if (step === 2) {
          if (
            text === NOT_RECEIVED_1 ||
            text.trim().toLowerCase() === 'package not received'.toLowerCase()
          ) {
            botReply = 'I am sorry to hear that. Would you like to report a lost package?';
            nextStep = 3;
          } else if (text === DAMAGED) {
            botReply = 'I am sorry to hear your package was damaged. Please provide a brief description of the damage and an image.';
            nextStep = 5;
          } else if (text === EXIT_CHAT) {
            botReply = 'Thank you for chatting. Goodbye!';
            nextStep = 4;
          } else {
            botReply = 'Sorry, I didn\'t understand. Please choose an option.';
          }
        } else if (step === 3) {
          if (text === REPORT_LOST) {
            botReply = 'Please provide a brief description of the issue.';
            setLostClaimTracking(TRACKING_NUMBER); // Use the main tracking number for now
            nextStep = 10;
          } else if (text === EXIT_CHAT) {
            botReply = 'Thank you for chatting. Goodbye!';
            nextStep = 4;
          } else {
            botReply = 'Sorry, I didn\'t understand. Please choose an option.';
          }
        } else if (step === 5) {
          // Damage details step
          let newDamageDesc = damageDesc;
          let newDamageImage = damageImage;
          if (text === SEND_IMAGE) {
            newDamageImage = true;
          } else {
            newDamageDesc = text;
          }
          setDamageDesc(newDamageDesc);
          setDamageImage(newDamageImage);
          if (newDamageDesc && newDamageImage) {
            botReply = `Please confirm the details:\nTracking Number: ${TRACKING_NUMBER}\nDescription: ${newDamageDesc}`;
            nextStep = 13;
          } else if (!newDamageDesc) {
            botReply = 'Please provide a brief description of the damage.';
          } else if (!newDamageImage) {
            botReply = 'Please send an image of the damage.';
          }
        } else if (step === 6) {
          if (text === YES) {
            botReply = 'A support agent will contact you shortly about your claim.';
            nextStep = 4;
          } else if (text === NO) {
            botReply = 'Is there anything else I can help you with?';
            nextStep = 2;
            // Reset damage info for possible new flow
            setDamageDesc('');
            setDamageImage(false);
          } else {
            botReply = 'Sorry, I didn\'t understand. Please choose Yes or No.';
          }
        } else if (step === 7) {
          // Ask for email
          if (isValidEmail(text)) {
            const randomTracking = getRandomTrackingNumber();
            setSuggestedTracking(randomTracking);
            botReply = `We found a tracking number associated with your email: ${randomTracking}. Is this your package?`;
            nextStep = 8;
          } else {
            botReply = 'That does not look like a valid email. Please enter a valid email address.';
          }
        } else if (step === 8) {
          // Confirm tracking number
          if (text === YES) {
            botReply = 'Your package has been delivered. Can I help you with anything else?';
            nextStep = 2;
          } else if (text === NO) {
            botReply = 'Sorry we could not find your package. Please try again or contact support.';
            nextStep = 7;
          } else {
            botReply = 'Please answer Yes or No.';
          }
        } else if (step === 10) {
          // Lost claim description
          setLostClaimDesc(text);
          botReply = `Please confirm the details:\nTracking Number: ${lostClaimTracking}\nDescription: ${text}`;
          nextStep = 11;
        } else if (step === 11) {
          if (text === YES) {
            botReply = 'A support agent will contact you in 24-48 hours.';
            nextStep = 4;
          } else if (text === NO) {
            botReply = 'Would you like to re-enter your details or exit the chat?';
            nextStep = 12;
          } else {
            botReply = 'Please answer Yes or No.';
          }
        } else if (step === 12) {
          if (text === REENTER_DETAILS) {
            botReply = 'Please provide a brief description of the issue.';
            nextStep = 10;
          } else if (text === EXIT_CHAT) {
            botReply = 'Thank you for chatting. Goodbye!';
            nextStep = 4;
          } else {
            botReply = 'Please choose to re-enter details or exit the chat.';
          }
        } else if (step === 13) {
          // Damaged claim confirm
          if (text === YES) {
            botReply = 'A support agent will contact you shortly about your claim.';
            nextStep = 4;
          } else if (text === NO) {
            botReply = 'Would you like to re-enter your details or exit the chat?';
            // Reset damage info for possible new flow
            setDamageDesc('');
            setDamageImage(false);
            nextStep = 12;
          } else {
            botReply = 'Please answer Yes or No.';
          }
        }
        setStep(nextStep);
        return [...msgs, { sender: 'bot', text: botReply }];
      });
    }, 500);
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(inputValue);
  };

  // Suggestions based on step
  let suggestions = [];
  if (step === 0) {
    suggestions = [TRACK_SUGGESTION];
  } else if (step === 1) {
    suggestions = [TRACKING_NUMBER];
  } else if (step === 2) {
    suggestions = [NOT_RECEIVED_1, DAMAGED, EXIT_CHAT]; // removed NOT_RECEIVED_2 from suggestions
  } else if (step === 3) {
    suggestions = [REPORT_LOST, EXIT_CHAT];
  } else if (step === 5) {
    // Damage details: show SEND_IMAGE if not sent, otherwise no suggestion
    if (!damageImage) {
      suggestions = [SEND_IMAGE];
    }
  } else if (step === 6) {
    suggestions = [YES, NO];
  } else if (step === 7) {
    // Ask for email, no suggestions
    suggestions = [];
  } else if (step === 8) {
    // Confirm tracking number
    suggestions = [YES, NO];
  } else if (step === 10) {
    // Lost claim description, no suggestions
    suggestions = [];
  } else if (step === 11) {
    // Confirm lost claim details
    suggestions = [YES, NO];
  } else if (step === 12) {
    suggestions = [REENTER_DETAILS, EXIT_CHAT];
  } else if (step === 13) {
    // Confirm damaged claim details
    suggestions = [YES, NO];
  }

  // Filter suggestions based on inputValue
  const filteredSuggestions =
    inputValue.trim() === ''
      ? suggestions
      : suggestions.filter((s) =>
          s.toLowerCase().includes(inputValue.toLowerCase())
        );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tracky ChatBot</h1>
        <div className="chat-container">
          <div className="messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {step !== 4 && (
            <>
              <form onSubmit={handleSubmit} className="input-form">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  placeholder="Type your message..."
                  className="chat-input"
                  autoComplete="off"
                />
                <button type="submit" className="send-button">Send</button>
              </form>
              {filteredSuggestions.length > 0 && (
                <div className="suggestions-list">
                  {filteredSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
