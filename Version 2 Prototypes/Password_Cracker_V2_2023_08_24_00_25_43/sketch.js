/*
Authors:
  Tyler Hardy
    Student Number: C3339895
    Contacts:
      Student Email:  c3339895@uon.edu.au
      Linkedin: www.linkedin.com/in/tyler-a-hardy
*/


/*
Contains all of the information about a person that the user will use to make 
educated guesses of the goal password.


*/
class Identity{
  
  constructor(d,m,y){
    this.x = 1000;
    this.y = 200;
    this.w = 300; // should be adjustable
    this.h = 250; // should also be adjustable
    this.fname = "";
    this.lname = "";
    this.initial = "";
    
    this.birthDate = [d,m,y]; // Array of Integers
    this.birth_string = d + "/" + m + "/" + y
    this.UpdateZodiac()
    this.CalculateAge();
    
    this.interests = [];
    
    this.partner = null; // Link to another Identity
    
    this.children = [];  // Array of Identities 
    this.parents = [];   // Array of Identities
    
    this.password = []; // Array of strings -> later turned into blocks
    this.answer = ""
    this.tree = null;
  }
  
  // GET 
  // Strings
  GetName(){return this.fname + " " + this.lname;}
  // Strings
  GetFirstName(){return this.fname;}
  // Strings
  GetLastName(){return this.lname;}
  // Strings
  
  // If the birth date is changed, recalculate the age, update zodiac
  SetBirthDate(d,m,y){this.birthDate = [d,m,y];this.CalculateAge(); this.UpdateZodiac()}
  
  // String Array
  AddChild(c){c.lname = this.lname; this.children.push(c); }
  /*
  Name: CalculateAge
  Input: N/A
  Output: N/A
  Description:
    Take the currently set birthday for this Identity and calculate the age
  */
  CalculateAge(){
    // Has their birthday for this year already passed ? 
    if(month() > this.birthDate[1] || (month() == this.birthDate[1] && day() >= this.birthDate[0])){
      this.age = (year() - this.birthDate[2]);
    }else{ // Birthday hasn't passed this year yet
      this.age = (year() - this.birthDate[2] - 1);
    }  
  }
  /*
  Name: UpdateZodiac
  Input: N/A
  Output: N/A
  Description:
    Take the currently set birthday for this Identity and determine the corresponding zodiac sign.
  */
  UpdateZodiac(){
    if(this.birthDate[1] == 1){ // January
      if(this.birthDate[0] < 20){this.zodiac = "Capricorn";}
      else{this.zodiac = "Aquarius"; }
    }else if(this.birthDate[1] == 2){ // February
      if(this.birthDate[0] < 19){this.zodiac = "Aquarius";}
      else{this.zodiac = "Pisces"; }
    }else if(this.birthDate[1] == 3){ // March
      if(this.birthDate[0] < 21){this.zodiac = "Pisces";}
      else{this.zodiac = "Aries"; }      
    }else if(this.birthDate[1] == 4){ // April
      if(this.birthDate[0] < 20){this.zodiac = "Aries";}
      else{this.zodiac = "Taurus"; }       
    }else if(this.birthDate[1] == 5){ // May
      if(this.birthDate[0] < 21){this.zodiac = "Taurus";}
      else{this.zodiac = "Gemini"; }       
    }else if(this.birthDate[1] == 6){ // June
      if(this.birthDate[0] < 21){this.zodiac = "Gemini";}
      else{this.zodiac = "Cancer"; }       
    }else if(this.birthDate[1] == 7){ // July
      if(this.birthDate[0] < 23){this.zodiac = "Cancer";}
      else{this.zodiac = "Leo"; }       
    }else if(this.birthDate[1] == 8){ // August
      if(this.birthDate[0] < 23){this.zodiac = "Leo";}
      else{this.zodiac = "Virgo"; }       
    }else if(this.birthDate[1] == 9){ // September
      if(this.birthDate[0] < 23){this.zodiac = "Virgo";}
      else{this.zodiac = "Libra"; }       
    }else if(this.birthDate[1] == 10){ // October
      if(this.birthDate[0] < 23){this.zodiac = "Libra";}
      else{this.zodiac = "Scorpio"; }       
    }else if(this.birthDate[1] == 11){ // November
      if(this.birthDate[0] < 22){this.zodiac = "Scorpio";}
      else{this.zodiac = "Sagittarius"; }       
    }else if(this.birthDate[1] == 12){ // December
      if(this.birthDate[0] < 22){this.zodiac = "Sagittarius";}
      else{this.zodiac = "Capricorn"; }      
    }
      
  }
  

  GeneratePassword(){
    
    /*
    Common Password Patterns:
    
    Tyler2001
    TAH2023
    TylerHardy22
    TylerSarah11/11/2025
    DavidMary2023
    SarahDavidMary2023
    HardyMiller
    
    */
    let patterns = [
      [this.fname, this.lname],
      [this.fname, this.lname,str(this.age)],
      [this.fname, this.birth_string]
    ]
    if(this.partner!=null){
      patterns.push([this.fname,this.partner.fname,this.birth_string])
      patterns.push([this.fname,this.partner.fname,this.partner.birth_string])
      patterns.push([this.partner.fname,this.fname])
      patterns.push([this.partner.fname,this.fname])
      patterns.push([this.fname,this.partner.fname,this.birth_string])
      patterns.push([this.fname,this.partner.fname,this.partner.birth_string])
      patterns.push([this.partner.fname,this.fname,this.partner.birth_string])
      patterns.push([this.partner.fname,this.fname,this.birth_string])
      
      patterns.push([this.lname,this.partner.lname])
      patterns.push([this.partner.lname,this.lname])
    }
    for(let i = 0; i < this.children.length;i++){
      patterns.push([this.children[i].fname, this.children[i].birth_string])
      patterns.push([this.partner.fname,this.children[i].fname])
    }
    if(this.children.length ==2){
      patterns.push([this.children[0].fname,this.children[1].fname, str(year())])
      patterns.push([this.children[0].fname,this.children[1].fname, this.children[0].birth_string])
      patterns.push([this.children[0].fname,this.children[1].fname, this.children[1].birth_string])
    }
    
    for(let i = 0; i < patterns.length; i++){
      patterns[i].push(random(["?", "!"]))
      
    }
    
    // Convert to set and back inorder to remove duplicates
    let s = new Set(patterns)
    patterns = Array.from(s)
    
    let choice = random(patterns)
    for(let i = 0; i < choice.length;i++){
      this.answer+=choice[i]
    }
    return choice;
  }
    

  Display(){
  }
  
}

/*
Tree data structure used for the representation of the data collected in social engineering and that is used by the player to make educated guesses
*/
class Tree{
  constructor(r){
    this.levels = [[]];
    
    this.root = r; 
    

  }
  Update(){
    for(let i = 0; i < this.levels.length;i++){
      for(let j = 0; j < this.levels[i].length;j++){
        //this.levels[i][j].SpaceChildren()
       
        this.levels[i][j].UpdateAbsoluteCoords()
      }
    }


    for(let i =this.levels.length - 1; i>=0;i--){ 
      for(let j = 0; j < this.levels[i].length;j++){
        this.levels[i][j].UpdateBoundingBox()

      }
    } 
  }
  Display(){
    this.root.Display()
    /*
    for(let i = 0; i < this.levels.length;i++){
      for(let j = 0; j < this.levels[i].length;j++){
        this.levels[i][j].Display()
      }
    }
    */
  }


}

/*
Individual nodes on the tree, each representing a data point or subtree
*/
class Node{
  
  constructor(d){
    this.depth = 0;
    
    this.x = 0;
    this.y = 0;
    
    this.relative_x = 0; // Offset from its parent node
    this.relative_y = 0;
    this.data = d;

    this.w = textWidth(this.d) * 2.2 ;
    this.h = 15
    
    this.parent = null;
    this.children = []     
    

    this.bounding_x = this.x;
    this.bounding_y = this.y;
    this.bounding_w = this.w;
    this.bounding_h = this.h;
    
    this.active = false;
    
    this.hovered = false;
    
  }
  
  UpdateAbsoluteCoords(){
    if(this.parent!= null){
      this.x = this.parent.x + this.relative_x
      this.y = this.parent.y + this.relative_y
    }
  }
  Display(){
    
    push();
    
    strokeWeight(1)
    stroke(0,0,255)
    fill(100,100,255)
    ellipse(this.x,this.y,10,10);
    
    push()
    if(this.hovered){
      stroke(255);
      strokeWeight(2);
      noFill();
      ellipse(this.x,this.y,20,20)
    }
    pop()
    fill(0);
    stroke(0)
    
    textSize(15)
    text(this.data,this.x +8,this.y + 4)
    
    pop();
    stroke(0)

    noFill()
   if(this.active){
      for(let i = 0; i < this.children.length;i++){
        
        let start_x = this.x + textWidth(this.data)*1.5
        let start_y = this.y;
        let control1_x = start_x +35
        let control1_y = start_y 
        let control2_x = this.children[i].x - 50
        let control2_y = start_y + this.children[i].relative_y
        let end_x = this.children[i].x
        let end_y = this.children[i].y
        bezier(start_x,start_y,control1_x,control1_y,control2_x,control2_y,end_x,end_y)

        this.children[i].Display();
      }     
   }

    
    
    /*    CODE TO DRAW BOUNDING BOXES
    push()
    noFill()
    strokeWeight(0.5)
    fill(255 - this.depth*60, 100)
    if(this.depth == 0){stroke(255,0,0, 100)}
    if(this.depth == 1){stroke(0,255,0, 100)}
    if(this.depth == 2){stroke(0,0,255, 100)}
    
    if(this.parent!= null){
      rect(this.bounding_x ,this.bounding_y ,this.bounding_w,this.bounding_h)
    } else{
      rect( this.bounding_x ,  this.bounding_y ,this.bounding_w,this.bounding_h)
    }

    strokeWeight(1)
    pop()         
    */

    


  }
  
  UpdateDepth(tree, curr){
    if(curr == null){curr = 0;}
    this.depth = curr;
    
    if(tree != null){
      if(this.depth >= tree.levels.length){
        tree.levels.push([this])
      }else{
        tree.levels[this.depth].push(this)
      }
      
    }
    
    
    for(let i = 0; i < this.children.length;i++){
      this.children[i].UpdateDepth(tree, this.depth+1)
    }
  }
  
  UpdateBoundingBox(){
  
    
    this.bounding_x = this.x;
    this.bounding_w = this.w;
    this.bounding_y = this.y - this.h/2;
    this.bounding_h = this.h;
    
    for(let i = 0; i < this.children.length;i++){
      this.bounding_w = max(this.children[i].bounding_x+this.children[i].bounding_w,this.bounding_w)
    }
    

    if(this.children.length > 0 && this.active){
      let first_child = this.children[0]
      let last_child = this.children[this.children.length - 1]
      this.bounding_y = min(this.bounding_y, first_child.bounding_y)
      this.bounding_h = max(this.y - this.h/2 + this.h - this.bounding_y,(last_child.bounding_y + last_child.bounding_h) - this.bounding_y)
      
     
      
    }

    

    
    
  }
  
  ShiftSubTree(distance){
    
    this.relative_y+= distance;
    
  }
  
  CenterChildren(){
    if(this.children.length == 1){
      this.children[0].relative_y = 0
    }
    if(this.children.length > 1){
      let total_height = this.children[this.children.length-1].bounding_y +this.children[this.children.length-1].bounding_h -this.children[0].bounding_y
      
      let y_offset = this.relative_y  - (this.children[0].bounding_y + total_height / 2 ) 

      for(let i = 0; i < this.children.length;i++){
        this.children[i].relative_y += y_offset
        this.children[i].UpdateAbsoluteCoords() 
      }
      
    }
  }
  SpaceChildren(){ // Default Spacing
    
    
    let height_sum = 5*(this.children.length - 1); // account for a spacing of 5 so that children aren't touching
    for(let i = 0; i < this.children.length;i++){
      this.children[i].relative_x = this.w * 1.5
      
      height_sum+=this.children[i].bounding_h;
    }
    let y_offset = -height_sum/2;
    
    for(let i = 0; i < this.children.length;i++){
      this.children[i].relative_y = y_offset
      this.children[i].UpdateAbsoluteCoords()
      y_offset+=this.children[i].bounding_h + 5 // children seperated by 5 units
    }
    
    
    
  }
  
  Pressed(){
    this.active = !this.active
  }
  

}


class Button{
  constructor(t,x,y,w,h, action){
    this.t = t; // text that appears on button
    
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    this.disabled = true;
    this.hovered = false;
    
    this.action = action; // function executed when the button is pressed
    
  }
  Display(){
    push()
    
    stroke(1);
    if(this.hovered){fill(160)} else{fill(255)} // Change colour when hovered
    
    rect(this.x, this.y, this.w,this.h);
    fill(0);
    noStroke()
    text(this.t, this.x + this.w/8, this.y + this.h/2 +4 ); // +4 to adjust to center due to character height 
    
    pop()
  }
  
  Pressed(){if(!this.disabled){this.action();}}
  
  Update(){
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h)// Mouse in block
    {
      this.hovered = true;
    } else{this.hovered = false;}
  }
}

// Blocks that are picked up and moved around. Used to construct the users answers / guesses
class Block {
  constructor(content){
    this.x = random(80,750);
    this.y = random(minblockheight, maxblockheight);
    
    this.offsetx = 1;
    this.offsety = 5; // Aura around block to push away other blocks
    
    this.content = content;
    
    this.clickedx = 0; // Where on the block the mouse was clicked
    this.clickedy = 0;
    
    this.w = textWidth(this.content) * 1.6; // adjust width to fit the text it contains
    this.h = 40;
    
    this.colour = color(50,50,200,180);
    this.colour_state = 0;
    
    this.dragged = false;
    this.hovered = false;
    this.placed = false;
    
    this.order = null;
    
  }
  Display(){
    push();
    
    stroke(1);
    fill(this.colour);
    
    // Draw the fish scale like shape
    beginShape();
      vertex(this.x,this.y);
      vertex(this.x + this.w, this.y);
      vertex(this.x + this.w + 3, this.y + this.h/2);
      vertex(this.x + this.w, this.y + this.h);
      vertex(this.x, this.y + this.h);
      vertex(this.x + 3, this.y + this.h/2)
    endShape(CLOSE);
    
    // HOVER HIGHLIGHT BORDER
    if(this.hovered){
      noFill()
      stroke(255)
      strokeWeight(3)
      beginShape();
        vertex(this.x - 5,this.y - 5);
        vertex(this.x + this.w + 5, this.y - 5);
        vertex(this.x + this.w + 3 + 5, this.y + this.h/2);
        vertex(this.x + this.w + 5, this.y + this.h + 5);
        vertex(this.x - 5, this.y + this.h + 5);
        vertex(this.x + 3 - 5, this.y + this.h/2 )
    endShape(CLOSE);   
    }
    
    
    noStroke()
    if(this.colour_state != 0){fill(0);}else{fill(255)}
    text(this.content, this.x + this.w/4 , this.y + this.h/2 +4 ); // +4 to adjust to center due to character height
    // Can only captitalise letters (not numbers or special characters)
    if(this.hovered && match(this.content[0],'[a-zA-Z]') && capitalsActive)
    {
      fill(0);
      // Draw the triangle that, when pressed, capitalises the content
      triangle(this.x + this.w/2 - 4, this.y + this.h/2 -9 , this.x + this.w/2 + 6, this.y + this.h/2 -9 , this.x + this.w/2 + 1, this.y + this.h/2 -14 )
      
    }
    
    pop();
  }
  
  // Mouse pressed down on the block (pick up the block)
  Pressed(){
    
    // IF they try to capitalise
    if(CaseTrianglePressed(this) && capitalsActive && match(this.content[0],'[a-zA-Z]')) // Click on case triangle 
    {
      PlaySound(changecaseclicksound)
      
      //Switch Case
      if(this.content.charAt(0) == this.content.charAt(0).toUpperCase()) // Lower --> Upper
      {
        this.content = this.content.charAt(0).toLowerCase() + this.content.slice(1);
      }else          // Upper --> Lower
      {
          this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1);
      }
    } 
    else{
        if (this.hovered) { 
          this.clickedx = (this.x-mouseX);
          this.clickedy = (this.y -mouseY);
          this.dragged = true;
        }
      }
  }
  
  // Mouse released from the block (drop the block)
  Released(){
    this.dragged = false;
    // IF the block is placed on or above the line
    if(this.y < lineheight && this.x <= 800 && this.x > 80){
      this.y = lineheight - this.h;
      this.placed = true;
      PlaySound(clicksound)
    }
    else{
        this.placed = false;
        this.order = null;
    }
  }

  Update(){
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h){
      this.hovered = true;
    }
    else{
      this.hovered = false;
    }
    
    if(this.dragged){
      // Adjust so mouse "grabbing" the block where it was clicked and not jumping to the center
      this.x = mouseX + this.clickedx; 
      this.y = mouseY + this.clickedy; 
    }
    
    /// Drop the block onto the line
    if(this.placed && !this.dragged){
      this.y = lineheight - this.h;
    }
    
    if(this.x <0){this.x = 0} if(this.x + this.w> width){this.x = width - this.w} // Canvas Boundary
    if(this.y <0){this.y = 0} if(this.y + this.h> height){this.y = height - this.h} // Canvas Boundary
    
  }
}



// Inported Sounds
let clicksound;
let changecaseclicksound;

let current_target;
let current_tree;

// Identities
let identities = [];
let personsOfInterest = []; // all of the targets / the people that have passwords to guess.
let blocks = []; // Currently existing blocks to interact with
let filler = []; // the blocks to be spawned at the begining of each round
let answer = []; // correct answer
let entry = []; // The order the blocks are placed on the line
let buttons = [];


let characterHeight = 11 // the change in y coordinate in a text box after going to the next line down
let lineheight = 445;// The line where blocks are placed

let minblockheight = 480;
let maxblockheight = 590;



let correct = false;
let capitalsActive = true;

let guesses = 5;

// Functions executed by buttons
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


let submitButton = new Button("ENTER", 860,lineheight - 30 , 70, 30, Submit);
let nextButton = new Button("NEXT", 880, lineheight -30, 70, 30, Next);
//Filler blocks


let firstNameList = ["Darien",
                     "Shyanne","Ariel","Skyler","Janae","Amira","Cailyn","Athena","Daron","Mohammed","Korbin","Leanne","Tiffani","Tonya", "Michaela","Griffin","Harrison","Beverly","Easton","Jensen", "Samantha", "Jackie", "Arnold", "Ben", "Kyle", "Justin", "Mary", "Jenny", "Kate", "Tess", "Kylie", "Millie", "Tyson", "Taylor"];

let lastNameList =["Winkler",
                   "Hulsey","Lehmann","Han","Hand","Arreola","Ma","Bowles","Donnelly","Monahan",  "Littleton","Razo","Samson","Faircloth","Deaton","Huerta","Locke","McFadden","Bush","Graff", "Forman", "Smith", "Doe", "Carpenter", "Rich", "Wild", "Hunter", "Minx", "Malfoy", "Potter", "Weasly", "Dell", "Gates", "Digger", "Maxim", "Maximoff","Quell", "Little", "Henderson", "Juble", "Marks", "Quick", "Stone"];

let interestsList = ["Video Games",
                     "Board Games", "Football", "Rugby", "AFL", "Soccer", "Golf", "Curling", "Gym", "Fitness", "Gardening", "Husbandry","Equestrianism","Animals","Painting", "Tattoos", "Warhammer 40k", "Books", "Movies", "T.V", "Netflix", "Sweets", "Baking", "Sailing", "Fishing", "Racing", "Mini-golf", "Escape Rooms", "Chess", "Cannoe", "Singing", "Dancing", "Music", "Piano", "Parties", "Pub Crawl", "Motorcycles", "Cars", "Fantasy", "Dragons", "Anime", "Manga", "Dinosaurs", "War", "History", "Technology", "Science", "Mathematics", "Robotics", "Weightlifting", "Weight loss", "Travel", "Aircraft", "Geography", "Languages", "Geology", "Explosives", "Guns", "Firearms", "Arson", "Crime", "Drama", "Romance", "Dining", "Chocolate", "Cartoons", "Drinking", "Wine", "The Witcher", "Sherlock Holmes", "Harry Potter", "Hunger Games", "ABBA", "ACDC", "Chemicals", "Bird Watching", "Taylor Swift", "Fallout Boy", "BTS","Hannah Montana", "Animals", "BBQ", "Anti-Disestablishmentarianism", "Socialism", "Dictatorships", "Facism", "Democracy","Anarchy", "Order", "Chaos"];
let text_field_x = 80;
let text_field_y = 400;
let text_field_w = 750;
let text_field_h = 50;



// Run once before draw loop
function setup() {
  // Load the sounds
  
  clicksound = loadSound("sound/click.mp3")
  changecaseclicksound = loadSound("sound/changecaseclick.mp3")

  createCanvas(1500, windowHeight);
  
  // Add buttons to button array
  buttons.push(submitButton); 
  buttons.push(nextButton);
  
  // Fill out all of the identitites
  for(let i = 0; i < 15; i++){
    let personOfInterest = NewRandomIdentity(); // general character
    personsOfInterest.push(personOfInterest);
    //personOfInterest.SetPassword(personOfInterest.GetFirstName());
    
    //Relationships
    let chance = int(random(0,100));
    if( chance > 40){// 60% chance of having a partner
      let p = NewRandomIdentity();
      while (p.GetFirstName() === personOfInterest.GetFirstName()){
        p.fname = firstNameList[int(random(0,firstNameList.length - 1))]
      }
      identities.push(p);
      personOfInterest.partner = p;
      while(chance >=65){
        let c = NewRandomIdentity()
        while (c.fname === personOfInterest.fname || c.fname === personOfInterest.partner.fname){
          c.fname = firstNameList[int(random(0,firstNameList.length - 1))]
        }
        c.lname = personOfInterest.lname
        
        identities.push(c);
        personOfInterest.AddChild(c);
        chance-= int(random(10,30)); // This way the likelyhood of having a large number of kid is low
      }
    }
    personOfInterest.tree = GenerateTree(personOfInterest)

  }
  
  // Print out example data
  let f = personsOfInterest[0];
  // Take the blocks from the passwords from all identities and add them to the list of possible blocks to select from
  
  
  
  NewGame();

}

// Looped every frame
function draw() {
  background(200,200,220);
  
  DrawEnvironment();
  current_target.Display(current_target.x, current_target.y);
  
  push()
  fill(0)
  stroke(0)
  strokeWeight(0.4)
  textSize(25)
  text("Remaining Guesses: " +  guesses, 900,40)
  noStroke()
  pop()
  
  // Draw the board/line that blocks stick to
  strokeWeight(2)
  stroke(0)
  fill(100,180,100,250)
  rect(text_field_x,text_field_y,text_field_w,text_field_h)
  
  push()
  
  if(entry.length == 0){
    textSize(25)
    stroke(255)
    noStroke()
    
    fill(255)
    text("Enter A Password", text_field_x + text_field_w/3, text_field_y + 35)
  }
  pop()
  strokeWeight(1);
  
  // Move the blocks so that they are not overlapping
  for(let i =0; i < blocks.length;i++){
    if(blocks[i].dragged == false){Shove(blocks[i]);}
    Shove(blocks[i]);
    blocks[i].Update();
    blocks[i].Display();
  }
  
  // Update buttons and draw them if they are not disabled 
  for(let i = 0; i < buttons.length; i++){
    buttons[i].Update();
    if(!buttons[i].disabled ){
      buttons[i].Display();
    }
  }
  // Found correct password so the next button apears and submit button vanishes
  push()
  fill(0)
  stroke(0)
  textSize(25)
  if(correct){
    submitButton.disabled = true;
    nextButton.disabled = false;
    text("Success",900, 200);
  }
  
  // Ran out of guesses
  if(!correct && guesses <=0){
    submitButton.disabled = true;
    nextButton.disabled = false;
    let answer = "";
    
    text("Answer: " + current_target.answer, 900, 200);
    
  }
  pop()
  current_tree.Display()
  
  for(let i = 0; i < current_tree.levels.length;i++){
    for(let j = 0; j < current_tree.levels[i].length;j++){
      let node = current_tree.levels[i][j];
      if(abs(mouseX - node.x ) < 10 && abs(mouseY - node.y) < 10 && node.children.length>0){
        node.hovered = true;
      }else{
        node.hovered = false;
      }
    }
  }
}

function DrawEnvironment(){
  
  stroke(0)
  strokeWeight(2)
  fill(100,180,100,250)
  beginShape()
  vertex(10,10)
  vertex(840,10)
  vertex(840,330)
  vertex(700,360)
  vertex(10,360)
  
  endShape(CLOSE)
  push()
  textSize(15)
  fill(0)
  strokeWeight(0.5)
  text("Data Source:", 20,35)
  text("Social Engineering", 20,55)
  pop()
}
function mousePressed() {
  
  for(let i = 0; i < blocks.length;i++)
    {
      if(blocks[i].hovered){blocks[i].Pressed();}  
    }
  if(submitButton.hovered){submitButton.Pressed();}  
  if(nextButton.hovered){nextButton.Pressed();}
  
  for(let i = 0; i < current_tree.levels.length;i++){
    for(let j = 0; j < current_tree.levels[i].length;j++){
      let n = current_tree.levels[i][j]
      if(abs(mouseX - n.x ) < 10 && abs(mouseY - n.y) < 10 && n.children.length>0){
        n.Pressed()
        CalabrateTree(current_tree)
      }
      
    }
  }
}

function mouseReleased() {
  for(let i = 0; i < blocks.length;i++)
    {
      if(blocks[i].hovered){blocks[i].Released();}
    }
  CalculateOrder();
}

/*
Name: NewGame
Input:
  - : :
Output:
  - : :
Description:
Resets the game. New blocks, new answer. Occurs when the game first runs and after each success or failure
*/
function NewGame(){
  buttons[0].disabled = false; buttons[1].disabled = true; // submit then next buttons start states
  
  current_target = personsOfInterest.pop();
  
  current_target.password = current_target.GeneratePassword()
  
  answer = current_target.password;
  filler = [new Block("?")];
  
  filler.push(new Block(current_target.fname))
  filler.push(new Block(current_target.lname))
  filler.push(new Block(current_target.age.toString()))
  filler.push(new Block(current_target.zodiac))
  filler.push(new Block(current_target.birth_string))

  
  if(current_target.partner!=null){
    filler.push(new Block(current_target.partner.fname))
    filler.push(new Block(current_target.partner.lname))  
    filler.push(new Block(current_target.partner.birth_string))
    filler.push(new Block(current_target.partner.age.toString()))
    filler.push(new Block(current_target.partner.zodiac))

    for(let i = 0; i < current_target.children.length;i++){
      filler.push(new Block(current_target.children[i].fname))
      filler.push(new Block(current_target.children[i].age.toString()))
      filler.push(new Block(current_target.children[i].zodiac))
      filler.push(new Block(current_target.children[i].birth_string))      
    }
  }
  let random_block_count = int(random(5,min(filler.length-1,10)))
  
  let same = false;
  while(random_block_count!=0 && filler.length >=1){
    same = false;
    let random_index = int(random(0,filler.length - 1))
    
    
    for(let i = 0; i < answer.length;i++){
      if(filler[random_index].content.toLowerCase() === answer[i].toLowerCase() ){
        same = true;
        break
      }else{
        same = false;
      }
    }    
    if(!same){
      blocks.push(filler[random_index])
      random_block_count--;      
    }
    filler.splice(random_index,1)

  }
  
  
  // Create blocks using answer
  for(let i =0; i < answer.length;i++)
  {
    blocks.push(new Block(answer[i].toLowerCase()))


  }
  

  
  current_target.tree.x = 50;
  current_target.tree.y = 180;
  current_tree = new Tree(current_target.tree);
  current_target.tree.UpdateDepth(current_tree)
  
  CalabrateTree(current_tree)

}

function GenerateTree(person){
  
  let first_node = new Node(person.fname + " " + person.lname)
  
  // BIRTH
  let birth_information_node = new Node("Birth")
  birth_information_node.parent = first_node

  first_node.children.push(birth_information_node)
  
  let b_date_node = new Node(person.birth_string)
  b_date_node.parent = birth_information_node

  birth_information_node.children.push(b_date_node)
  
  let age_node = new Node(person.age)
  age_node.parent = birth_information_node

  birth_information_node.children.push(age_node)
  
  let zodiac_node = new Node(person.zodiac)
  zodiac_node.parent = birth_information_node

  birth_information_node.children.push(zodiac_node) 
  
  
  
  // INTERESTS
  if(person.interests.length >0){
    
    let interests_node = new Node("Interests")
    interests_node.parent = first_node  
    first_node.children.push(interests_node)
    
    for(let i = 0; i < person.interests.length;i++){
      
      let temp = new Node(person.interests[i])
      temp.parent = interests_node
      interests_node.children.push(temp)
    }
  }
  
  
  // PARTNER
  if(person.partner != null){
    
    let partner_node = new Node("Partner")
    partner_node.parent = first_node
    first_node.children.push(partner_node)
    
    person.partner.tree.parent = partner_node
    partner_node.children.push(person.partner.tree)
  }
  
  
  //CHILDREN
  if(person.children.length >0){
    
    let children_node = new Node("Children")
    children_node.parent = first_node
    first_node.children.push(children_node)
    
    for(let i = 0; i < person.children.length;i++){
      person.children[i].tree.parent = children_node
      children_node.children.push(person.children[i].tree)
    }
  }
  
  for(let i = 0; i < first_node.children.length;i++){
    first_node.children[i].SpaceChildren();
  }
  return first_node;
  
  
  
}

// Correctly space out the tree so that it is tidy and presentable
function CalabrateTree(t){
   // Start by spacing out the tree horizontally and vertically
  t.Update()
  for(let i =t.levels.length - 1; i>=0;i--){ 
    for(let j = 0; j < t.levels[i].length;j++){
      t.levels[i][j].SpaceChildren()
      
    }
  }
  


  for(let i =1;i < t.levels.length;i++){ 
    for(let j = 0; j < t.levels[i].length;j++){
      let curr = t.levels[i][j]
      let next = t.levels[i][min(j + 1,t.levels[i].length - 1)]

      if(curr==next){continue}
      if(curr.bounding_y + curr.bounding_h > next.bounding_y){

        let difference = curr.bounding_y + curr.bounding_h - next.bounding_y
        for(let a = t.levels[i].indexOf(next); a < t.levels[i].length; a++){
          t.levels[i][a].relative_y += difference;

        }
        
        
      }
       t.Update()
      
      
    }
  }
    
  
}


/*
Name: NewRandomIdentity
Input: 
  - : :
Output:
  - : Identitity : A newly generated Identitity object 
Description:
Returns a new Identitity with random birth date (day, month, year,age, zodiac). A random name (first,last,initial). and 0-3 random interests
All random data is drawn from lists of possible options: firstNameList, lastNameList, interestsList. A-Z list for intials
*/
function NewRandomIdentity(){
  // random birthday, name, interests, names
  
  let y = int(random(1980,year() - 10)) // minimum age of the identity  is 10
  let m = int (random(1,12))
  let d = int(random(1,MonthLength(m))) // up to the max day of that particular month
  let p = new Identity(d,m,y)
  
  let fname = firstNameList[int(random(0,firstNameList.length - 1))];
  let lname = lastNameList[int(random(0,lastNameList.length - 1))];
  let initial = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(int(random(0,25)));


  p.fname = fname // select random first name
  p.lname = lname // select random first name
  p.initial = initial; // random capital letter
  
  for(let i = 0;i < int(random(0,3)); i++){ // between 0 and 3 interests (may produce duplicates)
    p.interests.push(interestsList[int(random(0,interestsList.length -1))]);
  }

  
  p.tree = GenerateTree(p)
  return p;
}

/*
Name: UpdateBlockColours
Input:
  - : : 
Output:
  - : :
Description:
Changes the colour of the blocks on the line according to their accuracy;
GREEN  -> Correct Order
YELLOW -> Incorrect Order / Incorrect Case
RED    -> Incorrect
*/
function UpdateBlockColours(){
  
  for(let i = 0; i < blocks.length;i++){
    if(entry.includes(blocks[i].content)){ // Is on the table
      
      blocks[i].colour = color(255,255,255); // Reset to WHITE 
      
      if(answer[blocks[i].order] == blocks[i].content)// correct
      {
        
        // Change to GREEN State
        blocks[i].colour= color(0,255,0); 
        blocks[i].colour_state = 4;
        
      } else if(answer.includes(blocks[i].content) || // Is in answer
                answer.includes(blocks[i].content[0].toUpperCase() + blocks[i].content.substring(1,blocks[i].length)) ||                                                       answer.includes(blocks[i].content[0].toLowerCase() + blocks[i].content.substring(1,blocks[i].length)) )// Is in answer with diferent case
      {
        // Change to YELLOW State
        blocks[i].colour = color(255,255,0);
        blocks[i].colour_state = 3;
      } else //incorrect
      {
        // RED State
        blocks[i].colour = color(255,0,0);
        blocks[i].colour_state = 1;
      } 
      
    }
  }
}
/*
Name: CompareAnswer
Input:
  - : :
Output:
  - : Boolean : does the entered value match the correct answer / password
Description:
Returns wether or not the user has entered the correct password.
*/
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
/*
Name: CalculateOrder
Input:
  - : :
Output:
  - : :
Description:
Determine the order the blocks have been placed on the line and update the string currently constructed.Also re-adjust the x-coordinates of the blocks on the line to "snap" them back together
*/
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
        entry.push(blocks[j].content);
        entryblocks.push(blocks[j]);
        offset+=blocks[j].w - blocks[j].offsetx;
        blocks[j].order = i;
      }
    }
  }
  
  let line_middle = 415
  if(entryblocks.length != 0){
    entryblocks[0].x = line_middle - offset/2;
    for(let i = 1; i < entryblocks.length;i++){
      entryblocks[i].x = entryblocks[i-1].x + entryblocks[i-1].w - entryblocks[i].offsetx;

    }
  }
  


}

// Are the two objects touching? 
function Touching(A, B){

  if((A.x < B.x + B.w + B.offsetx && B.x < A.x + A.w + A.offsetx && A.y < B.y + B.h + B.offsety && B.y < A.y + A.h + A.offsety) ){return true;}
}

/*
Name: Shove
Input:
  - A : Block : The block being operated on / moved.
Output:
  - : :
Description:
Determine if the given block, A, is overlapping any other blocks. If so, move the other block away in the shortest direction
*/
function Shove(A){
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
                Shove(blocks[j]); // push the pushed block in case it is pushed into another block. Allows slideing
              }
          }
      }
    
}


/*
Name: CaseTrianglePressed
Input:
  -
Output:
  - : Boolean : is the mouse within the acceptable range of  the upper middle section of the given block
Description:
Identify if the mouse is near enough to the top middle of a given block where the triangle button the change case is located
*/
function CaseTrianglePressed(block){
  if (abs((block.x + block.w/2 + 1) - mouseX) <6 && abs((block.y + block.h/2 - 11) - mouseY) < 5){return true;}
  return false;
}

/*
Name: MonthLength
Input:
  -i : Integer: the number month (JAN = 0, DEC = 11)
Output:
  - : Integer : the number of days in the month
Decription:
Returns the number of days in the given month
*/
function MonthLength(i){
  if(i == 1){return 28}
  else if(i == 3 || i == 5 || i == 8){return 30}
  else{return 31}   
  }
function PlaySound(s){
  s.stop();
  s.play();
}


/*
Name: Hover
Input:
  - topleftx     : Integer : x-coordinate of the top left corner
  - toplefty     : Integer : y-coordinate of the top left corner
  - bottomrightx : Integer : x-coordinate of the bottom right corner
  - bottomrighty : Integer : y-coordinate of the bottom right corner
Output:
  - : Boolean : Wether or not the mouse is within the boundary of the described box
Description:
Used to identifiy when the mouse is lies over/within a box described by two opposite corners
*/
function Hover(topleftx, toplefty, bottomrightx, bottomrighty){
      if (mouseX > topleftx && mouseX < bottomrightx && mouseY > toplefty && mouseY < bottomrighty){
        return true;
      } else{return false;}
}


