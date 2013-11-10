/*
  AudioVideoChat v 0.0.3

  Description
  -----------
  Audio/Video chat for one-to-one or conference callss

  Dev Info
  --------

  Usage
  -----
  AudioVideoChat.get(room, peer);
*/
var AudioVideoChat;
window.existingCalls = [];

AudioVideoChat = (function() {
  var instance, _AudioVideo;

  function AudioVideoChat(room, peer, callback) {}

  instance = null;

  _AudioVideo = (function() {

    function _AudioVideo(room, peer, callback) {
      this.peerActions = __bind(this.peerActions, this);
      this.room = room;
      this.peer = peer;
      this.existingCalls = [];
      this.$myVideoDiv = $('#my-video');
      this.callback = callback;
      this.startLocalStream(this.peerActions);
    }

    // start local video stream
    _AudioVideo.prototype.startLocalStream = function(callback) {
      var _this = this;
      navigator.getUserMedia({audio: true, video: true}, function(stream){
        // Set your video displays
        $('#my-video').prop('src', URL.createObjectURL(stream));

        window.localStream = stream;
        callback();
      }, function(){ /* show error */ });
      return this;
    };

    _AudioVideo.prototype.makeCall = function(peerId) {
      var call = peer.call(peerId, window.localStream);
      this.establishConnection(call);
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

      this.existingCalls.push(call);

      call.on('close', function() {
        // do something with that
        // maybe here we should send a signal to room that meeting is finished?
      });
      return this;
    };

    _AudioVideo.prototype.peerActions = function() {
      var _this = this;
      this.peer.on('call', function(call){
        var caller = peer.id;
        call.answer(window.localStream);
        _this.establishConnection(call);
      });
      this.callback();
    };

    AudioVideoChat.get = function(room, peer, callback) {
      return instance != null ? instance : instance = new _AudioVideo(room, peer, callback);
    };

    return _AudioVideo;

  })();

  return AudioVideoChat;

}).call(this);
