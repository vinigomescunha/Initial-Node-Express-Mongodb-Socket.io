var socket = io();

$(document).ready(function() {

    $('<div class="modal fade" id="modal" style="display: none; padding-left: 15px;">\
            <div class="modal-dialog modal-xg">\
                <div class="modal-content">\
                    <div class="modal-body">\
                        <button type="button" class="close" onclick="$(\'#modal\').removeClass(\'in\');$(\'#modal\').hide()">×</button>\
                        <p>\
                            <form class="form1" action="#">\
                            <div><label>Title</label></div>\
                            <div><input type="text" class="form-control" id="title"></div>\
                            <div><label>Content</label></div>\
                            <div><textarea class="form-control" id="content"></textarea></div>\
                            <div><label>Slug</label></div>\
                            <div><input class="form-control" id="slug"></div>\
                            <div><input type="submit" class="btn btn-primary m-t-2" value="send"/></div>\
                            </form>\
                        </p>\
                    </div>\
                </div>\
            </div>\
        </div>').appendTo('body');
});

$(document).on('click', '#create-card', function() {

    $('#modal').addClass('in');
    $('#modal').show();
});

$(document).on('click', '#register', function() {

    var values = {username: $('#user1').val(), password: $('#pass1').val()};
    $.post('/users/register', values, function(data) {
        alert('User Created!');
    });
});

$(document).on('click', '.card', function() {

  id = $(this).attr('card-id');
  window.open('/cards/' + id);
});

$(document).on('submit', '.form1', function(w) {

    w.preventDefault();

    var values = {
        title: $('#title').val(), 
        content: $('#content').val(), 
        slug:$('#slug').val()
    };

    socket.emit('cardmessage', values);

    $('#title').val('');
    $('#content').val('');
    $('#slug').val('');

    console.log('emiting...');

    $('#modal').removeClass('in');
    $('#modal').hide()

    return false;
});

socket.on('cardmessage', function(msg) {

    var size = Object.keys(msg).length;

    if(size > 0 ) 
        if (msg.length)
            for (var i = 0; i < size; i++) {

              var t = msg[i].title, c= msg[i].content,s = msg[i].slug;
              $('#card-container').append('<div class="col-md-4"><div class="card" card-id=' + s + '><h4>' + t + '</h4><p>' + c + '</p></div></div>');
          }
          else {

             var t = msg.title, c= msg.content,s = msg.slug;
             $('#card-container').prepend('<div class="col-md-4"><div class="card" card-id=' + s + '><h4>' + t + '</h4><p>' + c + '</p></div></div>');
         }

     });

socket.on('connect', function(msg) {

    $('#card-container').html('');
    console.log('client connect from server');
});

socket.on('disconnect', function() {

    console.log('client disconnected from server');
});
