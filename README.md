# botbuilder-formflow
Form flow support for Microsoft Bot Framework. 

Unfortunately, I'm still struggling with myself over this documentation. 
Please use tests as a documentation for now. 

Tests located at **spec/**** folder.
 
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

So, this Library will allow your bot to request complex forms from a user. 
It helps to build a waterfall dialog that will handle the whole form flow. 
The form will be splitted in a list of dialogs required for each each. You can use predefined 
prompts or create you custom dialog wrappers around MBF prompts. Dialogs for each field evaluated separately 
and could be customized.
The Library features:
- Standard Prompts plus prompts for emails and urls;
- Validators, Prompts, Error Prompts and Value extractors could be customized by a developer;
- Subdialogs are supported;
  
## How To Create Form Flow 

The Library provides a factory function `create` used to create FormFlows forms. 
This function will create and inject a Waterfall dialog into a bot.
Typical usage:
`formFlow.create(bot, '/form', formConfig);` 
Where:
- *bot* is an actual instance of [UniversalBot](https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.universalbot.html);
- *'/form'* - a Id for FormFlow dialog;
- *formConfig* - an array, each item contains a config for a result form field;
   
Every item in the array mentioned above should have at least two attributes: 
- *id* attribute used to identify a value in a form result;
- *type* attribute used to identify validators and business logic.

## Prompt Types
Every type could bring its own default validation, custom behaviour and 
could require additional attributes.
- **choices** - A wrapper around [builder.Prompt.choice](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.__global.iprompts.html#choice) Prompt. 
**Required attributes**:
-- choices (string | Object | string[] | IChoice[]), Explained in [function arguments](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.__global.iprompts.html#choice);
- **confirm** - A wrapper around [builder.Prompts.confirm](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.__global.iprompts.html#confirm) Prompt;
- **dialog** - Allows to redirect flow execution to an external dialog
**Required attributes****:
-- dialog (String|Array|Function) a route to a dialog or a constructor for Waterfall dialog;
for Waterfall dialog
- **email** - A wrapper around `/^\S+@\S+$/` RegExp
- **number** - A wrapper around [builder.PromptRecognizers.recognizeNumbers()](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.ipromptrecognizenumbersoptions.html) internal BotBuilder function;
- **text** - A wrapper around [builder.Prompts.text](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.__global.iprompts.html#text) Prompt;
- **time** - A wrapper around [botbuilder.PromptRecognizers.recognizeTimes](https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.ipromptrecognizetimesoptions.html) internal BotBuilder function;
- **url** - A wrapper around `/^(ftp|http|https):\/\/[^ "]+$/` RegExp


 
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
