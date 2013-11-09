// one to one call
if(!window.EchoBase) window.EchoBase = {};
window.EchoBase.roomId = "connection-room-id";

var AudioVideoCall;

AudioVideoCall = (function() {

  function AudioVideoCall(roomId, peer) {
    this.roomId = roomId;
    this.peer = peer;
    this.existingCalls = [];
    this.$myVideoDiv = $('#my-video');
    this.startLocalStream().peerActions();
  }

  // start local video stream
  AudioVideoCall.prototype.startLocalStream = function() {
    var _this = this;
    navigator.getUserMedia({audio: true, video: true}, function(stream){
      // Set your video displays
      _this.$myVideoDiv.prop('src', URL.createObjectURL(stream));

      window.localStream = stream;
    }, function(){ /* show error */ });
    return this;
  };

  AudioVideoCall.prototype.makeCall = function() {
    // take info from room about participants and try to connect them
    this.participants = [];
    for(var participant in this.participants) {
      var call = peer.call(participant, window.localStream);
      this.establishConnection(call);
    }
  };

  AudioVideoCall.prototype.endCall = function() {
    for(var call in this.existingCalls) {
      call.close();
    }
  }

  AudioVideoCall.prototype.establishConnection = function(call) {
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

  AudioVideoCall.prototype.peerActions = function() {
    this.peer.on('call', function(call){
      var caller = peer.id;
      // var conf = confirm("" + caller + " is calling you.");
      // if(conf == true){
      call.answer(window.localStream);
      this.establishConnection(call);
      // }
    });
  }

  return AudioVideoCall;

})();

