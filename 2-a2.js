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

$.fn.hexed = function(settings) {
  // Initial 'member' variables
  var settings    = settings || {},
      // Gameplay, based off of settings
      difficulty  = settings.difficulty || 5,
      max_turns   = settings.max_turns || 10,
      max_seconds = 15000,
      turn        = 0,
      total_score = 0,
      // Color mixings
      letters = '0123456789ABCDEF',
      fs_color;
  
  // Creates an input container for getInitialHTML based on a particular color
  function getInputContainer(color) {
     return "<div id='input_container'>\n" +
            "  <div id='input_" + color + "'>\n" +
            "    <div id='slider_" + color + "' class='slider'></div>\n" +
            "    <div class='in_box'>\n" +
            "      <input type='text' id='" + color + "_in' value='127' />\n" +
            "    </div>\n" +
            "  </div>\n" +
            "</div>\n";
  }
  
  // Creates the initial HTMl to be manipulated later
  function getInitialHTML() {
    return "<h1>Hexed! - A jQuery Game</h1>" +
           // Initial Explanation
           "  <p>Your goal is to guess the RGB values of the swatch on the left using the sliders and the swatch on the right.</p>\n" +
           "  <p>Use the sliders or the input boxes to adjust the RGB values of the swatch on the right.</p>\n" +
           "  <p>Press the 'Got it!' button when you think you have the correct answer.</p>\n" +
           "  <p>You have a maximum of '" + max_turns + "' turns.</p>\n" + 
           // Swatches
           "<div id='swatch_container'>\n" +
           "  <div id='first_swatch' class='swatch'></div>\n" +
           "  <div id='second_swatch' class='swatch'></div>\n" +
           "</div>\n" +
           // Inputs
           getInputContainer("red") +
           getInputContainer("green") +
           getInputContainer("blue") +
           // Message & Input
           "<div id='message'></div>\n" + 
           "<button id='check'>Got it!</button>\n" +
           // Your Score
           "<div id='overall_score' class='scorekeeping'>\n" + 
           "  <h3>Your Score:</h3>\n" +
           "  <div id='overallscorebox'>N/A</div>\n" +
           "</div>\n" +
           // Score on Last Color
           "<div id='last_score' class='scorekeeping'>\n" +
           "  <h3>Score on Last Color:</h3>\n" +
           "  <div id='lastscorebox'>N/A</div>\n" +
           "</div>";
  }
  
  // Generates a random color, and resets the swatches for it
  function generateColor() {
    var color = '#', i;
    for(i = 5; i >= 0; --i)
        color += letters[Math.round(Math.random() * 15)];
    $("#first_swatch").css("background-color", color);
    $("#second_swatch").css("background-color","#7F7F7F");
    return color;
  }
  
  // Sets the visible sliders as jQuery UI elements
  function setSliders() {
    $(".slider").slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: 127,
      slide: refreshValues,
      change: refreshValues
    });
  }
  
  // Allow the text input fields to affect sliders
  function setTextInputs() {
    $("#red_in").keyup(function() {
      $("#slider_red").slider("value", this.val());
    });
    $("#green_in").keyup(function() {
      $("#slider_green").slider("value", this.val());
    });
    $("#blue_in").keyup(function() {
      $("#slider_blue").slider("value", this.val);
    });
  }
  
  // Converts '7' to '07' and the like
  function getHexString(num) {
    var val = num.toString(16);
    if(val.length == 1) val = '0' + val;
    return val;
  }
  
  // Called to allow sliders to affect input fields and the swatch
  function refreshValues() {
    var r     = $("#slider_red").slider("value"),
        g     = $("#slider_green").slider("value"),
        b     = $("#slider_blue").slider("value"),
        red   = getHexString(r),
        green = getHexString(g),
        blue  = getHexString(b),
        color = "#" + red.toUpperCase() + green.toUpperCase() + blue.toUpperCase();
    $("#red_in").attr("value", r);
    $("#green_in").attr("value", g);
    $("#blue_in").attr("value", b);
    $("#second_swatch").css("background-color", color);
    console.log("Setting it to", color);
  }
  
  // Calculates the expected difference between two values
  function getPercentOff(act, exp) {
    return act == exp ? 0.00 :(Math.abs(exp - act) / 255) * 100;
  }
  
  // Calculates a score given difficulty, percent, and time
  function getScoreCalc(difficulty, percent, time) {
    return ((15 - difficulty - percent) / (15 - difficulty)) * max_seconds - time;
  }
  
  // Input guesser function
  function setCheck() {
    $("#check").click(function(){
      // If the game isn't over yet, make a guess
      if(turn++ < max_turns) {
            // Guessed amounts
        var red = parseInt(fs_color.substr(1,2),16),
            green = parseInt(fs_color.substr(3,2),16),
            blue = parseInt(fs_color.substr(5,2),16),
            // Actual amounts
            s_red = $("#red_in").attr("value"),
            s_green = $("#green_in").attr("value"),
            s_blue = $("#blue_in").attr("value"),
            // Percent errors
            percent_red = getPercentOff(s_red, red),
            percent_green = getPercentOff(s_green, green),
            percent_blue = getPercentOff(s_blue, blue),
            avg = (percent_red + percent_green + percent_blue) / 3;
            time_taken = date.getTime() - time_begin,
            score_red = getScoreCalc(difficulty, percent_red, time_taken),
            score_green = getScoreCalc(difficulty, percent_green, time_taken),
            score_blue = getScoreCalc(difficulty, percent_blue, time_taken),
            score_avg = ((15 - difficulty - avg) / (15 - difficulty)) * max_seconds - time_taken;
        $("#message").html("Percent Error: " + avg.toFixed(2) + "%<br /><i>R: " + percent_red.toFixed(2) + "%</i> <br /> <i>G: " + percent_green.toFixed(2) + "%</i> <br /> <i>B: " + percent_blue.toFixed(2) + "%</i>");
      }
      else {
        turn = 0;
        turns = max_turns;
        fs_color = generateColor();
        refreshValues();
        $("#message").html("");
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
        if (score_avg < 0) {
          score_avg = 0;
        }
        total_score += score_avg;
        $("#overallscorebox").html(total_score);
        $("#lastscorebox").html(score_avg);
        $("#check").html("Next Color");
      }
    });
  }
  
  
  /* Main function
  */
  
  // 1. Create the base HTML
  this.html(getInitialHTML());
  
  // 2. Generate and visualize a random color
  fs_color = generateColor(); 
  
  // 3. UI-tize the sliders
  setSliders();
  
  // 4. Set the text input fields
  setTextInputs();
  
  // 5. Start the time
  var date = new Date();
  var time_begin = date.getTime();
  
  // 6. Allow the user to start guessing
  setCheck();
};

$("#tester").hexed();