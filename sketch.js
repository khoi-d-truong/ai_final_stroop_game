// The array of 4 square objects
let four_square;
// Scores for right and wrong answers
let correct_score, wrong_score;
// Time in between turns
MAX_TIME = 4;
let turn_time = MAX_TIME;
// Array to keep track of right and wrong answers to use as training data
let game_data;

// Keep track of location within file
let count = 0;
// Different screen at the start of the game
let opening_screen = true;

// Check to see if they want to play trained game or not
let ai_trained = false;
// For reading the file for pretrained answers
let ai_trained_strings = [];

// Marks true once game has ended
let game_over = false;

// Array of background colors
let background_colors =
[
  "beige",
  "azure",
  "aliceblue",
  "floralwhite",
  "lavender",
  "ivory",
  "lemonchiffon",
  "moccasin",
]

// Array of colors
let colors = 
[
  "blue",
  "red",
  "green",
  "yellow",
  "orange",
  "pink",
  "purple",
  "gray",
  "brown",
  "black"
];

// Array of Fonts
let fonts = 
[
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Arial",
  "Verdana",
  "Tahoma",
  "Impact",
  "Courier New",
  "Courier",
  "Comic Sans",
  "Sans-Serif"
];

// Randomly chose one of the 4 square to be correct
let answer = getRandomInt(4);

function preload()
{
  // Filling the array with tile objects
  four_square =
  [
    s1 = new tile(0,0),
    s2 = new tile(200,0),
    s3 = new tile(0,200),
    s4 = new tile(200,200)
  ];

  game_data = [];

  // Setting one of the tiles to the correct answer
  four_square[answer].correct = true;
  
  // Setting scores to 0
  correct_score = wrong_score = 0;

  // Reading the pretrained answers file
  ai_trained_strings = loadStrings("generated_answers.txt")

  
  
}

function setup() {
  createCanvas(800, 400);
  // Formatting text file
  format_ai_trained_strings()

  
}

function draw() {
  background(250);

  // Show Opening Screen
  if (opening_screen)
  {
    push();
    background(150)
    textSize(36)
    textAlign("center")
    fill("black")
    text("Welcome to AI Stroop Test", width/2, 100)
    pop()

    push()
    
    textSize(24)
    textAlign("center")
    text("Press the space bar to start an ai-trained version of the game", width/2,200)
    text("Press the enter button to play a randomized version", width/2,300)
    pop()
  }

  // Play the game
  else if (!game_over)
    {
    playGame();
  }

  // Display the results
  if (game_over)
  {
    background(150)
    textSize(24)
    textAlign("center")
    text("Correct : " + correct_score, width/2,200);
    text("Incorrect : " + wrong_score, width/2,250);
  }
}

function playGame()
{
    
    // Drawing four squares
    draw_squares();

    // Drawing info on the right
    push();
    textAlign("center");
    textStyle("bold");
    textSize(24);
    text("Pick the Tile that Matches!", 600,75);
  
    text("Correct : " + correct_score, 600,200);
    text("Incorrect : " + wrong_score, 600,250);
    text("Time : " + turn_time.toFixed(2), 600,300);
    pop();
    
    // Keep Track of the turn time
    turn_time -= deltaTime / 500;
    // If time runs out
    if (turn_time <=0){
      wrong_score++;
      input_result = [];
      input_result.push(four_square[answer].info(),"0")
      game_data.push(input_result)
      reset();
    }
}

// Formatting the text file
function format_ai_trained_strings()
{ 
  ai_trained_strings= ai_trained_strings.slice(1)
  
  for (i = 0; i < ai_trained_strings.length; i++)
  {
    ai_trained_strings[i] = ai_trained_strings[i].replace(/\t/g,"/")
  }

}

// Class of the tile
// Contains a background color, a color, font color, and font
// If selected as correct answer, color and font color will match
class tile
{
  constructor(x,y)
  {
    this.x = x;
    this.y = y;
    this.correct = false;
    this.back_color = pickBackgroundColor();
    this.word = pickColor();
    this.word_color = pickColor();  
    this.font = pickFont();  

  }

  // Draw the tile
  draw()
  {
    // Make sure that incorrect tiles have different color and font color
    if (!this.correct)
      {
        while(this.word == this.word_color) this.word = pickColor();
      }
      // Make sure that correct tile have same color and font color
      else
      {
        this.word = this.word_color;
      }

    push()
    fill(this.back_color);
    strokeWeight(4);
    square(this.x,this.y,200);
    pop();

    push();
    textAlign("center");
    textSize(36);
    textFont(this.font)
    stroke(0);
    strokeWeight(4);
    fill(this.word_color);
    text (this.word,this.x+100,this.y+100);
    pop();
    

  }

  // Reassign values to tile
  reshuffle(assign)
  {

    this.back_color = assign[0];
    this.word = assign[1];
    this.word_color = assign[2];
    this.font = assign[3];
    this.correct = assign[4];
    
  }

  // Returns values within the tile
  info()
  {
    return [this.back_color,this.word,this.word_color,this.font]
  }

}

// Function to get values to send to tile
function assignment (correct_flag)
{
  // If ai_trained was selected, use info from trained text file
  if (ai_trained)
  {
    var s = ai_trained_strings[count];
    s = s.split('/');
    // Set final value to false instead of a string that says "0"
    s[4] = 0
    count++;

    // If correct, set final value to true instead of a string
    if (correct_flag)
    {
      s[4] = 1;
    }
    // Make sure that color and font colors don't match for incorrect answers
    else if (s[1] === s[2])
      {
         s[1] = pickColor();
        } 
    return s;
  }

  // Otherwise, pick random values
  else
  {
    b_color = pickBackgroundColor();
    w = pickColor();
    w_color = pickColor();
    font = pickFont();
    if (correct_flag) w = w_color;
    return [b_color,w,w_color,font,correct_flag];
  }
}

// Helper random int value
function getRandomInt(max)
{
  return Math.floor(Math.random() * max);
}

// Get random color
function pickColor()
{
  return colors[getRandomInt(colors.length)]
}

// Get random background color
function pickBackgroundColor()
{
 return background_colors[getRandomInt(background_colors.length)]
}

// Get random font
function pickFont()
{
  return fonts[getRandomInt(fonts.length)]
}

// Draws 4 tiles
function draw_squares()
{
  
  for (i = 0; i < four_square.length; i++)
  {
    four_square[i].draw();
  }
  
}

// Every turn, reset the 4 tiles
function reset()
{
  // Pick a random tile to set to correct
  answer = getRandomInt(4)
  for (i = 0; i < four_square.length; i++) four_square[i].reshuffle(assignment(answer === i));
  turn_time = MAX_TIME;

  //Once the goal score is reached, download data and end game
  if (correct_score + wrong_score === 100)
    {
      let writer = createWriter("gameDataForTraining.txt");
      for (i = 0; i < game_data.length; i++)
        writer.print(game_data[i]);
      writer.close();
      game_over = true;
    }
    
}

// if playing a trained game
function startGameTrained()
{
  ai_trained = true;
  opening_screen = false;
  
}

// if playing a random game
function startGameUntrained()
{
  ai_trained = false;
  opening_screen = false;
  
}

// Upon a key being pressed
function keyPressed()
{
  console.log(keyCode)
  /**
   * 4 = 100
   * 5 = 101
   * 1 = 97
   * 2 = 98
   */

  // Check only for space bar or enter
  if (opening_screen)
  {
    if (keyCode === 32) startGameTrained()
    if (keyCode === 13) startGameUntrained()

  }

  // Check only for 4,5,1,2 on the numpad
  if ((keyCode === 100 || keyCode === 101  || keyCode === 98 || keyCode === 97) && !game_over)
  {
    let input_result = [];
    switch(keyCode)
  {
    case 100:
      if (answer === 0) 
        {
          correct_score ++;
          input_result.push(four_square[0].info(),"1");
        }
      else
        { 
          wrong_score ++;
          input_result.push(four_square[0].info(),"0");
        }
      reset()
      break;
    case 101:
      if (answer === 1) 
        {
          correct_score ++;
          input_result.push(four_square[1].info(),"1");

        }
      else 
        {
          wrong_score ++;
          input_result.push(four_square[1].info(),"0");

        }
      reset()
      break;
    case 97:
      if (answer === 2) 
        {
          correct_score ++;
          input_result.push(four_square[2].info(),"1");

        }
      else 
      {
        wrong_score ++;
        input_result.push(four_square[2].info(),"0")
      }
      reset()
      break;
    case 98:
      if (answer === 3) 
        {
          correct_score ++;
          input_result.push(four_square[3].info(),"1")
        }
      else 
      {
        wrong_score ++;
        input_result.push(four_square[3].info(),"0")
      }
      reset()
      break;
  }
  // add result to an array of all choices made
  game_data.push(input_result)

  }

  
}

