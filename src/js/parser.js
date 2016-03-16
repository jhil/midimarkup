var SoundFont = require('soundfont-player');
var ctx = new AudioContext();

$( document ).keypress(function (e) {
 var key = e.which;
  switch( key ) {
    case 13: //Enter key
      e.preventDefault();
      play();
      break;
    default:
      break;
  }
});

var play = function () {
  // TODO
  console.log("play!");
  var soundfont = new SoundFont(ctx);
  var instrument = soundfont.instrument('acoustic_grand_piano');
  instrument.onready(function() {
    instrument.play('C4', 0);
  });
};