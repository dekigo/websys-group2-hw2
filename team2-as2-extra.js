/*
 * Extra Credit
 */

// Loader function to put the table in the body
function localScoreLoad() {
  document.body.innerHTML = localScoreString();
}

// Grabs the old scores from storage
function localScoreRetrieve(scores) {
  return JSON.parse(localStorage.hexed);
}

// Returns an HTML string of scores
function localScoreString() {
  var scores;
  // If localStorage.scores is incorrectly formatted, this will throw an error
  try { scores = localScoreRetrieve(); }
  catch(ERR) { 
    console.log("Error:", ERR);
    console.log("Storage:", localStorage.hexed);
    return "There is incorrect formatting in the old high scores.";
  }
  
  // Sort the scores
  scores = scores.sort(scoreSortCompare);
  
  var specs = ["name", "difficulty", "turns", "score", "timestamp"],
      innerHTML = "<table id='hexed_scores'>",
      i, j, score;
  
  // Start off with a header
  innerHTML += "<tr>";
  for(i in specs) innerHTML += "<td id='" + specs[i] + "'>" + specs[i] + "</td>";
  innerHTML += "</tr>";
  
  // For each score, add a row
  for(i in scores) {
    innerHTML += "<tr>";
    score = scores[i];
    for(j in score)
      innerHTML += "<td class='" + j + "'>" + score[j] + "</td>";
    innerHTML += "</tr>";
  }
  
  return innerHTML + "</table>"
}

// Helper function to compare two score objects by score, then by timestamp
function scoreSortCompare(a, b) {
  if(a.score != b.score) return a.score < b.score;
  else return new Date(a.timestamp) < new Date(b.timestamp);
}
