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
      date,
      time_begin,
      // Color mixings
      letters = '0123456789ABCDEF',
      fs_color,
      // Extra credit
      game_on = true;
  
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
  }
  
  // Calculates the expected difference between two values
  function getPercentOff(act, exp) {
    return act == exp ? 0.00 :(Math.abs(exp - act) / 255) * 100;
  }
  
  // Calculates a score given difficulty, percent, and time
  function getScoreCalc(difficulty, percent, time) {
    return Math.abs(((15 - difficulty - percent) / (15 - difficulty)) * max_seconds - time);
  }
  
  // Gets the string to display a percent score in #message
  function getScoreMessage(pre, amount, noit) {
    return "<strong>" + pre + "</strong>: " + amount.toFixed(2) + "%" + (noit ? "<em>" : "") + (noit ? "</em>" : "") + "<br />\n";
  }
  
  // Input guesser function
  function setCheck() {
    $("#check").click(function(){
      // If there isn't a game, save stats
      if(!game_on) {
        $("#lastscorebox").html($("#overallscorebox").html());
        localScoreSave($("#namesave")[0].value, difficulty, max_turns, total_score);
        $("#overallscorebox").text("N/A");
        $("#check").text("Got it!");
      }
      game_on = true;
      
      // If the game isn't over yet, make a guess
      if(turn < max_turns) {
        ++turn;
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
            avg = (percent_red + percent_green + percent_blue) / 3,
            time_taken = new Date() .getTime() - time_begin,
            // Calculated scores
            score_red = getScoreCalc(difficulty, percent_red, time_taken),
            score_green = getScoreCalc(difficulty, percent_green, time_taken),
            score_blue = getScoreCalc(difficulty, percent_blue, time_taken),
            score_avg = (score_red + score_green + score_blue) / 3;
        // Now that the scores have been calculated, put them in the message box
        $("#message").html("Percent Error: " + avg.toFixed(2) + "%<br />\n" + 
                           getScoreMessage("R", percent_red) +
                           getScoreMessage("G", percent_green) +
                           getScoreMessage("B", percent_blue));
      }
      // Otherwise the game has finished, reset
      else {
        turn = 0;
        turns = max_turns;
        fs_color = generateColor();
        refreshValues();
        $("#message").html("");
        // Let the user know what the scores are
        $("#overallscorebox").html(total_score);
      }
      
      // Inform the user how many turns are left
      var turns = max_turns - turn;
      // If there actually are turns, inform about the game state
      if(turns > 0) {
        // If they've gotten it exactly, they've won!
        if (percent_red == 0.00 && percent_green == 0.00 && percent_blue == 0.00)
          $("#message").html("Congratulations! You win!");
        // Otherwise let them know to keep going
        else {
          $("#message").append("<br />Turns Left: " + turns);
          $("#check").html("Got it!");
        }
      }
      // Otherwise there's nothing left.
      else {
        $("#message").append("<br />No turns left.");
        // Make sure the score average is positive (why?)
        if (score_avg < 0)
          score_avg = 0;
        total_score += score_avg;
        // Switch over the visual displays
        $("#overallscorebox").html(total_score);
        // Give the user a save form
        giveUserSaveForm();
        game_on = false;
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
  date = new Date();
  time_begin = date.getTime();
  
  // 6. Allow the user to start guessing
  setCheck();
  
  
  /* Extra Credit
  */
  
  function giveUserSaveForm() {
    // Let the clicker know this is being saved
    game_on = false;
    $("#message").html(
      "<div>What's your name?</div>\n" +
      "<input id='namesave' type='text' class='wide' value='Anonymous' />"
    );
    $("#check").text("Save!");
  }
  
  // Grabs the old scores from storage
  function localScoreRetrieve(scores) {
    return JSON.parse(localStorage.hexed);
  }

  // Adds a new score to the old ones
  function localScoreSave(name, difficulty, turns, score) {
    console.log(arguments);
    var scores,
        adder = {
            name: name,
            difficulty: difficulty,
            turns: turns,
            score: score,
            timestamp: new Date().toString()
          };
    
    // If localStorage.scores is incorrectly formatted, this will throw an error
    try { scores = localScoreRetrieve(); }
    catch(ERR) { 
      console.log("Error", ERR);
      console.log("Storage", localStorage.hexed);
      console.log("There is incorrect formatting in the old high scores.");
      scores = [];
    }
    
    if(!scores) scores = [adder];
    else scores.push(adder);
    localStorage.hexed = JSON.stringify(scores);
  }
  
  // Helper function to compare two score objects by score, then by timestamp
  function scoreSortCompare(a, b) {
    if(a.score != b.score) return a.score < b.score;
    else return new Date(a.timestamp) < new Date(b.timestamp);
  }
};

$("#tester").hexed();