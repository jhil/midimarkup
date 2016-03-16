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

  var markup = $('.track').text();
  var keys = parseMarkup(markup);

  var instrument = soundfont.instrument('acoustic_grand_piano');
  instrument.onready( function() {
    instrument.play('C4', 0);
  });

};

var parseMarkup = function( markup ) {
  var output = [],
      notes = markup.toUpperCase().split(" ");

  for (var x in notes) {  
    var key = noteToKey(notes[x]);
    if (key) {
      key["key"] = keyToNote(key["key"])
      output.push(key);
    } 
  }

  return output; // i.e. { key: "Cb4", duration: 1 }
}

var noteToKey = function( note ) {
  if (note.length > 3)
    return;

  var key = -1,
      duration = 1;

  for (var x in note) {
    var cmd = note.charAt(x);
    switch( cmd ) {
      case 'A':
        key = 69;
        break;
      case 'B':
        key = 71;
        break;
      case 'C':
        key = 60;
        break;
      case 'D':
        key = 62;
        break;
      case 'E':
        key = 64;
        break;
      case 'F':
        key = 65;
        break;
      case 'G':
        key = 67;
        break;
      case '+':
        if (key === -1) return;
        key++;
        break;
      case '-':
        if (key === -1) return;
        key--;
        break;
      case '1':
      case '2':
      case '4':
      case '8':
        duration = parseInt(cmd);
        break;
      default:
        return;
    } 
  }
  console.log(key + ": " + duration); 
  return { "key": key, "duration": duration };
}

var keyToNote = function ( key ) {
  var octave = 4;
  var A0 = 0x15; // first note
  var C8 = 0x6C; // last note
  var number2key = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  return number2key[ key % 12] + octave;
}
