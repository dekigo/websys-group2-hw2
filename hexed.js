/* Hexed! - a jQuery plugin
 * -------------------------
 * ITWS 2110 / CSCI xxxx
 * Web Systems Development I
 * -------------------------
 * 
 */

(function( $ ) {
  function generateColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    $("#swatch").css( "background-color", color );
  }
  function refreshValues() {
    var r = $("#slider_red").slider( "value" );
    var g = $("#slider_green").slider( "value" );
    var b = $("#slider_blue").slider( "value" );
    $("#red_in").attr("value",r);
    $("#green_in").attr("value",g);
    $("#blue_in").attr("value",b);
  }
  $(function(){
    $(".slider").slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: 127,
      slide: refreshValues,
      change: refreshValues
    });
  });
  $("#red_in").keyup(function() {
    $("#slider_red").slider("value",$(this).val())
  });
  $("#green_in").keyup(function() {
    $("#slider_green").slider("value",$(this).val())
  });
  $("#blue_in").keyup(function() {
    $("#slider_blue").slider("value",$(this).val())
  });
  generateColor();
}( jQuery ));

