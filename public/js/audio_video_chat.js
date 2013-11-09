/*
  AudioVideoChat v 0.0.1

  Description
  -----------
  Audio/Video chat for one-to-one or conference callss

  Dev Info
  --------
  This should be a singleton class as the user can be involved in one audio/video conversation at a time
  it may be either one-to-one call or multiuser conference

  Usage
  -----
  AudioVideoChat.get(roomId, peer);
*/

if(!window.EchoBase)
  window.EchoBase = {};
window.EchoBase.roomId = "connection-room-id";

// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var AudioVideoChat;

AudioVideoChat = (function() {
  var instance, _AudioVideo;

  function AudioVideoChat(roomId, peer) {}

  instance = null;

  _AudioVideo = (function() {

    function _AudioVideo(roomId, peer) {
      this.roomId = roomId;
      this.peer = peer;
      this.existingCalls = [];
      this.$myVideoDiv = $('#my-video');
      this.startLocalStream().peerActions();
    }

    // start local video stream
    _AudioVideo.prototype.startLocalStream = function() {
      var _this = this;
      navigator.getUserMedia({audio: true, video: true}, function(stream){
        // Set your video displays
        _this.$myVideoDiv.prop('src', URL.createObjectURL(stream));

        window.localStream = stream;
      }, function(){ /* show error */ });
      return this;
    };

    _AudioVideo.prototype.makeCall = function() {
      // take info from room about participants and try to connect them
      this.participants = [];
      for(var participant in this.participants) {
        var call = peer.call(participant, window.localStream);
        this.establishConnection(call);
      }
    };

    _AudioVideo.prototype.endCall = function() {
      for(var call in this.existingCalls) {
        call.close();
      }
    }

    _AudioVideo.prototype.establishConnection = function(call) {
      // save in a db an info that user is in a call
      // Wait for stream on the call, then set peer video display
      call.on('stream', function(stream){
        var $video = $('#their-video-' + call.peer);
        if($video[0])
          $video.prop('src', URL.createObjectURL(stream));
        else
          $('#video-container').append($('<video/>').prop('id', call.peer).prop('autoplay', true).prop('src', URL.createObjectURL(stream)));
      });

      window.existingCalls.push(call);

      call.on('close', function() {
        // do something with that
      });
      return this;
    };

    _AudioVideo.prototype.peerActions = function() {
      this.peer.on('call', function(call){
        var caller = peer.id;
        // var conf = confirm("" + caller + " is calling you.");
        // if(conf == true){
        call.answer(window.localStream);
        this.establishConnection(call);
        // }
      });
    };

    AudioVideoChat.get = function(roomId, peer) {
      return instance != null ? instance : instance = new _AudioVideo(roomId, peer);
    };

    return _AudioVideo;

  })();

  return AudioVideoChat;

}).call(this);

// var peer = new Peer("mmmmmasasa", { key: 'lwjd5qra8257b9', debug: 1, config: {'iceServers': [
//       { url: 'stun:stun.l.google.com:19302' } // Pass in optional STUN and TURN server for maximum network compatibility
//     ]}});

// AudioVideoChat.get('asdeded', peer);
