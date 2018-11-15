$(function () {
  $('.post-body h2,h3').each(
    function(i, h) {
      var header = $(h);
      var headerID = header.attr('id');
      var headerText = header.text();
      header.html("<a class='headline-link' href='#" + headerID + "'>#</a>" + headerText);
    }
  );
});
