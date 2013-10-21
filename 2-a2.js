/* -------------------------
 * Hexed! - a jQuery plugin
 * Assignment 2
 * -------------------------
 * ITWS 2110 / CSCI xxxx
 * Web Systems Development I
 * Group 2
 * -------------------------
 * T.J. Callahan
 * Josh Goldberg
 * Evan MacGregor
 * Candice Poon
 * Scott Sacci
 * -------------------------
 */

/*
  Be sure to include a link to the jQuery API (as well as this plugin) at the beginning of your HTML!
*/

(function( $ ) {
  var difficulty;
  var max_turns;
  var max_seconds;
  var turn;
  var fs_color;
  function setupGame() {
    difficulty = 5;
    max_turns = 10;
    max_seconds = 20000;
    turn = 0;
    var header = '<title>Hexed!</title>';
    header += '<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>';
    header += '<link href="http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,400,300,600" rel="stylesheet" type="text/css" />';
    header += '<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />';
    header += '<link rel="stylesheet" type="text/css" href="2-a2.css">';
    $("head").append(header);
    var setup = '<h1>Hexed! - A jQuery Game</h1>';
    setup += '<h3>Instructions:</h3><div id="instructions">';
    setup += '<div>Your goal is to guess the RGB values of the swatch on the left using the sliders and the swatch on the right.</div>';
    setup += '<div>Use the sliders or the input boxes to adjust the RGB values of the swatch on the right.</div>';
    setup += '<div>Press the "Got it!" button when you think you have the correct answer.</div>';
    setup += '<div>You have a maximum of ' + max_turns + ' turns.</div></div><br />';
    setup += '<div id="swatch_container"><div id="first_swatch" class="swatch"></div>';
    setup += '<div id="second_swatch" class="swatch"></div></div>';
    setup += '<div id="input_container"><div id="input_red">';
    setup += '<div class="slider" id="slider_red"></div>';
    setup += '<div class="in_box"><input type="text" id="red_in" value="127" /></div></div>';
    setup += '<div id="input_green"><div class="slider" id="slider_green"></div>';
    setup += '<div class="in_box"><input type="text" id="green_in" value="127" /></div></div>';
    setup += '<div id="input_blue"><div class="slider" id="slider_blue"></div>';
    setup += '<div class="in_box"><input type="text" id="blue_in" value="127" /></div></div></div>';
    setup += '<div id="message"></div><button id="check">Got it!</button>';
    document.write(setup);
  }
  function generateColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    $("#first_swatch").css("background-color",color);
    $("#second_swatch").css("background-color","#7F7F7F");
    return color;
  }
  /* Allow Sliders to Affect Input Fields and Second Swatch */
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
  /* Run Setup Function to Create Base HTML Document */
  setupGame();
  /* Create Sliders */
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
  /* Generate Random Color */
  fs_color = generateColor();
  /* Allow Input Fields to Affect Sliders */
  $("#red_in").keyup(function() {
    $("#slider_red").slider("value",$(this).val());
  });
  $("#green_in").keyup(function() {
    $("#slider_green").slider("value",$(this).val());
  });
  $("#blue_in").keyup(function() {
    $("#slider_blue").slider("value",$(this).val());
  });
  var date = new Date();
  var time_begin = date.getTime();
  /* Input Guess to Check Function */
  $("#check").click(function(){
    if (turn == max_turns) {
      turn = 0;
      turns = max_turns;
      fs_color = generateColor();
      refreshValues();
      $("#message").html("");
    } else {
      turn++;
      var red = parseInt(fs_color.substr(1,2),16),
          s_red = $("#red_in").attr("value");
      var green = parseInt(fs_color.substr(3,2),16),
          s_green = $("#green_in").attr("value");
      var blue = parseInt(fs_color.substr(5,2),16),
          s_blue = $("#blue_in").attr("value");
      if (s_red != red) { var percent_red = (Math.abs(red - s_red) / 255) * 100; }
      else { var percent_red = 0.00; }
      if (s_green != green) { var percent_green = (Math.abs(green - s_green) / 255) * 100; }
      else { var percent_green = 0.00; }
      if (s_blue != blue) { var percent_blue = (Math.abs(blue - s_blue) / 255) * 100; }
      else { var percent_blue = 0.00; }
      var avg = (percent_red + percent_green + percent_blue) / 3;
      var time_taken = date.getTime() - time_begin;
      var score_red = ((15 - difficulty - percent_red) / (15 - difficulty)) * max_seconds - time_taken,
          score_green = ((15 - difficulty - percent_green) / (15 - difficulty)) * max_seconds - time_taken,
          score_blue = ((15 - difficulty - percent_blue) / (15 - difficulty)) * max_seconds - time_taken;
      $("#message").html("Percent Error: " + avg.toFixed(2) + "%<br /><i>R: " + percent_red.toFixed(2) + "%</i> <br /> <i>G: " + percent_green.toFixed(2) + "%</i> <br /> <i>B: " + percent_blue.toFixed(2) + "%</i>");
    }
    var turns = max_turns - turn;
    if (turns > 0) {
      if (percent_red == 0.00 && percent_green == 0.00 && percent_blue == 0.00) {
        $("#message").html("Congratulations! You win!");
      } else {
        $("#message").append("<br />Turns Left: " + turns);
        $("#check").html("Got it!");
      }
    } else {
      $("#message").append("<br />Turns Left: 0");
      $("#check").html("Next Color");
    }
  });
  
}( jQuery ));
