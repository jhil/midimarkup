var changed,
    lastValue = '',
    div = $('.track'),
    notes = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

function markNotes() {
    var html = div.html().replace(/<\/?span class="track-note">/gi, ''),
        text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '),
        exp;
    $.each(notes, function(i, note) {
        exp = new RegExp('\\b(' + note + ')\\b', 'gi');
        html = html.replace(exp, function(m) {
console.log('NOTE MATCH:', m);
            return '<span class="track-note">' + m + '</span>';
        });
    });
    //html = html.replace('&nbsp;', ' ').replace(/\s+/g, ' ');
console.log('HTML:', html);
console.log('----');
    div.html(html);
}

setInterval(function() {
    var html = div.html();
    if ( lastValue != html && html ) {
//console.log(lastValue);
//console.log(html);
//console.log('----');
        lastValue = html;
        markNotes();
        setEndOfContenteditable(div[0]);
    }
}, 250);

function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}
