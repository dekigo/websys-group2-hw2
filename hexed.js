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
    $("#first_swatch").css("background-color",color);
  }
  function refreshValues() {
    var r = $("#slider_red").slider("value");
    var g = $("#slider_green").slider("value");
    var b = $("#slider_blue").slider("value");
    $("#red_in").attr("value",r);
    $("#green_in").attr("value",g);
    $("#blue_in").attr("value",b);
    var red = r.toString(16), green = g.toString(16), blue = b.toString(16);
    if (red.length == 1) { red = "0" + red; }
    if (green.length == 1) { green = "0" + green; }
    if (blue.length == 1) { blue = "0" + blue; }
    var color = "#" + red.toUpperCase() + green.toUpperCase() + blue.toUpperCase();
    $("#second_swatch").css("background-color",color);
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

