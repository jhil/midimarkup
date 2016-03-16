var SoundFont = require('soundfont-player');
var ctx = new AudioContext();

$( document ).keypress(function (e) {
  if(e.shiftKey){
    var key = e.which;
    switch( key ) {
      case 13: //Enter key
      e.preventDefault();
      play();
      break;
      default:
      break;
    }
  }
});

var play = function () {
  console.log("play!");
  var soundfont = new SoundFont(ctx);

  $(".track").each(function( index ) {
    var instrument = $(this).find(".track-instrument").text();
    var markup = $(this).find(".track-markup").text();
    console.log(instrument + ": " + markup);
  });
  
  var instrument = soundfont.instrument('acoustic_grand_piano');
  instrument.onready(function() {
    instrument.play('C4', 0);
  });
};