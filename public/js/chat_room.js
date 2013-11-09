/*
  ChatRoom v 0.0.1

  Description
  -----------
  Chat room for one-to-one or conference calls

  Dev Info
  --------
  We should resolve room problem first before we step into this

  Usage
  -----
  new ChatRoom(roomId, peer).connect('user1').connect('user2')
*/

var ChatRoom;

ChatRoom = (function() {

  function ChatRoom(roomId, peer) {
    this.roomId = roomId;
    this.peer = peer;
    this.activeConnections = [];
  }

  ChatRoom.prototype.peerActions = function() {
    var _this = this;
    return this.peer.on('connection', function(conn) {
      return conn.on('open', function() {
        return _this.chatConnection(c);
      });
    });
    return this;
  };

  // somehow we need to decide how to deel with connections
  // in my opinion there should be:
  // one-to-one, private chat
  // multi chat (dashboard?, conference?)
  // we can call connect several times
  ChatRoom.prototype.connect = function(to) {
    var conn, options,
      _this = this;
    options = {
      metadata: {
        user: this.peer.id
      }
    };
    conn = this.peer.connect(to, options);
    return conn.on('open', function() {
      return _this.chatConnection(conn);
    });
    return this;
  };

  ChatRoom.prototype.chatConnetion = function(conn) {
    this.activeConnections.push(conn);
    return conn.on('data', function(data) {
      var message;
      if (data.message) {
        message = $('<p/>').text(data.message);
        return $('#chat-container').prepend(message);
      }
    });
    return this;
  };

  return ChatRoom;

})();
