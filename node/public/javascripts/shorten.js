$('.btn-shorten').on('click', function(){
  if($('#url-field').val() != ''){
    $.ajax({
      url: '/submit',
      type: 'POST',
      dataType: 'JSON',
      data: {url: $('#url-field').val()},
      success: function(data){
          var resultHTML = '<a class="result" href="' + data.shorten_url + '">'
              + data.shorten_url + '</a>';
          $('#link').html(resultHTML);
          $('#link').hide().fadeIn('slow');
      }
    });
  }
});
