var soundPlay = new Audio("/img/play.wav");
var soundStop = new Audio("/img/stop.wav");
var sayInstrument = new SpeechSynthesisUtterance('trumpet');



$('#play-toggle').on({
  'click': function(){
    soundPlay.play();
    playTrack.play();
  }
});

$('#stop-toggle').on({
  'click': function(){
    soundStop.play();
  }
});

$( document ).keydown(function (e) {
  if(e.shiftKey && e.keyCode == 13){
    if($('#play-toggle').children("img").attr('src') == '/img/icon-play.svg') {
      soundStop.play();
      playTrack.play();
    } else {
      soundPlay.play();
    }
  }
});


$(document).keyup(function(e) {
  switch(e.which) {
        case 37: // left
        break;

        case 38: // up
        window.speechSynthesis.speak(sayInstrument);
        break;

        case 39: // right
        break;

        case 40: // down
        window.speechSynthesis.speak(sayInstrument);
        
        break;

        default: return; // exit this handler for other keys
      }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });


