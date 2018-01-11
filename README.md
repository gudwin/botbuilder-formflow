# botbuilder-formflow
Messaging framework for Microsoft Bot Framework. Initially, allowed only to create formflows, but starting from version 0.4 could be used as a replacement for standard Waterfall dialogs.
 
## Glossary 

- **MBB** or **BotBuilder** - Microsoft Bot Builder Framework;
- **FormFlow Form** - as mentioned in [MBF documentation for .NET](https://docs.microsoft.com/en-us/bot-framework/dotnet/bot-builder-dotnet-formflow). 
Dialogs are very powerful and flexible, but handling a guided conversation 
such as ordering a sandwich can require a lot of effort. At each point in 
the conversation, there are many possibilities of what will happen next. 
For example, you may need to clarify an ambiguity, provide help, go back, 
or show progress. By using FormFlow within the Bot Builder SDK for .NET, 
you can greatly simplify the process of managing a guided conversation like this. 
Typical form flows: registration form, authentification form and etc
- **FormFlow Field** - a single attribute in FormFlow Form result. Could identify
a request for required value (with corresponding validator) or a route to 
another dialog or could be fully customized ( When attributes prompt, errorPrompt, validator, extractor defined)
 
- **Waterwall** - A waterfall is a specific type of dialog handler. A waterfall 
contains an array of functions where the results of the first function are 
passed as input to the next function and so on. [Official documentation](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-waterfall)

- **Prompt** - A built-in dialog that handles an input from a user. 
The user's input returned by `session.endDialogWithresult()` call. 
Official MBF [prompts](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-prompt) are 
used as a basis for more complex ones;   
 
- **Propmt Type** - A classification of built-in Prompts in this library. The library allows you to 
use them to build complex and comprehensive form dialogs. 

## Overview 

So, this Library allows helps you to build conversation dialogs with the user. The library accepts a flow and transforms it into a standard waterfall dialog. 
 
You can use predefined  prompts or create you custom dialog wrappers around MBF prompts. Dialogs for each field evaluated separately and could be customized.
The Library features:
- Standard Prompts plus prompts for emails and urls;
- Validators, Prompts, Error Prompts and Value extractors could be customized by a developer;
- Subdialogs are supported;
- Standard text messages and endConversation message;
  
## How To Create Form Flow 

The Library provides a factory function `create` used to create FormFlows forms. 
This function will create and inject a Waterfall dialog into a bot.
Typical usage:
`formFlow.create(bot, '/form', formConfig);` 
Where:
- *bot* is an actual instance of [UniversalBot](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.universalbot.html);
- *'/form'* - a Id for FormFlow dialog;
- *formConfig* - an array, each item contains a configuration of prompt for a field;
   

## Field Attributes
- **required** **type** - (String) attribute used to identify validators and business logic.
- **id** - (String) 
- **prompt** - (String|Function) 
- **errorPrompt** - (String|Function) 
- **validator** - (String|Function|Object)
- **response** - (String|Function)
- **extractor** - (String|Function)

## Prompt Types
Every type could bring its own default validation, custom behaviour and could require additional attributes.

- **choices**(string | Object | string[] | IChoice[]) - A wrapper around [builder.Prompt.choice](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.__global.iprompts.html#choice) Prompt. 
- **confirm** - A wrapper around [builder.Prompts.confirm](https://docs.botframeworkx.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.__global.iprompts.html#confirm) Prompt;
- **custom** - Use that type to inject your prompts; 
- **dialog** - dialog (String|Array|Function) a route to a dialog or a constructor for Waterfall dialog. This option also requires next attributes to be defined:
  - **dialog** - (String|Array|Function) Waterfall dialog;  
- **email** - A wrapper around `/^\S+@\S+$/` RegExp
- **number** - A wrapper around [builder.PromptRecognizers.recognizeNumbers()](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.ipromptrecognizenumbersoptions.html) internal BotBuilder function;
- **text** - A wrapper around [builder.Prompts.text](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.__global.iprompts.html#text) Prompt;
- **time** - A wrapper around [botbuilder.PromptRecognizers.recognizeTimes](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.ipromptrecognizetimesoptions.html) internal BotBuilder function;
- **url** - A wrapper around `/^(ftp|http|https):\/\/[^ "]+$/` RegExp

## Basic Messaging

If you want use standard messages (without prompts) in your flows, the Library allows that. 
At current moment, there are two type of messages supported:

- **message** - (String, Message, Function ) - sends a message to user, in case, if function passed as a value, than it should return a Promise object to signal the Library to continue execution;
- **endConversation** - (String|Null) - sends a endConversation message, if string value passed than the Library will send it a normal message;

## Built-in Complex Dialogs

### SwitchDialog

The purpose of this prompt to display list of choices and depending on user choice to forward conversation to selected dialog. List of choices is a key-value object where key is a label that will be displayed to user and value is id of the dialog or waterfall array, in that case SwitchDialog will register it in the bot automatically 

**Example**

```javascript
const FormFlow = require('botbuilder-formflow');

new FormFlow.SwitchDialog({
    id : 'subdialog',  // Results will be stored in `subdialog` propterty
    prompt : 'Please, select subdialog', // Prompt message for a user
    choices : {   
      'Add' : '/add',
      'Remove' : [
        function ( session ) {
          session.endDialogWithResult({
            "response":'Hello world!'
          });
        }
      ]
    }
  })
```

## Examples

1. [Simple registration form](https://github.com/gudwin/botbuilder-formflow/blob/master/examples/signup.js)
2. [Custom validator for a field](https://github.com/gudwin/botbuilder-formflow/blob/master/examples/password_validation.js)
3. [Form with a subform](https://github.com/gudwin/botbuilder-formflow/blob/master/examples/subform.js)
4. [List of validators for specific fields](https://github.com/gudwin/botbuilder-formflow/blob/master/examples/multiple_validation.js)

## Installation

```
    npm install --save botbuilder-formflow
```

## Tests
 
```
    npm test
```

# Changelog
- 0.4.0 - Support for text messages and endConversation;
- 0.3.0 - SwitchDialog introduced, "init" step introduced