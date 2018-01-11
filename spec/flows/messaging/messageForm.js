module.exports = [
  {message: 'hello'},
  {message: 'looks like it works'},
  {message: function ( session, flow ) {
    session.send('callbacks supported')
    return Promise.resolve();
  }}
]