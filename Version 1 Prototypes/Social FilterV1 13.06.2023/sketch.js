
/*
change dementions of the canvas according to the site. Mobile size for ticktock and instagram. website size for twitter and facebook


profile picture
name (author)
content 
  text
  image

*/
class Explosion{
  
  constructor(p,x,y,w,h){
    this.parent = p;
    this.x = x + w/4;
    this.y = y + h/4;
    this.w = w /2;
    this.h = h/2;
    this.edgerounding = 0;
    this.growthrate = 20
    this.fade = 255;
    this.faderate = 40
    this.thickness = 5
    this.colour = color(255,0,0)
    if(this.parent.good == false){this.colour = color(0,255,0)}

    
  }
  Update(){
    this.x-=this.growthrate;
    this.y -=this.growthrate;
    this.w +=this.growthrate *2;
    this.h +=this.growthrate*2;
    this.growthrate+=0.8;
    this.edgerounding+=25
    this.fade-=this.faderate
    
  }
  Display(){
    noFill()
    stroke(this.colour,this.fade)
    strokeWeight(this.thickness);
    rect(this.x, this.y, this.w, this.h, this.edgerounding)
    fill(255)
    stroke(0)
    strokeWeight(1)
  }
}

class ChatMessage{
  
  constructor(y,h,img){
    this.name = name;
    this.message = "";
    this.x = 820;
    this.y = y;
    this.w = 150;
    this.h = h + 10;
    this.hover = false;
    this.img = img;
    this.bad= false;
    if(img != null){this.h += img.height /2}
    this.good = true;
    this.ischat = true;
        
  }
  Update(){
    this.h = this.message.length/2 + 30;
    
    if(this.img != null){this.h += this.img.height /2}
    for(let i = 0; i < chats.length; i++){
      if(chats[i].y < this.y && this.y < chats[i].y + chats[i].h + postseperation){
        return;
      }
    }
    if(this.y > 450){this.y-= 3}   
  }
  
  Display(){
    stroke(0)
    if(this.hover){fill(230,100)}else{fill(210,100)}
    
    
    rect(this.x - this.w/2,this.y,this.w,this.h, 5,5,0,5) // Body
    
    if(this.img != null){image(this.img,this.x - this.w/2 + 40,this.y +this.message.length/2 + 80, this.img.width/2,this.img.height/2)}
    

    fill(0);
    stroke(220)

    
    textSize(15)
    
    text(this.message, this.x - this.w/2 + 10, this.y + 25)
  }
}

class Post{
  constructor(name,y,h,img){
    this.name = name;
    this.message = "";
    this.x = width/2;
    this.y = y;
    this.w = 400;
    this.h = h + 30;
    this.hover = false;
    this.img = img;
    this.bad= false;
    if(img != null){this.h += img.height /2}
    this.good = true;
    this.profilecolour = color(random(0,255),random(0,255),random(0,255),100)
    this.ischat = false

    
  }
  
  Update(){
    this.h = this.message.length/2 + 80;
    if(this.img != null){this.h += this.img.height /2}
    for(let i = 0; i < posts.length; i++){
      if(posts[i].y < this.y && this.y < posts[i].y + posts[i].h + postseperation){
        return;
      }
    }
    if(this.y > 190){this.y-= 3}
    
  }
  
  Display(){
    stroke(0)
    if(this.hover){fill(230,100)}else{fill(210,100)}
    
    
    rect(this.x - this.w/2,this.y,this.w,this.h, 4) // Body
    
    if(this.img != null){image(this.img,this.x - this.w/2 + 40,this.y +this.message.length/2 + 80, this.img.width/2,this.img.height/2)}
    
    fill(this.profilecolour)
    ellipse(this.x - this.w/2 + 30 , this.y + 30, 40,40) // Profile Picture
    fill(0);
    textSize(20)
    stroke(220)
    text(this.name, this.x - this.w/2 + 80, this.y + 30)
    
    textSize(15)
    
    text(this.message, this.x - this.w/2 + 30, this.y + 80)
    

  }
}
let correctpop;
let incorrectpop;

let explosions = [];
let postseperation = 5
let postsize = 400;
let messagebarsize = 150;
let images = [];

let posts = [];
let postmessages = 
[
"How much wood could a woodchuck chuck\nif a woodchuck could chuck would?",
"A woodchuck would chuck as much wood\nas a woodchuck could chuck if a woodchuck\ncould chuck wood.",
"Starbucks makes the WORST coffee!",
"Ol' Mc Donald had a farm",
"The password for the super secret file is 'password123'.\nDon't tell anyone else",
"The end is Nigh!"
]

let chats = []
let chatmessages = 
[
"We should meet up",
"the cat is out of the bag",
"i'm at the shops rn",
"do you know where to go?",
"My password is: 'qwerty12345'",
"that DOES matter."
]
function preload(){
  images.push(loadImage('cat image.jpg'))
  images.push(loadImage("images/creditcard1.png"))
}
function setup() {
  createCanvas(1000, 800);
  correctpop = loadSound("sounds/correctpop.mp3")
  incorrectpop = loadSound("sounds/incorrectpop.mp3")
  
  posts.push(new Post("Jane Doe",350,100))
  posts.push(new Post("Jane Doe",200,90))
  posts.push(new Post("Jane Doe",450,60))
  posts.push(new Post("Jane Doe",550,60))

  for(let i = 0; i < posts.length; i++){
    let randmessage = int(random(0,postmessages.length))
    if(randmessage == 4){posts[i].good = false;}
    posts[i].message = postmessages[randmessage]
  }
  
  chats.push(new ChatMessage(650,100))
  chats.push(new ChatMessage(600,90))
  chats.push(new ChatMessage(720,60))
  chats.push(new ChatMessage(650,60)) 
  
  for(let i = 0; i < chats.length; i++){
    let randmessage = int(random(0,chatmessages.length))
    if(randmessage == 4){chats[i].good = false;}
    chats[i].message = chatmessages[randmessage] 
    chats[i].x -= chats[i].message.length +10
    chats[i].w += chats[i].message.length + 35
  }
}

function draw() {
  background(220);
  rectMode(CORNER)
  fill(255)
  
    
  for(let i = 0; i < explosions.length; i++){
    if(explosions[i].parent.ischat == false){
      explosions[i].Update();
      explosions[i].Display();      
    }
  }
  for(let i = 0; i < explosions.length;i++){
    if(explosions[i].x < -100){explosions.splice(i,1)}
  }
  for(let i = 0; i < posts.length; i++){
    posts[i].Update();
    posts[i].Display();
  }
  for(let i = 0; i < posts.length; i ++)
    {
      if(Hover(posts[i].x - posts[i].w/2, posts[i].y, posts[i].x + posts[i].w/2, posts[i].y + posts[i].h)){
        posts[i].hover = true
      }
      else{posts[i].hover = false;}
    }
  
  
  DrawEnvironment();
  for(let i = 0; i < explosions.length; i++){
    if(explosions[i].parent.ischat){
      explosions[i].Update();
      explosions[i].Display();      
    }
  }
  for(let i = 0; i < chats.length; i++){
    chats[i].Update();
    chats[i].Display();
  }
  for(let i = 0; i < chats.length; i ++)
    {
      if(Hover(chats[i].x - chats[i].w/2, chats[i].y, chats[i].x + chats[i].w/2, chats[i].y + chats[i].h)){
        chats[i].hover = true
      }
      else{chats[i].hover = false;}
    }  
  
}

function mousePressed()
{
  for(let i = 0; i < posts.length; i++){
    if(posts[i].hover)
    {
      let e = new Explosion(posts[i],posts[i].x - posts[i].w/2, posts[i].y, posts[i].w, posts[i].h) // outer pressure wave
      let e2 = new Explosion(posts[i],e.x, e.y, e.w, e.h) // inner pressure wave
      e2.thickness = 3
      e2.growthrate = e.growthrate/2
      explosions.push(e)
      explosions.push(e2)     
      if(posts[i].good == false){
        correctpop.stop();
        correctpop.play();        
      }else{
        incorrectpop.stop();
        incorrectpop.play();         
      }
      posts.splice(i,1);
      
      let newpost = new Post("Jane Doe",800,60)
      let randmessage = int(random(0,postmessages.length))
      
      
      if(randmessage == 4){newpost.good = false;}
      
      newpost.message = postmessages[randmessage]
      if(random(0,10) < 3){
        let randimg = int(random(0,images.length));
        newpost.img = images[randimg];
        if(randimg == 1){newpost.good = false;}
      }
      posts.push(newpost)
    }
    
  }
  for(let i = 0; i < chats.length; i++){
    if(chats[i].hover){
      let e = new Explosion(chats[i],chats[i].x - chats[i].w/2, chats[i].y, chats[i].w, chats[i].h) // outer pressure wave
      let e2 = new Explosion(chats[i],e.x, e.y, e.w, e.h) // inner pressure wave
      e2.thickness = 3
      e2.growthrate = e.growthrate/2
      explosions.push(e)
      explosions.push(e2)
      if(chats[i].good == false){
        correctpop.stop();
        correctpop.play();        
      }else{
        incorrectpop.stop();
        incorrectpop.play();         
      }
      chats.splice(i,1);

      
      let newchat = new ChatMessage(750,60)
      let randmessage = int(random(0,chatmessages.length))
      
      
      if(randmessage == 4){newchat.good = false;}
      
      newchat.message = chatmessages[randmessage]
      newchat.x -= newchat.message.length +10
      newchat.w += newchat.message.length + 35
      chats.push(newchat)
    }
  }
}
function mouseReleased(){}

// FUNCTIONS

function DrawEnvironment()
{
  fill(130,130,200)
  rect(100,40,800,60) // Menu Bar
  
  rect(300,120,450,20) // Sub Bar 1
  rect(300,150,450,20) // Sub Bar 2
  
  fill(240)
  rect(140,55,250,30) // Search Bar
  fill(100,100,200)
  
  noStroke()
  rect(390,55,30,30) // Search Button
  
  ellipse(475,70,30,30) // Menu Circle
  
  triangle(510,85, 540,85,525,55) // Menu Triangle
  
  rect(560,55,30,30) // Menu Square
  
  fill(200,100,100)
  ellipse(535,55, 15,15) // Triangle Notification
  ellipse(590,55, 15,15) // Square Notification
  
  fill(130,110,200)
  rect(600,400,300,30) // Chat Bar
  fill(240)
  rect(600,430,300,350) // Chat Box
  fill(230)
  rect(600,730,300,40) // Chat Type
  
  
}
function Hover(topleftx, toplefty, bottomrightx, bottomrighty){
      if (mouseX > topleftx && mouseX < bottomrightx && mouseY > toplefty && mouseY < bottomrighty){
        return true;
      } else{return false;}
}
/*Is thing A overlapping thing B at all (touching eachother)*/
function Touching(A, B){

  if(B.y >= A.x + A.y  ){return true;}
}