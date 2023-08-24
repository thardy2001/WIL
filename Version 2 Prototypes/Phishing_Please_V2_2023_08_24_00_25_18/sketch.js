/*
Authors:
  Tyler Hardy
    Student Number: C3339895
    Contacts:
      Student Email:  c3339895@uon.edu.au
      Linkedin: www.linkedin.com/in/tyler-a-hardy
*/

// CLASSES

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
    
    this.disabled = false;
    
    this.action = action;
  }
  Display(){
    if(!this.disabled){
      stroke(1);
      if(this.hovered){fill(160)} else{fill(255)}
      rect(this.x, this.y, this.w,this.h);
      fill(0);
      text(this.t, this.x + 2 , this.y + this.h/2 +4 ); // +4 to adjust to center due to character height 
      fill(255)      
    }

  }
  Pressed(){
    if(!this.disabled){this.action();}
  }
  Update(){
    if (Hover(this.x,this.y,this.x+this.w,this.y+this.h))// Mouse in block
    {
      this.hovered = true;
    } else{this.hovered = false;}
    
  }
}


class Document{
  constructor(x,y,w,h){
    this.x = x;
    this.y = y;

    this.w = w;
    this.h = h;
    
    this.stamps = [];
    /*location on document that was clicked. to determine offset from mouse location when being moved*/
    this.offsetx = 0;
    this.offsety = 0; 
    
    
  }
  
  // Generic backup display that should be overwritten
  Display(){
    rect(this.x,this.y,this.w,this.h)
  }
  Pressed(){
    if(carried == null ) // carried is global for if something is already being moved
    {
      paper_grab_sound.amp(random(0.5,1.5))
      PlaySound(paper_grab_sound)
      carried = this;
      this.offsetx = mouseX - this.x;
      this.offsety = mouseY - this.y;
      // move this to the top of the stack to be drawn last (over top of everything else)
      items.splice(items.indexOf(this),1)// delete from array
      items.push(this)// push document back onto array at the front
    }
  }
  Released(){
    
    carried = null;
  }
  Move(){
    this.x = mouseX - this.offsetx;
    this.y = mouseY - this.offsety;
  }
  Update(){}
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
  - offsetx:(float): where the mouse was clicked to pick up object (relitive to this.x)
    * Used in order to have the mouse stay where it was when it clicked on the object while dragging 
  - offsety:(float): where the mouse was clicked to pick up object (relitive to this.y)
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
class Email extends Document{
  constructor(x,y,w,h)
  {
    super(x,y,w,h)

    this.elements = [];
    this.w = 350;
    this.h = 180;
    this.name = "David Minch";
    this.source = "";
    this.subject = "";
    this.body = "";

    this.line_count=3; 
    this.open = false;
    
    this.answer = []

  }
  Display()
  {
    push();
    fill(255)
    rect(this.x,this.y,this.w,this.h)
    fill(230);
    strokeWeight(0)
    rect(this.x,this.y,this.w,80)
    fill(0)
    text("Source: " , this.x + 10, this.y + 30)
    
    fill(100,100,255)
    if(this.name === ""){
      text(this.source, this.x + 70, this.y + 30)
    }else{
      text(this.name, this.x + 70, this.y + 30)
      if(mouseX > this.x+70 && mouseX < this.x + 400 && mouseY > this.y + 20 && mouseY < this.y + 40){
        text(this.source, this.x + 70,this.y + 15)
      }      
    }
    
    fill(0)
    
    text("Subject:  ", this.x + 10, this.y + 60)
    text(this.subject, this.x + 70, this.y + 60)

    text(this.body, this.x+10,this.y+80, this.w - 20,400)
    if(this.body.indexOf("{") != -1){
      
    }
    
    pop();
    for(let i = 0; i < this.stamps.length;i++){
      this.stamps[i].Display();         
    } 
      
  }
}

class StampSheet extends Document{
  constructor(x,y,w,h){
    super(x,y,w,h)

    this.w = stampsheetimg.width;
    this.h = stampsheetimg.height;
    this.decision = null;
    this.answer = [false,false,false,false,false];
    this.stamps = [];
    this.scrunch = false;
    this.vy = 0;
    this.ay = 0.8;
  }
  
  Display(){
    image(stampsheetimg,this.x,this.y);
    for(let i = 0; i < this.stamps.length;i++){
      this.stamps[i].Display();                    
    }

  }
  
  Update(){}
  
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
  - offsetx:(float): where the mouse was clicked to pick up object (relitive to this.x)
    * Used in order to have the mouse stay where it was when it clicked on the object while dragging 
  - offsety:(float): where the mouse was clicked to pick up object (relitive to this.y)
    * Used in order to have the mouse stay where it was when it clicked on the object while dragging

Description:
These objects are the tools used to stamp the email. Includes rules for being picked up, dropped, moved and the text/text colour produced when used
*/
class Tool {
  constructor(x,y, t, c, img){
    this.x = x;
    this.y = y;
    this.stamptext = t;
    
    this.img = img;
    this.w = img.width;
    this.h = img.height;
    this.size = 1;
    
    this.colour = c;
    this.tray = null;
    
    this.is_decision = false;
  }
  Display(){
    push()
    fill(235,132,132);
    strokeWeight(3);
    textAlign(CENTER);
    image(this.img, this.x + this.img.width/12 - 5, this.y + this.img.height/12 -5)
    strokeWeight(0);
    fill(this.colour);
    textStyle(BOLD);
    text(this.stamptext, this.x + this.img.width /2, this.y + this.img.height +10);
    
    pop()
  }
  
  Update(){
    
  }
  
  Move(){
      this.x = mouseX - this.w/2; // Adjust so mouse "grabbing" the center of the block
      this.y = mouseY - this.h/2; // Adjust so mouse "grabbing" the center of the block    
  }
  Pressed(){
    if(carried == null){
      carried = this;
      // So that the most recently moved item is brought to the front
      //tools.splice(tools.indexOf(this),1)// delete from array
      //tools.push(this)// push document back onto array at the front
      
      // remove from tray contents
      if(this.tray != null){
        this.tray.contents.splice(this.tray.contents.indexOf(this),1);
        this.tray = null;
      }
      return;
    }
    if(carried == this){
      let hovered_over = HoverFind(items);
      if(hovered_over == null){
        carried = null;
        // place onto tray.
        if(ContainedWithin(this,decision_tray)){
          this.tray = decision_tray;
          decision_tray.contents.push(this);
        }else if(ContainedWithin(this,reason_tray)){
          this.tray = reason_tray;
          reason_tray.contents.push(this);
        }
      } else // Test for a place for a stamp
      {
        
        if(ContainedWithin(this,hovered_over) && hovered_over instanceof StampSheet){
          new Stamp(this, hovered_over)
          if(this.is_decision){
            hovered_over.decision = this.stamptext;
            if(this.stamptext === "SAFE"){
              hovered_over.answer[0] = true
            }
            else{
              hovered_over.answer[0] = false
            }
            if(this.stamptext === "PHISHING" && reason_tray.open == false){
              reason_tray.Reverse();
            }
          }else{
            if(this.stamptext === "IMPERSONATION"){hovered_over.answer[1] = true}
            else if(this.stamptext === "ADDRESS"){hovered_over.answer[2] = true}
            else if(this.stamptext === "LINK"){hovered_over.answer[3] = true}
            else if(this.stamptext === "SOLICITATION"){hovered_over.answer[4] = true}
          }
          let s = int(random(0,2))
          PlaySound(stamp_sounds[s])
        }
      }        
    }

    
    
  }
  
  Released(){
    
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
    this.parent.stamps.push(this);
    
  } 
  
  Display(){
    push();
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
    
    pop()
  }
  
  Update(){
    
  }
}

class Tray{
  constructor(x,y,size, axis,side){
    this.size = size; // the number of stamps the tray is designed to hold
    
    // indicates the axis of movement when opened and closed
    this.axis = axis; // TRUE = vertical    FALSE = horizontal
    
    // indicates if it opens left or right / up or down
    this.side = side; // TRUE=open positive direction  FALSE=open negitive direction

    //space for sides    space for tools       space between tools
    this.w = 100 +    this.size*stamphandle.width + this.size * 20;
    
    this.h = stamphandle.height + 30;
    
    this.x = x;
    this.y = y;
    
    //this.vx = 0;
    //this.vy = 0;
    

    // set the initial acc so that the tray is closing
    
    /*
    if(this.side){
      if(this.axis){
        this.ay = -1
      }else{
        this.ax = -1;
      }
    }else{
      if(this.axis){
        this.ay = 1;
      }else{
        this.ax = 1;
      } 
    }
    */
    
    // For the more succinct version of the movement in Update() function
    this.v = 0;
    if(this.side){
      this.a = -1;
    }else{
      this.a = 1;
    }
    

    
    this.contents = [];
    
    this.button = null;
    
    this.open = false;
    
    
  }
  
  Display(){
    push();
    fill(255);
    strokeWeight(2);
    stroke(0);
    rect(this.x,this.y,this.w,this.h);
    fill(180)
    rect(this.x+4,this.y + 4, this.w - 8, this.h - 8)
    pop();
    
    this.button.Display();
  }
  
  Update(){
    this.button.Update();
    

    if(this.axis){ // UP & DOWN moving tray
      if(this.open && this.y < 0 || !this.open && this.y > 5- this.h){
        this.v += this.a;
        this.y += this.v;
        this.button.y = this.y + this.h;
      }else{
        this.v = 0; // Stop
      }
    }else{ // LEFT & RIGHT moving tray
      if(this.open && this.x < 0 || !this.open && this.x > 1 - this.w){
        this.v += this.a;
        this.x += this.v;
        this.button.x = this.x + this.w;
      }else{
        this.v = 0; // Stop
        
      }      
    }
    
    // Move the stamps in the tray the same way as the tray itself
    for(let i = 0; i < this.contents.length;i++){
      
      if(this.axis){
        this.contents[i].y+=this.v;
      }else{
        this.contents[i].x+=this.v;
      }
    }
    
  }
  
  Insert(t){
    this.contents.push(t);
  }
  Remove(t){
    this.contents.splice(this.contents.indexOf(t),1);
  }
  
  Reverse(){this.open = !this.open;this.a*=-1;PlaySound(tray_sound)}
  
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
*/

class Folder{
  
  constructor(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    this.offsetx = 0;
    this.offsety = 0;
    
    this.open = false;
    
    this.contents = [];
    
    // Trapizoid dimensions
    this.a = 100;
    this.fin_width = 10;
    this.fin_height = 20;
    this.base = this.a + this.fin_width*2;
    
    this.next_button = new Button("NEXT", this.x + this.w - 60, this.y + this.h - 40, 50,30,function n(){NextQuestion()})
    this.submit_button = new Button("SUBMIT", this.x + this.w - 60, this.y + this.h - 40, 50,30,function s(){
      for(let i = 0; i < test_folder.contents.length;i++){
        if(test_folder.contents[i] instanceof StampSheet){
          Submit(test_folder.contents[i]);
          return
        }
      }

    })
    this.stamps = []
    
  }
  DrawTrapezium(x,y){
    push()
    fill(210,210,150);
    beginShape(); // trapezium lip on the top of the folder
    vertex(x ,y);
    vertex(x  - this.base, y);
    vertex(x  - this.base + this.fin_width ,y - this.fin_height);
    vertex(x - this.fin_width ,y - this.fin_height);
    endShape(CLOSE);
    pop()
  }
  Display(){
    push();
    fill(230,230,170);
    this.DrawTrapezium(this.x + this.w, this.y)
    
    if(this.open){
      rect(this.x - this.w,this.y ,this.w,this.h) // Lid opened up
      this.DrawTrapezium(this.x-this.w + this.base,this.y) // tab on the lip
      
      rect(this.x,this.y,this.w,this.h) // the back
    } 
    else{
      rect(this.x,this.y,this.w,this.h) // the back
      for(let i = 0; i < this.stamps.length;i++){
        this.stamps[i].Display();
      }
      for(let i = 0; i < this.contents.length; i++){
        if(this.contents[i] instanceof StampSheet && this.contents[i].decision != null){
          if(submitted){
            this.next_button.Display();
            this.next_button.Update();
          }else{
            this.submit_button.Display();
            this.submit_button.Update();            
          }

          
        }
      }
    }
    pop();
  }
  
  Empty(){
    for(let i = 0; i < this.contents.length;i++){
      this.contents[i].x = this.x + this.contents[i].offsetx;
      this.contents[i].y = this.y + this.contents[i].offsety;      
      items.push(this.contents[i])
    }
    this.contents = [];
    
  }
  Add(additions){
    this.contents = additions;
    for(let i = 0; i < additions.length;i++){
      additions[i].offsetx = ( additions[i].x - this.x);
      additions[i].offsety = ( additions[i].y - this.y);      
    }

    
    for(let i = 0; i < additions.length;i++){
      items.splice(items.indexOf(additions[i]),1);
    }


  }
  Update(){
    if(this.open){
      for(let i = 0; i < this.contents.length;i++){
        this.contents[i].Update()
      }
    }
  }
  
  Pressed(){

    if(carried == null ) // carried is global for if something is already being moved
    {
      paper_grab_sound.amp(random(0.5,1.5))
      PlaySound(paper_grab_sound)
      carried = this;
      this.offsetx = mouseX - this.x;
      this.offsety = mouseY - this.y;
      // move this to the top of the stack to be drawn last (over top of everything else)
      items.splice(items.indexOf(this),1)// delete from array
      items.push(this)// push document back onto array at the front
    }
  }
  Move(){
    this.x = mouseX - this.offsetx;
    this.y = mouseY - this.offsety;
    this.submit_button.x = this.x + this.w - 150;
    this.submit_button.y = this.y + this.h - 60;
    this.next_button.x = this.x + this.w - 100;
    this.next_button.y = this.y + this.h - 60;
    
  }
  Released(){carried = null;}
}



// Variables
let currentEmail;
let stampsheetimg;
let stamppadimg;
let stamphandle;

let submitted = false;

let items = [];
let stack = [];
let tools = [];


let elements = [];
let emails = [];

// Loaded Data
let elementData = [];
let images = [];
let stamp_sounds = [];
let email_data = [];

let tray_sound;
let paper_sound;
let paper_grab_sound;

let carried;

let decision_tray;
let reason_tray;

let test_folder;

let correct_stamp;
let incorrect_stamp;

function preload(){
  stampsheetimg = loadImage("images/stampsheet2.png");
  stamppadimg = loadImage("images/stamppad.PNG");
  
  stamphandle = loadImage("images/stamp.png");
  
  images.push(loadImage("images/phishing1.png"));
  images.push(loadImage("images/phishing2.png"));
  images.push(loadImage("images/phishing3.png"));
  images.push(loadImage("images/phishing4.png"));
  images.push(loadImage("images/phishing5.png"));
  images.push(loadImage("images/phishing6.png"));
  
  email_data.push(loadStrings("data/phish1.txt"));
  email_data.push(loadStrings("data/phish2.txt"));
  email_data.push(loadStrings("data/phish3.txt"));
  email_data.push(loadStrings("data/phish4.txt"));
  email_data.push(loadStrings("data/phish5.txt"));
  email_data.push(loadStrings("data/phish6.txt"));
  email_data.push(loadStrings("data/phish7.txt"));
  email_data.push(loadStrings("data/phish8.txt"));
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  stamp_try_x = width/2
  tray_sound = loadSound("sounds/tray_open_sound.mp3");
  paper_grab_sound = loadSound("sounds/paper_grab_sound.mp3");
  paper_sound = loadSound("sounds/paper_scrunch_sound.mp3");
  paper_sound.rate(4);
  paper_sound.amp(0.4);
  stamp_sounds[0] = loadSound("sounds/stampsound1.mp3")
  stamp_sounds[1] = loadSound("sounds/stampsound2.mp3")
  stamp_sounds[0].setVolume(3)
  stamp_sounds[1].setVolume(3)
  
  stampsheetimg.width = stampsheetimg.width/2;
  stampsheetimg.height = stampsheetimg.height/2;
  
  stamphandle.width = stamphandle.width/25;
  stamphandle.height = stamphandle.height/25;
  
  correct_stamp = new Tool(-100,-100, "CORRECT", (0,255,0), stamphandle)
  correct_stamp.colour = color(0,255,0)
  correct_stamp.w += 100;
  correct_stamp.w += 30;
  incorrect_stamp = new Tool(-100,-100, "INCORRECT", (255,0,0), stamphandle)
  incorrect_stamp.colour = color(255,0,0)
  incorrect_stamp.h +=30;
  incorrect_stamp.w += 100;
  
  test_folder = new Folder(400,150,415,560)
  items.push(test_folder)
  

  
  for(let i = 0; i < email_data.length;i++){
    let e = new Email(420,220)
    e.source = email_data[i][0];
    e.name = email_data[i][1];
    e.subject = email_data[i][2];
    
    // Read in the answer
      // Substring to remove the square brackets
      let a = email_data[i][email_data[i].length - 1].substring(1,email_data[i][email_data[i].length - 1].length - 1)
      let split_a = split(a, ",");

      for(let i = 0; i < split_a.length;i++){
        if(split_a[i] === "true"){e.answer.push(true)}else{e.answer.push(false)}
      }
      
    
    for(let j = 2; j < email_data[i].length - 1;j++){
      e.body+= "\n" + email_data[i][j];
      e.h+=20;
    }
    emails.push(e);
  }
  
  let c = int(random(0,emails.length))
  currentEmail = emails[c];
  currentEmail.offsetx = 10;
  currentEmail.offsety = 5;

  test_folder.contents.push(currentEmail);
  
  let s = new StampSheet(0,0);
  s.offsetx = 20;
  s.offsety = 15;
  test_folder.contents.push(s)
  

  // Decisions
  decision_tray = new Tray(width/2, 0, 2, true,true); // have two tools
  decision_tray.button = new Button("Decisions",decision_tray.x + decision_tray.w/2 - 28, decision_tray.h , 56,20, function DecisionButton(){decision_tray.Reverse()});
  
  let phishing = new Tool(width/2 + 30 ,12,"PHISHING", color(255,100,100), stamphandle)
  phishing.is_decision = true;
  let safe = new Tool(width/2 + 150,12,"SAFE", color(100,100,255), stamphandle)
  safe.is_decision = true;
  tools.push(phishing)
  tools.push(safe) 
  decision_tray.contents.push(phishing)
  phishing.tray = decision_tray;
  decision_tray.contents.push(safe)
  safe.tray = decision_tray;
  
  // Reasons
  reason_tray = new Tray(0,100,4, false,true); // have four tools
  reason_tray.button = new Button("Reasons",reason_tray.w, reason_tray.y + reason_tray.h/2 - 10, 52,20,function ReasonButton(){reason_tray.Reverse()});
  
  let impersonate = new Tool(22 ,110,"IMPERSONATION", color(255,100,100), stamphandle)
  let address = new Tool(112 ,110,"ADDRESS", color(255,100,100), stamphandle)
  let link = new Tool(190 ,110,"LINK", color(255,100,100), stamphandle)
  let solicit = new Tool(270 ,110,"SOLICITATION", color(255,100,100), stamphandle)
  tools.push(impersonate)  
  tools.push(address)  
  tools.push(link)
  tools.push(solicit)
  reason_tray.contents.push(impersonate)
  impersonate.tray = reason_tray;
  reason_tray.contents.push(address)
  address.tray = reason_tray;
  reason_tray.contents.push(link)
  link.tray = reason_tray;
  reason_tray.contents.push(solicit)
  solicit.tray = reason_tray;
  

}

function draw() {

  background(220)
  rectMode(CORNER)
  fill(255)
  push()
  fill(160)
  strokeWeight(3);
  stroke(0);
  pop()

  if(carried != null){
    carried.Move();
  }
  
  for(let i = 0; i < items.length;  i++){
    items[i].Display();
    items[i].Update();
  }

  decision_tray.Display();
  decision_tray.Update();
  
  reason_tray.Display();
  reason_tray.Update();
  
  for(let i = 0; i < tools.length;  i++){
    tools[i].Display();
  }  
  

}

// FUNCTIONS

function NextQuestion(){
  submitted = false;
  items = [];
  emails.splice(emails.indexOf(currentEmail),1)
  currentEmail = emails.pop();
  test_folder = new Folder(400,150,415,560)
  items.push(test_folder)

  currentEmail.offsetx = 10;
  currentEmail.offsety = 5;

  test_folder.contents.push(currentEmail);
  
  let s = new StampSheet(0,0);
  s.offsetx = 20;
  s.offsety = 15;
  test_folder.contents.push(s)
  
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

/* Finds the first item being hovered over*/
function HoverFind(list){
    for(let i = list.length - 1; i > list.indexOf(this);i--){
      let a = list[i];
      if(a instanceof Folder){
        if(Hover(a.x, a.y, a.x+a.w, a.y+a.h)){
          return a;
        }else if(a.open && Hover(a.x - a.w, a.y, a.x+a.w, a.y+a.h)){
          return a;
        }
      }
      if(Hover(a.x, a.y, a.x+a.w, a.y+a.h)){
        return a;
      }
    } 
  }
/*Create a new stamp object*/
function PlaceStamp(t, s){
  
  stamps.push(new Stamp(t, s));

} 

function PlaySound(s){s.stop();s.play()}

function Submit(sheet){
  submitted = true;
  test_folder.submit_button.disabled = true;
  let submitted_answer = sheet.answer
  let correct_answer = currentEmail.answer
  
  incorrect_stamp.x = int(random(test_folder.x + 20, test_folder.x + test_folder.w - 200))
  incorrect_stamp.y = int(random(test_folder.y + 20, test_folder.y + test_folder.h - 500))
  
  correct_stamp.x = int(random(test_folder.x + 20, test_folder.x + test_folder.w - 200))
  correct_stamp.y = int(random(test_folder.y + 20, test_folder.y + test_folder.h - 500))
  
  let incorrect = true;
  
  if(submitted_answer[0] == correct_answer[0]){incorrect = false;}

  if(correct_answer[0] == false){ // is a phishing email
    // Reason grade stamps
    for(let i = 2; i <= 5;i++){
      let initialx = tools[i].x
      let initialy = tools[i].y

      tools[i].x = int(random(test_folder.x + 30, test_folder.x + 100))
      tools[i].y = 230 + i * 50;
      if( correct_answer[i] == true && submitted_answer[i] == correct_answer[i] ){
          
          tools[i].colour = color(0,255,0)
          new Stamp(tools[i],test_folder)

      }else{
        
        new Stamp(tools[i],test_folder)
      }

      //reset the stamps to where they were
      
      tools[i].x = initialx;
      tools[i].y = initialy;
    }      
  }

  if(incorrect){
    new Stamp(incorrect_stamp,test_folder)
  }else{
    new Stamp(correct_stamp,test_folder)    
  }
    //reset stamps
  for(let i = 2; i <=5;i++){
    tools[i].colour = color(255,100,100)
  }
  
  
}

function mousePressed() {

  if(decision_tray.button.hovered){decision_tray.button.Pressed();}
  if(reason_tray.button.hovered){reason_tray.button.Pressed();}
                
  //Pressed the lip to open / close the folder
  if(Hover(test_folder.x + test_folder.w - test_folder.base, test_folder.y - test_folder.fin_height, test_folder.x+test_folder.w, test_folder.y) ||
     Hover(test_folder.x - test_folder.w, test_folder.y - test_folder.fin_height, test_folder.x-test_folder.w + test_folder.base, test_folder.y)){
    PlaySound(paper_grab_sound)
    PlaySound(paper_grab_sound)
    if(test_folder.open){ // closing it
      
      let i = items.indexOf(test_folder);
      let additions = []
      for(let next = i + 1;next < items.length;next++){
        if(items[next] instanceof Document && ContainedWithin(items[next],test_folder)){
          additions.push(items[next]);  
        }
      }
      test_folder.Add(additions)
    }else{
      test_folder.Empty()
    }
    test_folder.open = !test_folder.open
    return;
  }
  if(Hover(test_folder.submit_button.x,test_folder.submit_button.y,test_folder.submit_button.x + test_folder.submit_button.w,test_folder.submit_button.y + test_folder.submit_button.h)){
    test_folder.submit_button.Pressed();
  }
  if(Hover(test_folder.next_button.x,test_folder.next_button.y,test_folder.next_button.x + test_folder.next_button.w,test_folder.next_button.y + test_folder.next_button.h)){
    test_folder.next_button.Pressed();
  }
  let a = HoverFind(tools);
  if(a != null){a.Pressed();return}
  
  a = HoverFind(items);
  if(a != null){a.Pressed();return}  

  


}

function mouseReleased() {
  if(carried!= null){carried.Released()}
}