function isMessaging(item) {
  return isMessage(item) || isEndConversation(item);
}
function isMessage(item) {
  return ("undefined" !== typeof item.message);
}

function isEndConversation(item) {
  return ("undefined" !== typeof item.endConversation);
}
function processMessage( item  ) {
  if ( isMessage( item )) {
    return (session,args, next) => {
      if ( "function" == typeof item.message ) {
        item.message( session, args).then(next);
      } else {
        session.send(item.message);
        next();
      }
    }
  } else if ( isEndConversation( item )) {
    return (session) => {
      session.endConversation("string" == typeof item.endConversation?item.endConversation:null);
    }
  }
}

module.exports = {
  isMessaging:  isMessaging,
  isMessage : isMessage,
  isEndConversation : isEndConversation,
  processMessage: processMessage
}