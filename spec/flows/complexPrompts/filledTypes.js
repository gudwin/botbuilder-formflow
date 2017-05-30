module.exports = [
  {
    "type": "choice",
    "id": "choice",
    "choices": "power|money|beauty",
    "prompt": "Please select your life's time choice",
    "response": "Your choice is %s",
    "errorPrompt": "Please enter a valid choice"
  },
  {
    "type": "confirm",
    "id": "confirm",
    "prompt": "Please enter a boolean value",
    "errorPrompt": "I don't understand that. Could you say 'yes' or 'no'?",
    "response": "You selected %s"
  },
  {
    "type" : "dialog",
    "id" : "dialog",
    "dialog" : () => 'Hello from form!'
  },
  {
    "type": "email",
    "id": "email",
    "prompt": "Please enter an email value",
    "errorPrompt": "I don't understand that. Could you that has '@' in the middle?",
    "response": "You selected %s"
  },
  {
    "type": "number",
    "id": "number",
    "prompt": "Please enter a number value",
    "errorPrompt": "I don't understand that. Please type several digits?",
    "response": "You selected %s"
  },
  {
    "type": "text",
    "id": "text",
    "prompt": "Please enter a text value",
    "response": "You selected %s"
  },
  {
    "type": "time",
    "id": "time",
    "prompt": "Please enter a time value",
    "errorPrompt": "I don't understand that. Could you say some recognizeable as time?",
    "response": "You selected %s"
  },
  {
    "type": "url",
    "id": "url",
    "prompt": "Please enter a URL value",
    "errorPrompt": "I don't understand that. Could you something that starts with http or https:/?",
    "response": "You selected %s"
  },
  {
    "type": "dialog",
    "id": "dialog",
    "prompt": "Please enter a URL value",
    "errorPrompt": "I don't understand that. Could you something that starts with http or https:/?",
    "response": "You selected %s"
  }
]