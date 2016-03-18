$(document).keyup(function(e) {
  switch(e.which) {
    case 37: // left
    case 39: // right
      break;
    case 38: // up
    case 40: // down
      var speech = new SpeechSynthesisUtterance(getInstrumentName());
      window.speechSynthesis.speak(speech);
      break;
    default: 
      return; // exit
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
