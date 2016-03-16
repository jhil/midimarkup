var ctx, soundfont,
    Soundfont = require('soundfont-player');


$( document ).keypress(function (e) {
  if(e.shiftKey){
    var key = e.which;
    switch( key ) {
      case 13: //Enter key
      e.preventDefault();
      ctx = new AudioContext();
      soundfont = new Soundfont(ctx);
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
  var time = 0;

  for ( var x = 0; x < commands.length; x++ ) {

    (function(x) {
      var key        = commands[x].key,
          duration   = commands[x].duration,
          instrument = commands[x].instrument;

      var inst = soundfont.instrument(instrument);
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

var instrumentSetting = 'acoustic_grand_piano';

var noteToKey = function( token ) {
  var key = -1,
      duration = 1;

  if (token.length > 3) {
    console.log(token);
    switch (token) {
      case "PIANO":
        instrumentSetting = 'acoustic_grand_piano';
        break;
      case "DRUMS":
        console.log("hererererererer");
        instrumentSetting = 'taiko_drum';
        break;
      case "GUITAR":
        instrumentSetting = 'acoustic_guitar_steel';
        break;
      case "SAXOPHONE":
        instrumentSetting = 'alto_sax';
        break;
      case "TRUMPET":
        instrumentSetting = 'trumpet';
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
  console.log(key + ": " + duration + ": " + instrumentSetting); 
  return {
      key: key, 
      duration: duration, 
      instrument: instrumentSetting 
    };
}

var keyToNote = function ( key ) {
  var octave = 4;
  var A0 = 0x15; // first note
  var C8 = 0x6C; // last note
  var number2key = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  return number2key[ key % 12] + octave;
}
