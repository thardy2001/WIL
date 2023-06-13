/*
Response Sheet / recipt thing that the stamps are suppose to go on ? 

pick up and move stamp sheet pad

tear off sheet

stamp sheet rather than email

record what is stamped on the sheet

submit sheet
*/

// CLASSES
class StampTray{
  constructor(title, left,w,count){
    
    this.title = title
    // true = on the left most wall
    // false = the right most wall 
    
    // Drag it out ? or click and it pops out ? 
    this.left = left;
    this.open = false;
    this.stampcount = count;
    this.w = w
    //         space per stamp      gap between each stamp
    this.h = this.stampcount * 100 + this.stampcount * 10
  }
  Update(){
    // Sliding motion as the tray is opened or closed
    if(this.open){ // Move if it is open 
      if(this.left){
        if(this.x < this.w){this.x++}
      }else{
        if(this.x > canvas.width - this.w){this.x--}
      } 
    }else{ // Move if it is closed
      if(this.left){
        if(this.x > 0){
          this.x--
        }
        else{
          if(this.x > canvas.width){this.x++}
        }       
      }
       
    }
  }
  Display(){
    // the 25 offset for the x on the vertexes here will be different depending on whch side of the screen the tray is.
    beginShape() // trapizium tab thing
    vertex(this.x,this.y)
    vertex(this.x,this.y+this.h)
    vertex(this.x + 25, this.y + 25)
    vertex(this.x + 25, this.y + this.h - 25)
    endShape()
    push()
    angleMode(DEGREES)
    rotate(95)
    text(this.title, this.x + 10, this.y - 25);
    pop()
  }
}

/*
Name: Button
Variables:
  - t:(String): The text label of the button
  - x:(float): X coordinate
  - y:(float): Y coordinate
  - w:(float): width, Dependant on the length of the text label
  - h:(float): height
  - hovered:(boolean): is the mouse hovered over the object
  - disabled:(Boolean): Can the button be pressed
  - action:(function): The function to be executed if the button is pressed



Description:
Button (:/) simple idea
*/
class Button{
  constructor(t,x,y,w,h, action){
    this.t = t;
    this.x = x;
    this.y = y;
    
    this.w = w;
    this.h = h;
    
  
    this.hovered = false;
    this.disabled = true;
    
    this.action = action;
  }
  Display(){
    stroke(1);
    if(this.hovered){fill(160)} else{fill(255)}
    rect(this.x, this.y, this.w,this.h);
    fill(0);
    text(this.t, this.x + this.w/2, this.y + this.h/2 +4 ); // +4 to adjust to center due to character height 
    fill(255)
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

/*
Name: Email
Variables:
  - x:(float): X coordinate
  - y:(float): Y coordinate
  - w:(float): width
  - h:(float): height
  - img:(image): Image / Screenshot of the email
  - hovered:(boolean): is the mouse hovered over the object
  - clickedx:(float): where the mouse was clicked to pick up object (relitive to this.x)
    * Used in order to have the mouse stay where it was when it clicked on the object while dragging 
  - clickedy:(float): where the mouse was clicked to pick up object (relitive to this.y)
    * Used in order to have the mouse stay where it was when it clicked on the object while dragging
  - src:(Instance:Element): The box for interaacting with the source address
  - sign:(Instance:Element): The box for interacting with the signature of the email
  - subject: (String): The subject line of the email
  - body:(String): The main section of text within the email
  - safe:(Boolean): Is the email a safe email or phishing email
  - stampedSafe:(Boolean): what has the player stamped the email with
  - impersonation:(Boolean): Is the email an attempt at impersonation
  - stampedImpersonation:(Boolean): Has the player stamped this email as being impersonation
Description:
Contains all the data related to an email including its location. 
Also handles the movement and drawing of the email.
*/
class Email{
  constructor(img, x, y,answer, reasons)
  {
    
    this.x = x;
    this.y = y;
 
    this.img = img;
    if(this.img.height*0.5 < 120){
      this.img.width = this.img.width*0.8;
      this.img.height = this.img.height*0.8;      
    }else{
      this.img.width = this.img.width*0.5;
      this.img.height = this.img.height*0.5;      
    }

    this.img.width = this.img.width*imgScale;
    this.img.height = this.img.height*imgScale; 
    
    this.w = this.img.width;
    this.h = this.img.height;
    
    this.dragged = false;
    this.hovered = false;
    
    
    this.clickedx = 0;
    this.clickedy = 0;
    
    
    this.elements = [];
      
      
    this.subject = "";
    this.body = "";
    
    this.answer = answer;
    this.reasons = reasons;

  }
  Display()
  {

    
    image(this.img,this.x,this.y, this.img.width,this.img.height);
    
  }
  
  Update()
  {
    if(Hover(this.x, this.y, this.x+this.w, this.y+this.h))
    {
      this.hovered = true;
    }else{this.hovered = false;}
    
    
    if(this.dragged)
    {
      this.x = mouseX + this.clickedx; // Adjust so mouse "grabbing" the center of the block
      this.y = mouseY + this.clickedy; // Adjust so mouse "grabbing" the center of the block
    }
    // Change the text colour for URL links (for clicking)
    
    for(let i = 0; i < this.elements.length; i ++){
      this.elements[i].Update();
      if(this.elements[i].hovered){this.elements[i].Display();}
      
    }


  }
  
  Pressed()
  {
    // Make sure that you cannot pick up the email while carrying a stamp tool
    let carry = false;
    for(let i = 0; i < tools.length; i++){
      if(tools[i].carried){carry = true;}
    }
    for(let i = 0; i < stampsheets.length; i++){
      if(stampsheets[i].dragged){carry = true;}
    }    
    if(this.hovered && !carry && selectedElement == null)
    {
      this.dragged = true;
      this.clickedx = (this.x-mouseX);
      this.clickedy = (this.y -mouseY);
    }
  }
  Released()
  {
    this.dragged = false;
  }
}


/*
Name: Tool
Variables:
  - x:(float): X coordinate
  - y:(float): Y coordinate
  - w:(float): width, Dependant on the length of the stamp text 
  - h:(float): height
  - colour:(color): The colour the stamp will be made in
  - hovered:(boolean): is the mouse hovered over the object
  - carried:(boolean): Is this tool currently being carried
  - clickedx:(float): where the mouse was clicked to pick up object (relitive to this.x)
    * Used in order to have the mouse stay where it was when it clicked on the object while dragging 
  - clickedy:(float): where the mouse was clicked to pick up object (relitive to this.y)
    * Used in order to have the mouse stay where it was when it clicked on the object while dragging

Description:
These objects are the tools used to stamp the email. Includes rules for being picked up, dropped, moved and the text/text colour produced when used
*/
class Tool {
  constructor(x,y, t, c, img)
  {
    this.x = x;
    this.y = y;
    this.spawnx = x;
    this.spawny = y;
    this.stamptext = t;
    
    this.w = img.width
    this.h = img.height;
    
    this.colour = c;
    
    this.hovered = false;
    this.carried = false;
    
    
    this.clickedx = 0;
    this.clickedy = 0;
    
    this.img = img;
  }
  Display()
  {
    if(this.stamptext === "SAFE" && phishing){}
    fill(235,132,132);
    strokeWeight(3);
    textAlign(CENTER);
    image(this.img, this.x + this.img.width/12 - 5, this.y + this.img.height/12 -5)
    strokeWeight(0);
    fill(this.colour);
    textStyle(BOLD);
    text(this.stamptext, this.x + this.img.width /2, this.y + this.img.height +10);
    fill(255);
  }
  
  Update()
  {
    
    if(Hover(this.x, this.y, this.x+this.w,this.y + this.h))
    {
      this.hovered = true;
    }else{this.hovered = false;}
    
    
    if(this.carried)
    {
      this.x = mouseX - this.w/2; // Adjust so mouse "grabbing" the center of the block
      this.y = mouseY - this.h/2; // Adjust so mouse "grabbing" the center of the block
    }
  }
  
  Pressed()
  {
    // Stop carrying / Drop Tool
    let touch = -1;
    for(let i = 0; i < stampsheets.length;i++)
    {
      if(Touching(this,stampsheets[i])){touch = i; break;}  
    }
    if(this.carried && touch==-1 ) {this.carried = false; this.y += 3;return;}
    
    // Pick Up
    if(this.carried && touch >=0 && ContainedWithin(this,stampsheets[touch]) ){
      if(this.stamptext === "SOLICITATION"){ActivateSolicit();solicit = true;}
      if(this.stamptext === "PHISHING"){ActivatePhishing();phishing = true;}
      stampsheets[touch].dragged = false;
      PlaceStamp(this, stampsheets[touch]);
      let s = int(random(0,2))
      PlaySound(sounds[s])
      
      
      return;
    }
    
    // Can only carry if not already carrying something else
    let carry = false;
    for(let i = 0; i < tools.length; i++)
      {
        if(tools[i].carried){carry = true;}
      }
    if(this.hovered && !carry)
    {
      this.carried = true;
      this.clickedx = (this.x-mouseX);
      this.clickedy = (this.y -mouseY);
    }
  }
   
}

/*
Name: Stamp
Variables:
  - offx:(float): X offset from the X coordinate of the email
  - offy:(float): Y offset from the Y coordinate of the email
  - parent:(Instance:Email): The email the stamp has been placed on
  - sourceTool:(Instance:Tool): The tool used to create the stamp
  - rot:(float): angle to rotate the stamp by when drawing it

Description:
The stamp mark created when a tool is used
*/
class Stamp{
  constructor(t,p)
  {
    this.offx = p.x - t.x;
    this.offy = p.y - t.y;  
    this.parent = p;
    this.sourceTool = t;
    this.rot = random(-PI/8, PI/8);
    if((t.stamptext === "SAFE")&& this.offy > -13 ){p.decision = true;}
    if((t.stamptext === "PHISHING" )&& this.offy > -13 ){p.decision = false;}
    
    if((t.stamptext === "SOLICITATION" )&& this.offy < -13 ){p.reasons[0] = true;}
    if((t.stamptext === "IMPERSONATION" )&& this.offy < -13 ){p.reasons[1] = true;}
    if((t.stamptext === "LINK" )&& this.offy < -13 ){p.reasons[2] = true;}
    if((t.stamptext === "LOGIN DETAILS" )&& this.offy < -13 ){p.reasons[3] = true;}
    if((t.stamptext === "MONEY" )&& this.offy < -13 ){p.reasons[4] = true;}
    if((t.stamptext === "CONTACTS" )&& this.offy < -13 ){p.reasons[5] = true;}
    
  } 
  
  Display()
  {
    textAlign(CENTER);
    rectMode(CENTER);
    textStyle(BOLD)
    stroke(this.sourceTool.colour);
    strokeWeight(3); 
    fill(255);
    
    translate(this.parent.x -this.offx + this.sourceTool.w/2, this.parent.y - this.offy + this.sourceTool.h*0.7);
    rotate(this.rot);
    
    rect(0 ,0, this.sourceTool.w + this.sourceTool.stamptext.length * 0.9 , this.sourceTool.h / 2,3 );
    
    fill(this.sourceTool.colour);
    strokeWeight(1);
    
    text(this.sourceTool.stamptext,0,3 );
    
    rotate(-this.rot);
    translate(-(this.parent.x -this.offx + this.sourceTool.w/2), -(this.parent.y - this.offy + this.sourceTool.h*0.7));
    
    fill(255);
    stroke(1);
    rectMode(CORNER);
  }
  
  Update()
  {
    
  }
}

/*
Name: Element
Variables:
  - parent:(Instance:Email): The email the stamp has been placed on
  - rx:(float): X coordinate relative to the parent
  - ry:(float): Y coordinate relative to the parent
  - w:(float): Width of the element
  - h:(float): Height of the element
  - type:(String): What kind of information stored 
  - value:(String): The key information within the element to be compared to other elements
  - hovered:(Boolean): Is the telemtn being hovered over by the mouse

Description:
Section of key information within the email that may need to be compared to other elements
*/
class Element{
  constructor(parent,relativex,relativey,w,h, type, value)
  {
    this.p = parent;
    
    this.x = parent.x + relativex;
    this.y = parent.x + relativey
    this.rx = relativex;
    this.ry = relativey;
    
    this.w = w;
    this.h = h;
    
    
    this.type = type;
    this.value = value;
    
    this.selected = false;
    this.hovered = false;
  }
  Update()
  {
    
    this.x = this.p.x + this.rx;
    this.y = this.p.y + this.ry;
    
    if(Hover(this.rx + this.p.x,this.ry + this.p.y,this.rx + this.w + this.p.x, this.ry + this.h + this.p.y )){
      this.hovered = true;
    }else{this.hovered = false;}

  }
  
  Display()
  {
    
    // Can only carry if not already carrying something else
    let carry = false;
    for(let i = 0; i < tools.length; i++)
      {
        if(tools[i].carried){carry = true;}
      }
    //only highlight when not carrying something
    if(this.hovered && !carry || this.selected){
      if(this.type === "IDENTITY"){
        
        strokeWeight(0);
        rectMode(CORNER)
        fill(255,255,0, 120);
        rect(this.rx + this.p.x, this.ry + this.p.y, this.w, this.h, 1);
        fill(0,0,0);
        stroke(0)
      }else if(this.type === "LINK" || this.type == "PHONE"){
        
        textSize(8);
        fill(240)
        rectMode(CENTER)
        rect(this.rx + this.p.x + this.w/2, this.ry + this.p.y - this.h/2 - 4, this.value.length * 5, 10);
        strokeWeight(0)
        fill(0)
        textAlign(CENTER)
        textStyle(NORMAL)
        rectMode(CORNER)
        text(this.value, this.rx + this.p.x + this.w/2, this.ry + this.p.y - this.h/2 );
        textSize(12)
      }

    }
      
  }
  
  Pressed(){
    
    let carry = false;
    for(let i = 0; i < tools.length; i++){
        if(tools[i].carried){carry = true;}
    }
    if(this.hovered && !carry){Select(this);}
  }
}

class StampSheet{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.w = stampsheetimg.width;
    this.h = stampsheetimg.height;
    
    this.hovered = false;
    
    this.clickedx = null;
    this.clickedy = null;
    
    this.decision = null;
    this.reasons = [false,false,false,false,false, false]
    
  }
  
  Display(){image(stampsheetimg,this.x,this.y);}
  
  Update(){
    if(Hover(this.x, this.y, this.x+this.w, this.y+this.h))
    {
      this.hovered = true;
    }else{this.hovered = false;}
    
    
    if(this.dragged)
    {
      this.x = mouseX + this.clickedx; // Adjust so mouse "grabbing" the center of the block
      this.y = mouseY + this.clickedy; // Adjust so mouse "grabbing" the center of the block
    }
    
  } 
  
  Pressed(){
  // Make sure that you cannot pick up the email while carrying a stamp tool
  let carry = false;
  for(let i = 0; i < tools.length; i++){
    if(tools[i].carried){carry = true;}
  }
  if(this.hovered && !carry && selectedElement == null)
  {
    this.dragged = true;
    this.clickedx = (this.x-mouseX);
    this.clickedy = (this.y -mouseY);
  }
  
  }
  
  Released(){this.dragged = false;}
}

// Variables
let currentEmail;
let stampsheetimg;
let stamppadimg;
let stamphandle;


let imgScale = 1.5;
let solicit = false;
let phishing = false;

let comparemode = false;
let compareButton;

let emails = [];
let tools = [];
let stamps = [];
let elements = [];
let elementData = []
let images = [];
let stampsheets = [];

let selectedElement;
let secondSelectedElement;

let submitx;
let submity;
let submitw;
let submith;
let currentstampsheet;
let submitButton;
let sounds = [];

function preload(){
  stampsheetimg = loadImage("stampsheet2.png");
  stamppadimg = loadImage("stamppad.PNG");
  
  stamphandle = loadImage("stamp.png");
  
  images.push(loadImage("images/phishing1.png"));
  images.push(loadImage("images/phishing2.png"));
  images.push(loadImage("images/phishing3.png"));
  images.push(loadImage("images/phishing4.png"));
  images.push(loadImage("images/phishing5.png"));
  images.push(loadImage("images/phishing6.png"));
  
  elementData.push(loadStrings("data/phish1.txt"));
  elementData.push(loadStrings("data/phish2.txt"));
  elementData.push(loadStrings("data/phish3.txt"));
  elementData.push(loadStrings("data/phish4.txt"));
  elementData.push(loadStrings("data/phish5.txt"));
  elementData.push(loadStrings("data/phish6.txt"));
  
}
function setup() {
  createCanvas(600 * imgScale, 500 * imgScale);
  angleMode(RADIANS);
  
  sounds[0] = loadSound("sounds/stampsound1.mp3")
  sounds[1] = loadSound("sounds/stampsound2.mp3")
  sounds[0].setVolume(1)
  sounds[1].setVolume(1)
  
  stampsheetimg.width = stampsheetimg.width/2;
  stampsheetimg.height = stampsheetimg.height/2;
  
  stamphandle.width = stamphandle.width/25;
  stamphandle.height = stamphandle.height/25;
  

  
  submitx = 300;
  submity = canvas.height - 600;
  submitw = canvas.width - submitx;
  submith = 580;
  
  submitButton = new Button("Submit", submitx, submity + submith + 10, 45,15,function SubmitButtonPressed(){Submit(currentstampsheet);});
  submitButton.disabled = false;

  
  tools.push(new Tool(30,10,"SAFE", color(100,100,255), stamphandle));
  tools.push(new Tool(200,10,"PHISHING", color(255,0,0),stamphandle));

  emails.push(new Email(images[0], width/6,200,false, [false,true,false,false,false, false]));
  emails.push(new Email(images[1], width/10,200, false,[false,true,true,false,false, false]));
  emails.push(new Email(images[2], width/6,200, false,[false,true,true,false,false, false]));
  emails.push(new Email(images[3], width/6,200, false,[false,true,true,false,false, false]));
  emails.push(new Email(images[4], width/6,200, false,[false,true,false,true,false, false]));
  emails.push(new Email(images[5], width/6,200, false,[false,true,false,true,false, false]));
  
  stampsheets.push(new StampSheet(100,100));
  
  // Load in the elements from the files and add them to emails
  // For each file of elements
  for(let i = 0; i < elementData.length; i++)
  {
    for(let j = 0; j<elementData[i].length;j++){
      let data = elementData[i][j].split(",");
      let e = new Element(emails[i],int(data[0]) * imgScale, int(data[1]) *imgScale, int(data[2]) *imgScale, int(data[3]) *imgScale,data[4], data[5] );
      elements.push(e)
      emails[i].elements.push(e);
    }
      
  }
  
  
  // Safe Emails
  let choice = int(random(0,6));
 
  currentEmail = emails[choice];
}

function draw() {
  background(220)
  rectMode(CENTER)
  fill(255)
  
  //rect(submitx,submity, submitw, submith);
  fill(255)
  
  for(let i = 0; i < stampsheets.length; i++)
  {
    let c = stampsheets[i];
    
    if(c.x > submitx && c.x + c.w < submitx + submitw) //  contained in x
    {
      if(c.y > submity - 15 && c.y + c.h < submity + submith) // contained in y
      {
        
        currentstampsheet = c;
        submitButton.disabled = false;
        break;
      }
    }else {submitButton.disabled = true;}
  }
  
  currentEmail.Update();
  currentEmail.Display();
  submitButton.Update();
  
  fill(0);
   for(let i = 0; i < stampsheets.length;i++){
    stampsheets[i].Update();
    stampsheets[i].Display();
  }   
  for(let i = 0; i < stamps.length; i++){
    stamps[i].Update();
    stamps[i].Display();
  }  

  for(let i = 0; i < currentEmail.elements.length; i ++){
    
    currentEmail.elements[i].Update();
    currentEmail.elements[i].Display();
  }
  
  let carried = -1;
  for(let i = 0; i < tools.length; i ++){
    if(tools[i].carried){carried = i;continue;}
    tools[i].Update();
    tools[i].Display();
  }
  if(carried >=0){ // Make sure the tool being carried is drawn on top
    tools[carried].Update();
    tools[carried].Display();   
  }
  
  // Draw line to mouse from closest point on element border
  if(selectedElement != null && secondSelectedElement == null){

    strokeWeight(1);
    let linestartx = currentEmail.x + selectedElement.rx;
    let linestarty = currentEmail.y + selectedElement.ry;
    
    // Mouse above or below element -> change line start pointg so that it doesn't go over the element
    if(mouseY - selectedElement.y > 0){linestarty += selectedElement.h}
    
    // line start follows the mouse
    linestartx += mouseX - linestartx;
    
    // Restrict to the dementions of the element
    if(linestartx < currentEmail.x + selectedElement.rx){
      linestartx = currentEmail.x + selectedElement.rx;
      linestarty = mouseY;
      if(linestarty < currentEmail.y + selectedElement.ry){linestarty =currentEmail.y + selectedElement.ry; }
      if(linestarty > currentEmail.y + selectedElement.ry + selectedElement.h)
      {
        linestarty =currentEmail.y + selectedElement.ry + selectedElement.h; 
      }
    }
    if(linestartx > currentEmail.x + selectedElement.rx + selectedElement.w){
      linestartx = currentEmail.x + selectedElement.rx + selectedElement.w;
      linestarty = mouseY;
      if(linestarty < currentEmail.y + selectedElement.ry){linestarty =currentEmail.y + selectedElement.ry; }
      if(linestarty > currentEmail.y + selectedElement.ry + selectedElement.h)
      {
        linestarty =currentEmail.y + selectedElement.ry + selectedElement.h; 
      }
      
    }
    
    line(linestartx, linestarty, mouseX, mouseY);  
    strokeWeight(0);
    if(secondSelectedElement != null){
      if(selectedElement.type === secondSelectedElement.type){
        if(selectedElement.value === secondSelectedElement.value){
          // Green Tick
          let greenoff = 0;
          beginShape();
             noFill();
            strokeWeight(5);
            stroke(50,200,50)
          rect(100 + greenoff,100,60,60,3);
          line(113,135,128,145)
          line(128,145, 148,113)
          endShape();
          strokeWeight(0);
      }
        else{
          // Red Cross
          let redoff = 400;
          beginShape();
             noFill();
            strokeWeight(5);
            stroke(200,50,50)
            rect(100 + redoff,100,60,60,3);

            line(115 +redoff,115,145 + redoff,145)
          line(145 + redoff,115,115 + redoff,145) 
          endShape(); 
          strokeWeight(0);
}        
      } else {
        // Grey Line
        let greyoff = 200;
        beginShape();
           noFill();
          strokeWeight(5);
          stroke(170)
          rect(100 + greyoff,100,60,60,3); 
          strokeWeight(6);
          line(110 + greyoff, 130, greyoff + 150, 130)
        endShape();
        strokeWeight(0);
        
      }
    }
  }
  else if(selectedElement != null &&  secondSelectedElement != null){
    strokeWeight(1);
    // Line Start
    
    let linestartx = currentEmail.x + selectedElement.rx;
    let linestarty = currentEmail.y + selectedElement.ry;
    
    
    // Line End
    let lineendx = secondSelectedElement.rx + currentEmail.x;
    let lineendy = secondSelectedElement.ry + currentEmail.y;
    
    if(selectedElement.ry > secondSelectedElement.ry){lineendy += secondSelectedElement.h}
    if(selectedElement.ry < secondSelectedElement.ry){linestarty += selectedElement.h}
    
    lineendx += secondSelectedElement.w/2;
    linestartx += selectedElement.w/2

      
    let notificationx = selectedElement.x - (selectedElement.x-secondSelectedElement.x)/2   
    let notificationy = selectedElement.y - (selectedElement.y-secondSelectedElement.y)/2  
    
    line(linestartx, linestarty, lineendx, lineendy);  
    strokeWeight(0);
    if(secondSelectedElement != null){
      if(selectedElement.type === secondSelectedElement.type){
        if(selectedElement.value === secondSelectedElement.value){
          // Green Tick
          
          beginShape();
             noFill();
            strokeWeight(5);
            stroke(50,200,50)
          rect(notificationx,notificationy,60,60,3);
          line(notificationx + 13,notificationy + 35,notificationx + 28,notificationy + 45)
          line(notificationx + 28,notificationy + 45, notificationx + 48,notificationy + 13)
          endShape();
          strokeWeight(0);
        }
        else{
          // Red Cross
          
          beginShape();
             noFill();
            strokeWeight(5);
            stroke(200,50,50)
            rect(notificationx,notificationy,60,60,3);

            line(notificationx + 15,notificationy + 15,notificationx +45,notificationy+45)
          line(notificationx +45,notificationy +15,notificationx +15 ,notificationy +45) 
          endShape(); 
          strokeWeight(0);
}        
      } else {
        // Grey Line
        rectMode(CORNER)
        beginShape();
           noFill();
          strokeWeight(5);
          stroke(170)
          rect(notificationx,notificationy,60,60,3); 
          strokeWeight(6);
          
          line(notificationx + 10, notificationy + 30, notificationx + 50, notificationy + 30)
        endShape();
        strokeWeight(0);
        
      }

    }
  }
  stroke(0);
  if(selectedElement != null){currentEmail.dragged = false;}
  
  if(submitButton.disabled == false){submitButton.Display();}
}

// FUNCTIONS


function Submit(sheet){
  print("Submit:" );
  print(sheet.decision);
  print(sheet.reasons);
}
function ActivateSolicit(){  
  if(!solicit){
    tools.push(new Tool(200,80,"LOGIN DETAILS", color(255,100,100), stamphandle));
    tools.push(new Tool(300,80,"MONEY", color(255,100,100), stamphandle));
    tools.push(new Tool(400,80,"CONTACTS", color(255,100,100), stamphandle));    
  }

}
function ActivatePhishing(){
  if(!phishing){
    tools.push(new Tool(300,10,"SOLICITATION", color(255,0,0), stamphandle)); 
    tools.push(new Tool(400,10,"IMPERSONATION", color(255,100,100), stamphandle));
    tools.push(new Tool(500,10,"LINK", color(255,100,100), stamphandle));
  }

}
/*Select clicked element, deselect after comparison*/
function Select(element){
  
  if(selectedElement == null && element.type === "IDENTITY"){
    selectedElement = element;
    selectedElement.selected = true;    
  } 
  else if(selectedElement != null && element != selectedElement){
    secondSelectedElement = element;
    element.selected = true;
  }
}
function Deselect(){
  selectedElement.selected = false;
  selectedElement = null;
  if(secondSelectedElement!=null){  secondSelectedElement.selected = false;secondSelectedElement = null;}

}
/*Is thing A completly contained within the boundaries of thing B*/
function ContainedWithin(A,B){
  if(A.x > B.x && A.x + A.w < B.x + B.w) //  contained in x
  {
    if(A.y > B.y - 15 && A.y + A.h < B.y + B.h) // contained in y
    {
      return true;
    }
  }else {return false;}
}

/*Is thing A overlapping thing B at all (touching eachother)*/
function Touching(A, B){

  if((A.x < B.x + B.w && B.x < A.x + A.w && A.y < B.y + B.h  && B.y < A.y + A.h ) ){return true;}
}

/*Is the mouse being hovered over the element given the location of its four verticies*/
function Hover(topleftx, toplefty, bottomrightx, bottomrighty){
      if (mouseX > topleftx && mouseX < bottomrightx && mouseY > toplefty && mouseY < bottomrighty){
        return true;
      } else{return false;}
}

/*Create a new stamp object*/
function PlaceStamp(t, s){
  
  stamps.push(new Stamp(t, s));
  
  /*
  IF over the email
      create stamp 
      push stamp into an array for active stamps
      record the location of the stamp relitive to email
      mark email appropriatly (flip booliean values e.g PASS:true FAIL: true Impersonate: False ...)

  */

} 
function PlaySound(s){s.stop();s.play()}
function mousePressed() {
  
  if(submitButton.hovered){submitButton.Pressed();}
  for(let i = 0; i < stampsheets.length;i++)
  {
    if(stampsheets[i].hovered){stampsheets[i].Pressed()}
  }
  
  for(let i = 0; i < tools.length; i ++){
    if(tools[i].hovered){tools[i].Pressed(); }
  }
  if(currentEmail.hovered){currentEmail.Pressed();} 
  
  let hover = false;
  for(let i = 0; i < currentEmail.elements.length; i++){
    if(currentEmail.elements[i].hovered){
      hover = true;break;
    }
  }
  if(selectedElement != null && !hover ){Deselect();}
  for(let i = 0; i < currentEmail.elements.length; i++){
    if(currentEmail.elements[i].hovered){currentEmail.elements[i].Pressed();return;}
  }
}

function mouseReleased() {
  currentEmail.Released();
  for(let i = 0; i < stampsheets.length;i++)
  {
    stampsheets[i].Released();
  }
}