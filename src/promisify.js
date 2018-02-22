module.exports = function (entity, isReject) {
  let handler = Promise.resolve;
  if ( isReject ) {
    handler = Promise.reject;
  }
  if ( !(entity instanceof Promise ) ) {
    entity = handler( entity );
  }
  return entity;
}