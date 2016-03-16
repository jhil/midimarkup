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

  var markup = $('.track').text();
  var trackCommands = parseMarkup(markup);

  playTrack(trackCommands);
};

var playTrack = function ( commands ) {
  var time = 0,
      soundfont = new SoundFont(ctx);

  for ( var x = 0; x < commands.length; x++ ) {

    var inst = soundfont.instrument('acoustic_grand_piano');

    (function(x) {
      var key        = commands[x].key,
          duration   = commands[x].duration;

      inst.onready(function() {
        inst.play(key, x + 1, 1);
      });
    })(x);
  }
};

var parseMarkup = function( markup ) {
  var output = [],
      notes = markup.toUpperCase().split(" ");

  for (var x in notes) {  
    var key = noteToKey(notes[x]);
    if (key) {
      key["key"] = keyToNote(key["key"])
      output.push(key);
      console.log(key);
    } 
  }
  return output; // i.e. { key: "Cb4", duration: 1 }
}

var noteToKey = function( token ) {
  var key = -1,
      duration = 1,
      instrument = 'acoustic_grand_piano';

  if (token.length > 3) {
    console.log(token);
    switch (token) {
      case "PIANO":
        instrument = 'acoustic_grand_piano';
        break;
      case "DRUMS":
        instrument = 'taiko_drum';
        break;
      case "GUITAR":
        instrument = 'acoustic_guitar_steel';
        break;
      case "SAXOPHONE":
        instrument = 'alto_sax';
        break;
      case "TRUMPET":
        instrument = 'trumpet';
        break;
      default:
        return;
    }
  }

  for (var x in token) {
    var cmd = token.charAt(x);
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
  return {
      key: key, 
      duration: duration, 
      instrument: instrument 
    };
}

var keyToNote = function ( key ) {
  var octave = 4;
  var A0 = 0x15; // first note
  var C8 = 0x6C; // last note
  var number2key = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  return number2key[ key % 12] + octave;
}
