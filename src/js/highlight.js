jQuery(document).ready(function(){

   $("#richTextField").keyup(function() {

      var divContent = $(this).text().split('');
      var pattern = /([a-z])/;
      var replaceWith = '<span class="numberClass"'+ '>$1</span>';
      var highlighted = divContent.map(function(u) {
          if (pattern.test(u))
              return $(u.replace(pattern, replaceWith));
          else
              return document.createTextNode(u);
      });

      var caretPos = getCaretCharacterOffsetWithin(this);
     
      $(this).empty().append(highlighted);

      setCursor(this, caretPos);
     
   });

});

function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    if (typeof window.getSelection != "undefined") {
        var range = window.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
        var textRange = document.selection.createRange();
        var preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

    function setCursor(node,pos){
        if(!node){
            return false;
        } else if(document.createRange) {
          range = document.createRange();
          range.selectNodeContents(node);
          range.setStart(node, pos);
          range.setEnd(node, pos);
          selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        } else if(node.createTextRange) {
            var textRange = node.createTextRange();
            textRange.collapse(true);
            textRange.moveEnd(pos);
            textRange.moveStart(pos);
            textRange.select();
            return true;
        } else if(node.setSelectionRange) {
            node.setSelectionRange(pos,pos);
            return true;
        }
        return false;
    }
