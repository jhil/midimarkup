var soundPlay = new Audio("/img/play.wav");
var soundStop = new Audio("/img/stop.wav");
var sayInstrument = new SpeechSynthesisUtterance('trumpet');


$('#play-toggle').on({
  'click': function(){
    soundPlay.play();
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
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(getInstrumentName()));
    break;

    case 39: // right
    break;

    case 40: // down
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(getInstrumentName()));
    
    break;

    default: return; // exit this handler for other keys
  }
  e.preventDefault(); // prevent the default action (scroll / move caret)
});



function getInstrumentName() {
  var slice = $(".track").text().substring(0, getCaretCharacterOffsetWithin($('.track')[0]) );
  var lines = slice.split('\n');

  var lastLine = lines[lines.length - 1].trim();
  return lastLine.split(" ")[0];
};


//Credit some sweet angel on JSFiddle
function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}
