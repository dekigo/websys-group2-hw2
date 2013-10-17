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
    return color;
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
  fs_color = generateColor();
  $("#red_in").keyup(function() {
    $("#slider_red").slider("value",$(this).val())
  });
  $("#green_in").keyup(function() {
    $("#slider_green").slider("value",$(this).val())
  });
  $("#blue_in").keyup(function() {
    $("#slider_blue").slider("value",$(this).val())
  });
  $("#check").click(function(){
    var red = parseInt(fs_color.substr(1,2),16),
      s_red = $("#red_in").attr("value");
    var green = parseInt(fs_color.substr(3,2),16),
      s_green = $("#green_in").attr("value");
    var blue = parseInt(fs_color.substr(5,2),16),
      s_blue = $("#blue_in").attr("value");
    if (s_red != red) { var percent_red = ((red - s_red) / red) * 100; }
    else { var percent_red = 0.00; }
    if (s_green != green) { var percent_green = ((green - s_green) / green) * 100; }
    else { var percent_green = 0.00; }
    if (s_blue != blue) { var percent_blue = ((blue - s_blue) / blue) * 100; }
    else { var percent_blue = 0.00; }
    $("#message").html("Percent Error: R: " + percent_red.toFixed(2) + " G: " + percent_green.toFixed(2) + " B: " + percent_blue.toFixed(2));
  });
  
}( jQuery ));