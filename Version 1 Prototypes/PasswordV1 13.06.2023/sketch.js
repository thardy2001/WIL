/* # = Done
Objectives:
 # Data Structure for Blocks
 # Draw Line
 # Draw Blocks
 # Prevent Blocks From Overlaping
 # Enlarge Currently Draged Blocks Using An Offset Attached to Repeling Force 
 # Place Blocks On Line
 # Determine Order of Placed Blocks
 # Compare Order of Blocks to Correct answer
 - Colour Blocks according to correct placement
   * Track if the block has been tried
   * change colour accordingly
 - Switch Case on Hovered Blocks (must be disableable when case isn't a thing on easy mode)
   # Draw Triangle Above First Letter
   # Detect Triangle Pressed (accuracy too low)
   # Switch Letter Case
*/



class Button{
  constructor(t,x,y,w,h, action){
    this.t = t;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.hovered = false;
    this.action = action;
    this.disabled = true;
  }
  Display(){
    stroke(1);
    if(this.hovered){fill(160)} else{fill(255)}
    rect(this.x, this.y, this.w,this.h);
    fill(0);
    text(this.t, this.x + this.w/8, this.y + this.h/2 +4 ); // +4 to adjust to center due to character height   
  }
  Pressed(){
    if(!this.disabled){this.action();}
    
  }
  Update(){
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h)// Mouse in block
    {
      this.hovered = true;
    } else{this.hovered = false;}
  }
}
class Block {
  constructor(a, x, y)
  {
    this.x = x;
    this.y = y;
    
    this.offsetx = 1;
    this.offsety = 5; // Aura around block to push away other blocks
    
    this.text = a;
    
    this.clickedx = 0;
    this.clickedy = 0;
    
    this.w = this.text.length *8; // adjust width to fit the text it contains
    this.h = 40;
    
    this.colour = color(255,255,255);
    this.colourstate = 0;
    this.dragged = false;
    this.hovered = false;
    this.placed = false;
    this.order = null;
    
  }
  Display()
  {
    stroke(1);
    fill(this.colour);
    beginShape();
    vertex(this.x,this.y);
    vertex(this.x + this.w, this.y);
    vertex(this.x + this.w + 3, this.y + this.h/2);
    vertex(this.x + this.w, this.y + this.h);
    vertex(this.x, this.y + this.h);
    vertex(this.x + 3, this.y + this.h/2)
    vertex(this.x,this.y);
    endShape();
    
    fill(0);
    text(this.text, this.x + this.w/8 + 2, this.y + this.h/2 +4 ); // +4 to adjust to center due to character height
    
    if(this.hovered && match(this.text[0],'[a-zA-Z]') && capitalsActive) // Can only captitalise letters (not numbers or special characters)
    {
      fill(0);
      triangle(this.x + this.w/2 - 4, this.y + this.h/2 -9 , this.x + this.w/2 + 6, this.y + this.h/2 -9 , this.x + this.w/2 + 1, this.y + this.h/2 -14 )
      
    }
  }
  Pressed(){

    if(caseTrianglePressed(this) && capitalsActive && match(this.text[0],'[a-zA-Z]')) // Click on case triangle 
    {
      PlaySound(changecaseclicksound)
      
      //Switch Case
      if(this.text.charAt(0) == this.text.charAt(0).toUpperCase()) // Lower --> Upper
      {
        this.text = this.text.charAt(0).toLowerCase() + this.text.slice(1);
      }else          // Upper --> Lower
      {
          this.text = this.text.charAt(0).toUpperCase() + this.text.slice(1);
      }
    } 
    else
      {
        if (this.hovered) 
        { 
          this.clickedx = (this.x-mouseX);
          this.clickedy = (this.y -mouseY);
          this.dragged = true;
        }
      }
  }
  Released(){
    this.dragged = false;
    if(this.y < lineheight)
    {
      this.y = lineheight - this.h;
      this.placed = true;
      PlaySound(clicksound)
    }
    else
    {
        this.placed = false;
        this.order = null;

    }
  }

  Update(){
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h)// Mouse in block
    {
      this.hovered = true;
    }
    else
    {
      this.hovered = false;
    }
    
    if(this.dragged)
    {
      this.x = mouseX + this.clickedx; // Adjust so mouse "grabbing" the center of the block
      this.y = mouseY + this.clickedy; // Adjust so mouse "grabbing" the center of the block
    }
    
    
    if(this.placed && !this.dragged)
    {
      this.y = lineheight - this.h;

      if(this.x < 60){this.x = 60;} if(this.x + this.w >440){this.x = 440 - this.w}
    }
    
    if(this.x <0){this.x = 0} if(this.x + this.w> width){this.x = width - this.w} // Canvas Boundary
    if(this.y <0){this.y = 0} if(this.y + this.h> height){this.y = height - this.h} // Canvas Boundary
    
  }
}

// List of possible passwords
let passwords = 
    [
       ["explosions","are","cool", "!"],
       ["doe","dog","lemon"],
       ["jack","2001"],
       ["mary","poppins","kyle"],
       ["qwerty", "1", "2", "3"],
       ["jane","ruby","samantha","saphire"],
       ["David","Miller", "fish"],
       ["james","A.","1919"],
       ["28","1999", "Walker"],
       ["David", "Hicks"],
       ["Ann J.", "John"]
      
    ]
let clues = 
    [
      "John is a profesional stunt driver.He and his wife Sophie\nlove it when things go Bang! ",
      "Lemon is the oldest among the many dogs adopted by the the Doe family",
      "James second child was born in 2004, Three years after their first born Jack",
      "Markus has a 3 year old son Kyle loves the story of Mary Poppins",
      "Mary is old, lazy, and doesn't have a great memory",
      "Janes older sister sam loves the colour blue while she likes red",
      "David Miller favourite food is fish",
      "James has the middle name Anthony. He was born in 1919",
      "Ms Walker was born in 1999 was born on the 28th of june",
      "The pilot David's last name is Hicks",
      "Ann named her son after her husband. his name is john"
    ];
let blocks = []; // Currently existing blocks to interact with 

//Filler blocks
let data = ["1","2", "3", "4", "5", "6", "7", "8", "9", "10", "23", "76", "!", "?", "R.", "A.", "M.","L.", "123", "qwerty", "thomas", "blahblah" ]; // Slices of text from password to use
let filler = []; // the blocks to be spawned at the begining of each round
let answer = []; // correct answer

let entry = []; // Current order for password

let lineheight = 200;// The line where blocks are placed
let minblockheight;
let maxblockheight;
let clue = "";
let correct = false;
let guesses = 5;
let clicksound;
let changecaseclicksound;
let buttons = [];
let capitalsActive = true;
let charcount = 0;
let Submit = function() {
  if(!correct){
    guesses-=1;
    correct = CompareAnswer();
    UpdateBlockColours();   
  }

}
let Next = function(){
  correct = false; 
  guesses = 5; 
  blocks = []; 
  NewGame();
}

let submitButton = new Button("SUBMIT", 350,lineheight +15, 55, 15, Submit);
let nextButton = new Button("NEXT", 430, lineheight + 15, 50, 15, Next);

function ArrayRemove(a,index){
  let newarray = [];
  for(let i = 0; i < a.length; i++){
    if(i != index){
      newarray.push(a[i]);
    }
    else{continue;}
  }
  return newarray;
  
}

function CharCount(a){
  let c = 0;
  for(let i = 0; i < a.length; i ++)
    {
      c += a[i].length;
    }
  return c;
}
function caseTrianglePressed(block){
  if (abs((block.x + block.w/2 + 1) - mouseX) <6 && abs((block.y + block.h/2 - 11) - mouseY) < 5){return true;}
  return false;
}
function NewGame(){
  buttons[0].disabled = false; buttons[1].disabled = true; // submit then next buttons start states
  
  // Choose a password
  let rand = int(random(0,passwords.length));
  answer = passwords[rand];
  clue = clues[rand];
  charcount = CharCount(answer);
  arrayCopy(data,filler,data.length)
  for(let i = 0; i < answer.length;i++)// Remove password parts from filler list
  {
    filler = ArrayRemove(filler, filler.indexOf(answer[i])); // Remove duplicates of answers
  }
  
  // Create blocks using answer
  for(let i =0; i < answer.length;i++)
    {
      if(answer[i].charAt(0) == answer[i].charAt(0).toUpperCase()) // Lower --> Upper
      { // Lower the case
        let decaped = answer[i].charAt(0).toLowerCase() + answer[i].slice(1);   
        blocks.push(new Block(decaped, random(30,width - 30),random(minblockheight, maxblockheight))); 
      } else{blocks.push(new Block(answer[i], random(30,width - 30),random(minblockheight, maxblockheight)));}
      
    }
  
  // Choose some filler
  for(let i = 0; i < int(random(5,9)); i++){
    let newblock = random(filler);
    blocks.push(new Block(newblock, random(30,width - 30),random(minblockheight, maxblockheight)));
    filler = ArrayRemove(filler, filler.indexOf(newblock)); // Remove duplicates of answers
  }
  
}

function setup() {
  createCanvas(500, 500);
  textFont('Monospace');
  minblockheight = 350;
  maxblockheight = height - height / 3;
  buttons.push(submitButton); buttons.push(nextButton);
  clicksound = loadSound("sound/click.mp3")
  changecaseclicksound = loadSound("sound/changecaseclick.mp3")
  
  // Put into the data array the blocks that make up the passwords without duplicates and all lower case
  for(let i = 0; i < passwords.length;i++){
    for(let j = 0; j < passwords[i].length; j++){
      if(!(data.includes(passwords[i][j]) || data.includes(passwords[i][j].charAt(0).toLowerCase() + passwords[i][j].slice(1)) ) ){
      if(passwords[i][j].charAt(0) == passwords[i][j].charAt(0).toUpperCase()) // Lower --> Upper
      { // Lower the case
        let decaped = passwords[i][j].charAt(0).toLowerCase() + passwords[i][j].slice(1);   
        data.push(decaped); 
        
      }else{data.push(passwords[i][j]);}
         
      }
      
    }
  }
  NewGame();

}

function draw() {
  background(220);
  if(capitalsActive){text("Capital Letters May Be Needed", 200, 20);}
  if(nextButton.disabled == true){
    text(clue, 30, 100);
    text("Number of Characters: " + charcount, 25, 40);
    
  }
  strokeWeight(3);
  line(60,lineheight,440,lineheight) // Line to place blocks
  line(250,lineheight - 10, 250,lineheight + 10)
  
  line(0,minblockheight - 80,width,minblockheight -80) // Line to seperate block storage to placement
  strokeWeight(1);
  text("Remaining Guesses: " + guesses, 20,20)
  for(let i =0; i < blocks.length;i++)
  {
    Drift(blocks[i]);
    blocks[i].Update();
    blocks[i].Display();
  }
  
  for(let i = 0; i < buttons.length; i++){
    buttons[i].Update();
    if(!buttons[i].disabled ){
      buttons[i].Display();
    }
  }
  if(correct)
  {
    submitButton.disabled = true;
    nextButton.disabled = false;
    text("Success", width/2, 100);
  }
  if(!correct && guesses <=0){
    submitButton.disabled = true;
    nextButton.disabled = false;
    text("Failure", width/2, 100);
    
  }

  
}
function PlaySound(s)
{
  s.stop();
  s.play();
}
function UpdateBlockColours(){
  
  for(let i = 0; i < blocks.length;i++){
    if(entry.includes(blocks[i].text)){ // Is on the table
      blocks[i].colour = color(255,255,255);
      if(answer[blocks[i].order] == blocks[i].text)// correct
      {
        blocks[i].colour= color(0,255,0);
        blocks[i].colourstate = 4;
        
      } else if(answer.includes(blocks[i].text) || 
                answer.includes(blocks[i].text[0].toUpperCase() + blocks[i].text.substring(1,blocks[i].length)) ||                                   answer.includes(blocks[i].text[0].toLowerCase() + blocks[i].text.substring(1,blocks[i].length)) )// is in the answer
      {
        blocks[i].colour = color(255,255,0);
        blocks[i].colourstate = 3;
      } else //incorrect
      {
        blocks[i].colour = color(255,0,0);
        blocks[i].colourstate = 1;
      } 
      
    }
  }
}
function CompareAnswer(){
  if(entry.length == answer.length){
    for(let i = 0; i < answer.length; i++){
      
      if(entry[i] !== answer[i])
      {
        
        return false;
      }
    }
    return true;
  }
  return false;
}
function CalculateOrder(){
  entry = [];
  let locations = []; 
  for(let i = 0; i < blocks.length;i++){
    if(blocks[i].placed){locations.push(blocks[i].x);}
  }
  
  let sortedlocations = sort(locations,locations.length); // Sort placed blocks according to the x value (to see who is furthest left)
  
  let offset = 0; // for snapping blockstogether
  let shift = 0;
  let entryblocks = [];
  
  for(let i = 0; i < sortedlocations.length;i++){ // reconvert sorted locations to their corresponing text
    for(let j = 0; j < blocks.length;j++){
      if(blocks[j].x == sortedlocations[i])
      {
        entry.push(blocks[j].text);
        entryblocks.push(blocks[j]);
        offset+=blocks[j].w - blocks[j].offsetx;
        blocks[j].order = i;
      }
    }
  }
  if(entryblocks.length != 0){
    entryblocks[0].x = 250 - offset/2;
    for(let i = 1; i < entryblocks.length;i++){
      entryblocks[i].x = entryblocks[i-1].x + entryblocks[i-1].w - entryblocks[i].offsetx;

    }
  }
  


}
function Touching(A, B){

  if((A.x < B.x + B.w + B.offsetx && B.x < A.x + A.w + A.offsetx && A.y < B.y + B.h + B.offsety && B.y < A.y + A.h + A.offsety) ){return true;}
}

function Drift(A){
    for(let j = 0; j < blocks.length;j++)
      {
        if(blocks[j] != A)
          {
            if(Touching(A, blocks[j]))
              { // Push away touching blocks
                
                let dirx = 0;
                let diry = 0;
                if((blocks[j].x - A.x) < 1){dirx = -1;}
                if((blocks[j].x - A.x) > 1){dirx = 1;}
                if((blocks[j].y - A.y) < 1){diry = -1;}
                if((blocks[j].y - A.y) > 1){diry = 1;}

                blocks[j].x+=dirx * 2;
                blocks[j].y+=diry * 2;
                Drift(blocks[j]); // push the pushed block in case it is pushed into another block. Allows slideing
              }
          }
      }
    
}
function mousePressed() {
  for(let i = 0; i < blocks.length;i++)
    {
      if(blocks[i].hovered){blocks[i].Pressed();}  
    }
  if(submitButton.hovered){submitButton.Pressed();}  
  if(nextButton.hovered){nextButton.Pressed();}
  
}

function mouseReleased() {
  for(let i = 0; i < blocks.length;i++)
    {
      if(blocks[i].hovered){blocks[i].Released();}
    }
  CalculateOrder();
}