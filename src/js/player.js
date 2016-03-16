$('#play-toggle').on({
    'click': function(){
      if($(this).children("img").attr('src') == '/img/icon-play.svg') {
        $(this).children("img").attr('src','/img/icon-pause.svg');
      } else {
        $(this).children("img").attr('src','/img/icon-play.svg');
      }
    }
});

$('#stop-toggle').on({
    'click': function(){
        $('#play-toggle').children("img").attr('src','/img/icon-play.svg');
    }
});

$( document ).keydown(function (e) {
  if(e.shiftKey && e.keyCode == 13){
    if($('#play-toggle').children("img").attr('src') == '/img/icon-play.svg') {
      $('#play-toggle').children("img").attr('src','/img/icon-pause.svg');
    } else {
      $('#play-toggle').children("img").attr('src','/img/icon-play.svg');
    }
  }
});

