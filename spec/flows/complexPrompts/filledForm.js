module.exports = [
  {
    "type": "choice",
    "id": "choice",
    "choices": "power|money|beauty",
    "prompt": "Please select your life's time choice"
  },
  {
    "type": "confirm",
    "id": "confirm",
    "prompt": "Please enter a boolean value"
  },
  {
    "type" : "dialog",
    "id" : "dialog",
    "dialog" : () => 'Hello from form!'
  },
  {
    "type": "email",
    "id": "email",
    "prompt": "Please enter an email value"
  },
  {
    "type": "number",
    "id": "number",
    "prompt": "Please enter a number value"
  },
  {
    "type": "text",
    "id": "text",
    "prompt": "Please enter a text value"
  },
  {
    "type": "time",
    "id": "time",
    "prompt": "Please enter a time value"
  },
  {
    "type": "url",
    "id": "url",
    "prompt": "Please enter a URL value"
  }
]