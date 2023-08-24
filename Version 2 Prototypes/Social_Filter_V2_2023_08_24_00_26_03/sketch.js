class Room{
  
  constructor(x,y,w,h){
    this.x = screen_x;
    this.y = screen_y
    this.w = screen_w
    this.h = 70
    this.spacer = 15;
    this.posts = []
    this.chat_boxes = []
    
    this.Header = null; // Draw the top menu/search bar 
    this.DrawPost = null; // Function to draw the posts according to the style of this room
    this.ImageFormat = null; // Function used to change the sizes and format dictating how images are drawn.
    this.GeneratePost = null; // How post are generated for this site/app

    this.initial_offset = 30;
    this.site_name = "";
    
    this.banner_active = false;
  }
  Display(){
    
    this.Header()
    this.DisplayElements()

  }
  DisplayElements(){
    for(let i = 0; i < this.posts.length;i++){
      if(this.posts[i].y <= displayHeight && this.posts[i].y + this.posts[i].h > 0){
        this.DrawPost(this.posts[[i]])
      }
      
    }

  }
  
  Move(value){
    this.y += value;
    if(this.y >screen_y ){this.y = screen_y }
    let offset = this.initial_offset;
    for(let i = 0; i < this.posts.length;i++){
      this.posts[i].y = this.y + this.h + offset;
      offset+=this.posts[i].h+ this.spacer;
    }
  }
  

  
  DrawBannerNotification(){
    push()
    strokeWeight(0.6)
    stroke(240,180)
    fill(200,175)
    rect(screen_x + 10,screen_y,screen_w - 20,70, 12)
    textSize(14)
    fill(20)
    strokeWeight(0.8)
    stroke(0)
    text("You have new messages to view! \nCome take a look!",screen_x + 25,screen_y + 40)
    textSize(20)
    fill(20)
    
    fill(this.banner_logo_colour)
    stroke(this.banner_logo_colour)
    textFont(this.logo_font)
    text(this.site_name,screen_x + 15,screen_y + 25)
    
    fill(220,0,0)
    noStroke()
    ellipse(screen_x +textWidth(this.site_name)*1.3,screen_y + 12,12)
    pop()
  }
  
}


class Post{
  constructor(room){
    
    this.name = ""
    // The messages should inherit from their spawner
    this.x = screen_x;
    this.y = screen_y;
    
    if(room.posts.length >0){
      let previous = room.posts[room.posts.length-1]
      this.y = previous.y + previous.h + room.spacer
    } else{
      this.y = room.y + room.h + room.spacer
    }
  
    this.w = screen_w
    this.h = 175;
    
    this.room = room;
    
    this.images = [];
    this.message = "";
    // Attachments should,when clicked on, create a pop-up showing what the file is. For now it will be a page with a big "DON'T SHARE" or something
    // Can be iterated on at some later date
    this.attachments = []; 
    
    this.displayed_image_index = 0;
    this.hover = false;
    
    this.next_button_center_x = this.x + this.w - 55;
    this.next_button_center_y = this.y + this.h -150;

    // The arrao button to view the previous image
    this.prev_button_center_x = this.x + 55;
    this.prev_button_center_y = this.y + this.h -150;    
    
    this.button_radius = 55;
    this.safe = true;
    
  }
  AddImage(img){
    if(this.images.length == 0 && this.room == instagram_room ){
      let ratio = img.width/img.height
      this.h+=this.w * ratio - 60;
    } else if(this.images.length == 0 ){
      this.h += 100
    }
    this.images.push(img)
    this.name += ""
    
  }
  AttachFile(){}
  Update(){
    // The arrow button to view the next image
    this.next_button_center_x = this.x + this.w - 55;
    this.next_button_center_y = this.y + this.h -150;

    // The arrao button to view the previous image
    this.prev_button_center_x = this.x + 55;
    this.prev_button_center_y = this.y + this.h -150;  
    
    
  }
  Pressed(){
    // Increment points / progress / ...
    
    // Splice self from arrays, delete this object
  }
  
  Display(){
    // ...
    // display at this.x + room.x, this.y + room.y
  }
  
}


class Explosion{
  
  constructor(p,x,y,w,h){
    this.parent = p;
    this.x = x + w/4;
    this.y = y + h/4;
    this.w = w /2;
    this.h = h/2;
    this.edge_rounding = 0;
    this.growth_rate = 20
    this.fade = 255;
    this.fade_rate = 40
    this.thickness = 5
    this.colour = color(255,0,0)
    if(this.parent.safe == false){this.colour = color(0,255,0)}

    
  }
  Update(){
    this.x -= this.growth_rate;
    this.y -= this.growth_rate;
    this.w += this.growth_rate * 2;
    this.h += this.growth_rate * 2;
    this.growth_rate += 0.8;
    this.edge_rounding += 25
    this.fade -= this.fade_rate
    
  }
  Display(){
    noFill()
    stroke(this.colour,this.fade)
    strokeWeight(this.thickness);
    rect(this.x, this.y, this.w, this.h, this.edge_rounding)
    fill(255)
    stroke(0)
    strokeWeight(1)
  }
}

class PointBubble{
  constructor(v){
    this.value = v;
    this.x = random(100,320);
    this.y = 500;
    this.size= 10;
  }
  
  Update(){
    this.y-=3;
    this.size = min(this.size+1,50);
    this.size = map(this.y,200,500,50,15)
    this.x += (210 - this.x) *0.006 // gravitate to x = 210
    if(this.y < 200){
      current_points += this.value;
      point_bubbles.splice(point_bubbles.indexOf(this), 1);
      
    }
  }
  Display(){
    push()
    textAlign(CENTER)
    textFont('Comic Sans MS')
    textSize(this.size)
    
    if(this.value > 0){
      fill(0,255,0)
      text("+" + this.value,this.x,this.y)
    }else{
      fill(255,0,0)
      text( this.value,this.x,this.y)
    }
    pop()
  }
  Combine(other){
    let combined = new PointBubble(this.value + other.value)
    //combine.y = min(this.y,other.y)
    //combined.size = (this.size + other.size)/2
    combined.y = (this.y + other.y) / 2
    combined.size+=2
    point_bubbles.push(combined)
    
    point_bubbles.splice(point_bubbles.indexOf(this), 1);
    point_bubbles.splice(point_bubbles.indexOf(other), 1);

    
  }
}

let first_names = ["Darien",
                   "Shyanne","Ariel","Skyler","Janae","Amira","Cailyn","Athena","Daron","Mohammed","Korbin","Leanne","Tiffani","Tonya", "Michaela","Griffin","Harrison","Beverly","Easton","Jensen", "Samantha", "Jackie", "Arnold", "Ben", "Kyle", "Justin", "Mary", "Jenny", "Kate", "Tess", "Kylie", "Millie", "Tyson", "Taylor"];

let last_names = ["Winkler",
                  "Hulsey","Lehmann","Han","Hand","Arreola","Ma","Bowles","Donnelly","Monahan",  "Littleton","Razo","Samson","Faircloth","Deaton","Huerta","Locke","McFadden","Bush","Graff", "Forman", "Smith", "Doe", "Carpenter", "Rich", "Wild", "Hunter", "Minx", "Malfoy", "Potter", "Weasly", "Dell", "Gates", "Digger", "Maxim", "Maximoff","Quell", "Little", "Henderson", "Juble", "Marks", "Quick", "Stone"];

let benign_post_messages = [
  "Yellow fruits have a clear winner\nWhile other fruits like pineapples and lemons are also beloved, nothing compares to the versatility and health benefits of 🍌the almighty banana.🍌",
  "Whether it's sliced up on your cereal or blended into a protein shake, bananas pack a nutritional punch and give us the energy we need to tackle the day. Plus, they taste great!",
  "Velociraptors may be famous, but they are not the most impressive dinosaurs. The Stegosaurous is the real MVP",
  "A duck walked up to the lemonade stand...",
  "Everyone has their favorite, but it's hard to deny the massive impact that the most popular movie has had on our culture: Scott Pilgim v.s The World",
  "Happy Birthday Jacquie! Hope you have a wonderful day.",
  "Archeologists from the University of San Marcos have unearthed a mummy in Peru estimated to be 800 to 1,200 years old. ",
  "I literally don't care what temperature you want,what part of the oven,or what cooking time. You're going on top at 200c and i'll check on your wellbeing in 20 minutes."
]
let malicous_post_messages = [
  "Hey check this out!\nI just got myself a free $500 gift card to woolies. I'm gonna have so much fun! You should get one yourself.\n check the link below!\n http://2url.org/?576743",
  "A bit random but here you go. I found a site where you can watch some bg movies for free in HD. \n Ted 2 >> http://bit.ly/5T6i83 \n Minions >> http://bit.ly/9tu58 \n Edge of Tomorrow >> http://bit.ly/dj3E3q  Registration is absolutely free, just prove you're not a robot. You're Welcome :)",
  "Her Emainl: alcewest428@gmail.com\nInvest with Alice West Wilford on Cryptocurrency. My profile earned on her platform just reflected on my wallet just now.\nWhatsApp : +1606268043",
  "Mark Zuckerberg CEO of Facebook invented the word BFF, to make sure your account is safe on Facebook Type BFF in the comment, if it appears green, your account is protected. If it does not appear in green, change your password immediatly because it may be hacked by someone\nSHare & type BFF!!",
  "If anyone needs Free Steam Money, than the safest way of getting it is to get it from this site: \n www.steamwallet.freetophackforyou.com\ni have a frend that works at this site and he told me about this secret, a lot of people are using this method now...",
  "For👏A👏Good👏Time👏 \n http://bit.ly/gjT54 ",
  "🔥 Unlock  the Secret: Turn $20 into $1000 in Hours! Limited Time Offer - Act Now!\nHey there! Ready for a financial upgrade? Transform a small investment of $20 into a whopping $1000 with our exclusive system. 🚀💰 \n✅ Quick and easy process \n✅ Thousands have already benefited\n✅ Secure your spot now\nClick the link below for details!\n👉 [Link] 👈",
  ""
]

let malicous_names = [
  "______________ssm",
  "\u2764 Mary ",
  "\u2764 m.y p.i.c.s💋h.e.r.e😍 ->  ",
  "Fancy",
  "Holly",
  "NotUrType",
  "Snap-A-Holic",
  "Cuddle_Puppy",
  "xX.",
  "UWU_Lily",
  "\u2764 \u2764 Jane", 
  "X.need.x.it.free.com"
]


let correct_pop;
let incorrect_pop;

let explosions = [];
let point_bubbles = [];
let post_seperation = 5
let benign_images = [];
let malicous_images = [];
let placholder_image;

let previous_banner_time = 0;
let any_banner_active = false;
// https://anyword.com/social-post-generator/     Use to generate the posts 


let phone_x = 400;
let phone_y = 0;
let phone_w = 415;
let phone_h = 750;

let screen_x = phone_x + 25;
let screen_y = phone_y + 25;
let screen_w = phone_w - 50;
let screen_h = phone_h - 50;

let twitter_logo_img;

let current_room;
let current_points = 0

let facebook_room;
let instagram_room;
let twitter_room;

let malicous_chance = 50;
let current_room_index =1;
let rooms = []
function preload(){
  benign_images.push(loadImage('images/placeholder_male.bmp'))
  benign_images.push(loadImage("images/placeholder_female.bmp"))
  
  benign_images.push(loadImage('images/birthday.jfif'))
  benign_images.push(loadImage('images/cooking.jfif'))
  benign_images.push(loadImage('images/cute.jfif'))
  benign_images.push(loadImage('images/first.jfif'))
  benign_images.push(loadImage('images/download.jfif'))
  benign_images.push(loadImage('images/nature.jfif'))
  benign_images.push(loadImage('images/paint.jfif'))
  benign_images.push(loadImage('images/fruit.jfif'))
  
  malicous_images.push(loadImage("images/password_background.jpg"))
  malicous_images.push(loadImage("images/password mistake.jfif"))
  malicous_images.push(loadImage("images/creditcard.jpg"))
  malicous_images.push(loadImage("images/creditcard1.png"))
  malicous_images.push(loadImage("images/creditcard2.jfif"))
  
  twitter_logo_img = loadImage("images/twitter logo.png")
  
  placeholder_image = loadImage("images/placeholder.bmp")
}
function setup() {
  createCanvas(1200, windowHeight);
  correct_pop = loadSound("sounds/correctpop.mp3")
  incorrect_pop = loadSound("sounds/incorrectpop.mp3")
  
  
  twitter_logo_img.resize(50,0)
  
  facebook_room = new Room(); // Facebook Style
  facebook_room.site_name = "Facebook";
  facebook_room.initial_offset = 120;
  facebook_room.logo_font = 'Klavika';
  facebook_room.banner_logo_colour = color(59,89,152)
  facebook_room.ImageFormat = function(p){
    
    for(let j = 0; j < p.images.length;j++){
      //p.images[j].resize(p.w - 60,0)
      //p.images[j].resize(0,min(p.images[j].height,170))

    }
       
  }
  facebook_room.GeneratePost = function(){

    let temp_post = new Post(this)

    this.posts.push(temp_post)
    
    if(random(0,100) < malicous_chance){ // Benign
      temp_post.name = random(first_names) +" "+ random(last_names)

      temp_post.message = random(benign_post_messages)
      temp_post.h += temp_post.message.length /13 * 5
      let picture_chance = int(random(0,100))

      while(picture_chance >= 60){
        temp_post.AddImage(random(benign_images))
        picture_chance-= random(10,40)
      }
          
    }else{ // Malicous / spam
      temp_post.safe = false;
      temp_post.name = random(malicous_names)
      
      temp_post.message = random(malicous_post_messages)
      temp_post.h += temp_post.message.length /13 * 5
      
      let picture_chance = int(random(0,100))
      while(picture_chance >= 60){
        temp_post.AddImage(random(benign_images))
        picture_chance-= random(10,40)
      }
    }

  }
  facebook_room.Header = function(){
    // Search Bar
    push()
    fill(190,190,196)
    rect(screen_x,screen_y,screen_w,screen_h)
    noStroke()
    fill(80,80,230)
    rect(this.x,this.y,this.w,this.h)
    fill(10,10,150)
    rect(this.x + 20,this.y + 15,this.w - 40,this.h - 30)
    fill(80,80,230)
    textSize(25)
    text("Search", this.x + 70,this.y + 43)
    
    // Menu Bar
    fill(240)
    rect(this.x,this.y + this.h ,this.w,this.h - 20)
    fill(170)
    textSize(22)
    text("Status",this.x + 40,this.y + this.h + 33)
    text("Photo", this.x + 140, this.y + this.h + 33)
    text("Checkin", this.x + 230, this.y + this.h + 33)
    
    fill(255)
    noStroke()
    rect(this.x,this.y + this.h +50,this.w, 60)
    
    // Profile Picture
    fill(220)
    stroke(20)
    strokeWeight(2)
    ellipse(this.x + 30,this.y + this.h+ 80,35,35)
    ellipse(this.x + 30,this.y + this.h+85,20,20)
    ellipse(this.x + 30,this.y + this.h+75,15,15)
    
    noFill()
    strokeWeight(1)
    rect(this.x + 50,this.y + this.h +60,this.w - 60, 40,20)
    textSize(16)
    fill(0)
    noStroke()
    text("What are you thinking about?",this.x + 70,this.y + this.h + 85)
    pop() 
    
    // How posts 
  }
  facebook_room.DrawPost = function(post) {
    
    DrawFacebookPost(post)
  }
  rooms.push(facebook_room)
  
  instagram_room = new Room(); // Instagram Style
  instagram_room.site_name = "Instagram";
  instagram_room.initial_offset = 61;
  instagram_room.logo_font = 'Billabong'
  instagram_room.banner_logo_colour = color(0)
  instagram_room.Header = function(post){
    push()
    fill(230)
    rect(this.x,this.y,this.w,this.h + 60 )
    
    //Camera Icon
    noFill()
    strokeWeight(3)
    stroke(200)
    rect(this.x + 12,this.y + 12, 29,24, 5)
    ellipse(this.x + 30,this.y + 24, 10,10)
    
    // Paper Plane Icon
    strokeWeight(2)
    beginShape()
    vertex(this.x + this.w - 25, this.y + 40)
    vertex(this.x + this.w - 15, this.y + 15)
    vertex(this.x + this.w - 35,this.y + 20)
    endShape(CLOSE)
    
    //Logo
    strokeWeight(0)
    fill(0)
    textSize(25)
    textFont(this.logo_font)
    text("Instagram", this.x + this.w/3,this.y + 35)
    
    
    // Profile Pictures
    textSize(12)
    fill(220)
    stroke(20)
    strokeWeight(2)
    ellipse(this.x + 50,this.y + this.h+ 10,55)
    ellipse(this.x + 50,this.y + this.h+16,40)
    ellipse(this.x + 50,this.y + this.h,30)

    
    ellipse(this.x + 150,this.y + this.h+ 10,55)
    ellipse(this.x + 150,this.y + this.h+16,40)
    ellipse(this.x + 150,this.y + this.h,30)
    
    ellipse(this.x + 250,this.y + this.h+ 10,55)
    ellipse(this.x + 250,this.y + this.h+16,40)
    ellipse(this.x + 250,this.y + this.h,30)

    ellipse(this.x + 350,this.y + this.h+ 10,55)
    ellipse(this.x + 350,this.y + this.h+16,40)
    ellipse(this.x + 350,this.y + this.h,30)
    
    noStroke();
    fill(20)
    text("Markus",this.x + 35,this.y + this.h + 50)
    text("Jannet",this.x + 135,this.y + this.h + 50)
    text("Jerry",this.x + 240,this.y + this.h + 50)
    text("Martha",this.x + 340,this.y + this.h + 50)
    
    pop()
  }
  instagram_room.ImageFormat = function(p) {
      for(let j = 0; j < p.images.length;j++){
        //p.images[j].resize(screen_w,0)
        //let difference = p.images[j].height - (p.h-160)
        p.h = max(p.h,100 +p.images[j].height)

      }
      
  }
  instagram_room.GeneratePost = function(){
    let temp_post = new Post(this)

    
    if(random(0,100) < malicous_chance){
      temp_post.name = random(first_names) +" "+  random(last_names)

      temp_post.AddImage(random(benign_images)) // Minimum one image
      let picture_chance = int(random(0,100))

      while(picture_chance >= 70){
        temp_post.AddImage(random(benign_images))
        picture_chance-= random(10,40)
      }     
    } else{
      temp_post.safe = false;
      temp_post.AddImage(random(malicous_images)) // Minimum one image
    }
    this.posts.push(temp_post)
  }  
  instagram_room.DrawPost = function(post) {
    
    DrawinstagramPost(post)
  } 
  rooms.push(instagram_room)
  
  twitter_room = new Room(); // Twitter Style
  twitter_room.site_name = "Twitter";
  twitter_room.initial_offset = 0;
  twitter_room.spacer = 0;
  twitter_room.logo_font = 'Segoe UI'
  twitter_room.banner_logo_colour = color(0,172,238)
  twitter_room.Header = function(){
    push()
    fill(255)
    noStroke()
    rect(this.x,this.y,this.w,this.h )
    
    rectMode(CENTER)
    image(twitter_logo_img,this.x + this.w/2 - twitter_logo_img.width/2 ,this.y + 20)
    rectMode(CORNER)
    
    // Burger menu icon (top-left)
    strokeWeight(4)
    stroke(0,172,238)
    line(this.x + 20,this.y + 25,this.x + 45,this.y + 25)
    line(this.x + 20,this.y + 35,this.x + 45,this.y + 35)
    line(this.x + 20,this.y + 45,this.x + 45,this.y + 45)
    
    // Particles Icon (top-right)
    strokeWeight(2)
    noFill()
    beginShape()
    endShape(CLOSE)

    pop()    
  }
  twitter_room.GeneratePost = function(){
    let temp_post = new Post(this)

    this.posts.push(temp_post)
    
    if(random(0,100) < malicous_chance){ // Benign
      temp_post.name = random(first_names) +" "+ random(last_names)

      temp_post.message = random(benign_post_messages)
      temp_post.h += temp_post.message.length /13 * 5
      let picture_chance = int(random(0,100))

      while(picture_chance >= 60){
        temp_post.AddImage(random(benign_images))
        picture_chance-= random(10,40)
      }
          
    }else{ // Malicous / spam
      temp_post.safe = false;
      temp_post.name = random(malicous_names)
      
      temp_post.message = random(malicous_post_messages)
      temp_post.h += temp_post.message.length /13 * 5
      
      let picture_chance = int(random(0,100))
      while(picture_chance >= 60){
        temp_post.AddImage(random(benign_images))
        picture_chance-= random(10,40)
      }
    }
}
  twitter_room.ImageFormat = function(p){
      for(let j = 0; j < p.images.length;j++){
        p.images[j].resize(p.w   ,0)
        let difference =p.images[j].height - (p.h-100)
        //p.images[j].resize(0,p.images[j].height - difference)  

      }
    
  }
  twitter_room.DrawPost = function(post) {
    
    DrawTwitterPost(post)
  }  
  rooms.push(twitter_room)
  
  // Test posts
  /*
  let test_facebook_post_a = new Post(facebook_room)
    test_facebook_post_a.name = "Tyler Hardy"
    test_facebook_post_a.AddImage(images[int(random(0,images.length-1))])
    test_facebook_post_a.message = "Yellow fruits have a clear winner\nWhile other fruits like pineapples and lemons are also beloved, nothing compares to the versatility and health benefits of the almighty banana.";
    test_facebook_post_a.h +=40;    
  
  
  let test_facebook_post_b = new Post(facebook_room)
    test_facebook_post_b.name = "Mark Gibbs"
    test_facebook_post_b.message = "Whether it's sliced up on your cereal or blended into a protein shake, bananas pack a nutritional punch and give us the energy we need to tackle the day. Plus, they taste great!";
    test_facebook_post_b.h +=40;

  let test_facebook_post_c = new Post(facebook_room)
    test_facebook_post_c.name = "Ainz Ooal Gown"
    test_facebook_post_c.AddImage(images[int(random(0,images.length-1))])
    test_facebook_post_c.AddImage(images[int(random(0,images.length-1))])
    test_facebook_post_c.AddImage(images[int(random(0,images.length-1))])
  
  
  facebook_room.posts.push(test_facebook_post_a)
  facebook_room.posts.push(test_facebook_post_b)
  facebook_room.posts.push(test_facebook_post_c) 
  
  
  let test_instagram_post_a = new Post(instagram_room)
  test_instagram_post_a.name = "Anthony"
  //test_instagram_post_a.next_button_center_y-=15;
  //test_instagram_post_a.prev_button_center_y-=15
  test_instagram_post_a.AddImage(images[int(random(0,images.length-1))])
  test_instagram_post_a.AddImage(images[int(random(0,images.length-1))])
  test_instagram_post_a.AddImage(images[int(random(0,images.length-1))])
  
  let test_instagram_post_b = new Post(instagram_room)
  test_instagram_post_b.name = "Mary Abbot"
  test_instagram_post_b.AddImage(images[int(random(0,images.length-1))])

  let test_instagram_post_c = new Post(instagram_room)
  test_instagram_post_c.name = "Graham McNeill"
  test_instagram_post_c.AddImage(images[int(random(0,images.length-1))])
  
  
  instagram_room.posts.push(test_instagram_post_a)
  instagram_room.posts.push(test_instagram_post_b)
  instagram_room.posts.push(test_instagram_post_c) 

  
  let test_twitter_post_a = new Post(twitter_room)
  test_twitter_post_a.name = "Markus Aurelius"
  test_twitter_post_a.message = "Velociraptors may be famous, but they are not the most impressive dinosaurs. The Stegosaurous is the real MVP"
  
  let test_twitter_post_b = new Post(twitter_room)
  test_twitter_post_b.name = "Nero Germanicus"
  test_twitter_post_b.message = "A duck walked up to the lemonade stand..."
  test_twitter_post_b.AddImage(images[0])
  test_twitter_post_b.AddImage(images[1])
  test_twitter_post_b.AddImage(images[1])
  
  
  let test_twitter_post_c = new Post(twitter_room)
  test_twitter_post_c.name = "Gabriel Uwriyel"
  test_twitter_post_c.message = "Everyone has their favorite, but it's hard to deny the massive impact that the most popular movie has had on our culture: Scott Pilgim v.s The World"
  
  
  twitter_room.posts.push(test_twitter_post_a)
  twitter_room.posts.push(test_twitter_post_b)
  twitter_room.posts.push(test_twitter_post_c) 
  
  */
  
  for(let i = 0; i < rooms.length;i++){
    for(let j = 0; j < 10;j++){
      rooms[i].GeneratePost()
      rooms[i].ImageFormat(rooms[i].posts[rooms[i].posts.length-1])
    }   
  }
  current_room = rooms[current_room_index];
  current_room.Move(0)
  
  
}
function draw() {
  background(220);
  rectMode(CORNER)
  
  if(any_banner_active == false && millis() - previous_banner_time >60000 ){ // 1 minute
    current_room_index++;
    if(current_room_index>= rooms.length){current_room_index = 0;}
    rooms[current_room_index].banner_active = true;
    any_banner_active = true;
    previous_banner_time = millis();
  }
  DrawPhone()
  for(let i = 0; i < rooms.length;i++){
    if(rooms[i].banner_active){
      any_banner_active = true;
      rooms[i].DrawBannerNotification()
    }
  }
  for(let i = 0; i < explosions.length; i++){
    explosions[i].Update();
    explosions[i].Display();      
    
  }
  for(let i = 0; i < explosions.length;i++){
    if(explosions[i].x < -100){explosions.splice(i,1)}
  }

  
  
  for(let i = 0; i < current_room.posts.length;i++){
    let post = current_room.posts[i]
    post.Update()
  }
  
  for(let i = 0; i < point_bubbles.length;i++){
    point_bubbles[i].Display();
    if(i+1 < point_bubbles.length &&point_bubbles[i+1].y - point_bubbles[i].y < 30) {
      point_bubbles[i].Combine(point_bubbles[i+1])
    }
    point_bubbles[i].Update();
    
  }
  
  
  
  push()
  textStyle(BOLD)
  fill(200 - current_points * 10,120 + current_points * 10,0)
  noStroke()
  textFont('Comic Sans MS')
  textSize(50)
  text("POINTS", 70,150)

  text(current_points,210,200)
  
    // If the last post has entered the screen need to generate another
  // Infiniate Scrolling
  if(current_room.posts.length <1 ||current_room.posts[current_room.posts.length-1].y < height){ 
    current_room.GeneratePost()
    current_room.ImageFormat(current_room.posts[current_room.posts.length-1])

  }
  pop()
}


function DrawFacebookPost(post) {
    // Post Head
    push()
    fill(255)
    noStroke()
    strokeWeight(3)
    rect(post.x,post.y,post.w ,post.h)
    stroke(0)
    strokeWeight(2)
    fill(200)
    ellipse(post.x + 40,post.y + 30,35,35)
    ellipse(post.x + 40,post.y + 35,20,20)
    ellipse(post.x + 40,post.y + 25,15,15)
    fill(0)
    textSize(18)
    noStroke()
    text(post.name,post.x + 70,post.y + 35)
    
    //top-right corner ellipsis
    fill(140)
    ellipse(post.x + post.w - 45,post.y + 38, 5)
    ellipse(post.x + post.w - 35,post.y + 38, 5)
    ellipse(post.x + post.w - 25,post.y + 38, 5)
    pop()
    // Post Image Gallary
    if(post.images.length > 0){
      push()
      noFill()
      strokeWeight(0.5)
      stroke(160)
      rectMode(CENTER)
      let ratio = post.images[post.displayed_image_index].width/post.images[post.displayed_image_index].height ;
      image(post.images[post.displayed_image_index],post.x+30 + (post.w - 60 )/2 - 170*ratio / 2,post.y+post.message.length /13 * 5 + 80, 170*ratio,170)

      
      rectMode(CORNER)

      if(post.images.length > 1){
        let distance = dist(mouseX,mouseY,post.next_button_center_x,post.next_button_center_y)
        fill(map(distance,0,50,100,150)) // map so that the colour changes slightly when near the button
        noStroke()
        if(distance <post.button_radius){
          ellipse(post.next_button_center_x,post.next_button_center_y,post.button_radius)
        }



        distance = dist(mouseX,mouseY,post.prev_button_center_x,post.prev_button_center_y)
        fill(map(distance,0,50,100,150)) // map so that the colour changes slightly when near the button
        noStroke()
        if(distance < post.button_radius){
          ellipse(post.prev_button_center_x,post.prev_button_center_y,post.button_radius)
        }            
      }

      pop()
      
    }
  
    // Post Text
    push()
    fill(20)
    noStroke()

    text(post.message,post.x + 20,post.y + 70, post.w - 40  ,70)
  
    pop()
    
  
}

function DrawinstagramPost(post) {
    // Post Head
    push()
    fill(255)
    noStroke()
    strokeWeight(3)
    rect(post.x,post.y,post.w ,post.h)
    stroke(0)
    strokeWeight(2)
    fill(200)
    ellipse(post.x + 40,post.y + 30,35,35)
    ellipse(post.x + 40,post.y + 35,20,20)
    ellipse(post.x + 40,post.y + 25,15,15)
    fill(0)
    textSize(18)
    noStroke()
    text(post.name,post.x + 70,post.y + 35)
  
    // More/settings ellipsis in top-right corner
    fill(130)
    ellipse(post.x + post.w - 40,post.y + 30, 8)
    ellipse(post.x + post.w - 30,post.y + 30, 8)
    ellipse(post.x + post.w - 20,post.y + 30, 8)
  
    // Post footer
    fill(255)
    stroke(20)
    //rect(post.x,post.y + post.h - 100,post.w,100)
  
    // Comment chat post button
    ellipse(post.x + 80,post.y + post.h - 20, 30,25)
    strokeWeight(2)
    ellipse(post.x + 72,post.y + post.h - 20, 6)
    ellipse(post.x + 79,post.y + post.h - 20, 6)
    ellipse(post.x + 87,post.y + post.h - 20, 6)
    //line(post.x + 75,post.y + post.h - 25,post.x + 85,post.y + post.h - 25)
    //line(post.x + 75,post.y + post.h - 20,post.x + 85,post.y + post.h - 20)
    //line(post.x + 75,post.y + post.h - 15,post.x + 85,post.y + post.h - 15)
    
    // bookmark icon(bottom-right)
    stroke(20)
    strokeWeight(2)
    beginShape()
    vertex(post.x + post.w - 40,post.y + post.h - 10)
    vertex(post.x + post.w - 40,post.y + post.h - 30)
    vertex(post.x + post.w - 20,post.y + post.h - 30)
    vertex(post.x + post.w - 20,post.y + post.h - 10)
    vertex(post.x + post.w - 30,post.y + post.h - 15)
  
    
    endShape(CLOSE)
  
    pop()
    // Post Image Gallary
  
  
  
    if(post.images.length > 0){
      push()
      noFill()
      strokeWeight(0.5)
      stroke(160)

      
      let ratio = post.images[post.displayed_image_index].width/post.images[post.displayed_image_index].height
      image(post.images[post.displayed_image_index],post.x ,post.y+60, post.w,post.w * ratio )


      if(post.images.length > 1){
        let distance = dist(mouseX,mouseY,post.next_button_center_x,post.next_button_center_y)
        fill(map(distance,0,50,100,150)) // map so that the colour changes slightly when near the button
        noStroke()
        if(distance <post.button_radius){
          rect(post.x + post.w - 25,post.y + 10,20,post.h - 20, 10)
          
        }



        distance = dist(mouseX,mouseY,post.prev_button_center_x,post.prev_button_center_y)
        fill(map(distance,0,50,100,150)) // map so that the colour changes slightly when near the button
        noStroke()
        if(distance < post.button_radius){
          rect(post.x + 5 ,post.y + 10,20 ,post.h - 20, 10)

        }            
      }

      pop()
      
    }
    
  
  
  
}

function DrawTwitterPost(post) {
    
    // Post Head
    push()
    fill(255)
    stroke(120)
    strokeWeight(1)
    rect(post.x,post.y,post.w ,post.h)
  
    // Profile Picture
    stroke(0)
    strokeWeight(2)
    fill(200)
    ellipse(post.x + 40,post.y + 30,35,35)
    ellipse(post.x + 40,post.y + 35,20,20)
    ellipse(post.x + 40,post.y + 25,15,15)
    
    // Name Plate
    fill(0)
    textSize(18)
    noStroke()
    text(post.name,post.x + 70,post.y + 20, 300)
    pop()
  
    // Drop-down menu (top-right)
    push()
    noFill()
    stroke(120)
    beginShape()
    vertex(post.x + post.w - 35,post.y + 30)
    vertex(post.x + post.w - 30,post.y + 35)
    vertex(post.x + post.w - 25,post.y + 30)
    endShape()
    pop()
  
    // Try to use the other arguments in the image() function to fit the images to the boxes of the collage witout changing all of their sizes ising .resize(). 
    let shrink_factor_1 = 0.87
    let shrink_factor_2 = 0.44
    
    let image_y_pos = post.y+post.message.length /13 * 5 + 80
    
    let ratio_1 = 1;
    let ratio_2 = 1;
    let ratio_3 = 1;
    let ratio_0 = 1;
    switch(post.images.length){
        
      case 1:
        
        ratio_0 = post.images[0].width/post.images[0].height;
        push()
        noFill()
        strokeWeight(0.5)
        stroke(160)   
        rectMode(CENTER)
        post.images[0].resize(0,160)
        
        
        image(post.images[0],post.x+30 + (post.w - 60 )/2 - post.images[0].width / 2,image_y_pos, ratio_0 * 170,170)
        
        noFill()
        strokeWeight(10);
        stroke(255)
        rectMode(CORNER)
        
        rect(post.x+30 + (post.w - 60 )/2 - post.images[0].width / 2 - 4,image_y_pos - 4,170  * ratio_0+ 8,178 , 15)
        
        pop() 
        break
      case 2:
        ratio_0 = post.images[0].width/post.images[0].height;
        ratio_1 = post.images[1].width/post.images[1].height;
        push()
        noFill()
        strokeWeight(0.5)
        stroke(160)   
        rectMode(CENTER)
        
        //     Image                       midpoint of post offset by half image                    y pos            width                        height
        image(post.images[0], post.x + 30 + (post.w-60)/2 - 170*ratio_0 * shrink_factor_1, image_y_pos, 170 * ratio_0 * shrink_factor_1,170 * shrink_factor_1   )
        image(post.images[1], post.x + 30 + (post.w-60)/2                                         , image_y_pos, 170 * ratio_1 * shrink_factor_1,170 * shrink_factor_1   )
        
        
        
        noFill()
        strokeWeight(4);
        stroke(255)
        rectMode(CORNER)
        
        rect(post.x + 30 + (post.w-60)/2 - 170*ratio_0*shrink_factor_1 - 4,image_y_pos - 2, 170*ratio_0*shrink_factor_1 + 170*ratio_1*shrink_factor_1  +8,170 * shrink_factor_1 + 8, 15)
        
        pop()         
        break
      case 3:
        ratio_0 = post.images[0].width/post.images[0].height;
        ratio_1 = post.images[1].width/post.images[1].height;
        ratio_2 = post.images[2].width/post.images[2].height;
        push()
        noFill()
        strokeWeight(0.5)
        stroke(160)   
        rectMode(CENTER)

        
        // Bigger left picture
        image(post.images[0], post.x+30 + (post.w - 60 )/4 - 170 * ratio_0*shrink_factor_2 +shrink_factor_2*170*ratio_1/2 , image_y_pos, 170 * ratio_0 * shrink_factor_1, 170 * shrink_factor_1)
        
        // two right smaller pictures
        image(post.images[1], post.x+30 + (post.w - 60 )/4 - shrink_factor_2*170*ratio_1/2  + 170 * ratio_0*shrink_factor_1, image_y_pos, ratio_1*170*shrink_factor_2, 170 * shrink_factor_2)
        image(post.images[2], post.x+30 + (post.w - 60 )/4 - shrink_factor_2*170*ratio_2/2  + 170 * ratio_0*shrink_factor_1, image_y_pos + 170*shrink_factor_2, 170 * ratio_2*shrink_factor_2, 170 * shrink_factor_2)
        
        noFill()
        strokeWeight(4);
        stroke(255)
        rectMode(CORNER)
        
        rect(post.x+30 + (post.w - 60 )/4 - 170 * ratio_0*shrink_factor_2 +shrink_factor_2*170*ratio_1/2- 4, image_y_pos - 2, 170*ratio_0*shrink_factor_1 + max(170*ratio_1*shrink_factor_2,170*ratio_2*shrink_factor_2) + 8, 170*shrink_factor_1 + 8, 15)
        

        
        pop()       
        break
      case 4:
        ratio_0 = post.images[0].width/post.images[0].height;
        ratio_1 = post.images[1].width/post.images[1].height;
        ratio_2 = post.images[2].width/post.images[2].height;
        ratio_3 = post.images[3].width/post.images[3].height;
        push()
        noFill()
        strokeWeight(0.5)
        stroke(160)   
        rectMode(CENTER)
        
        image(post.images[0], post.x+30 + (post.w - 60 )/4 - post.images[0].width / 4, image_y_pos, post.images[0].width / 3, post.images[0].height / 3)
        image(post.images[1], post.x+30 + (post.w - 60 )/4 - post.images[0].width / 4, image_y_pos+ post.images[1].height/3, post.images[1].width / 3, post.images[1].height / 3)
        
        image(post.images[2], post.x+30 + (post.w - 60 )/4 - post.images[1].width / 4  + post.images[0].width/3, image_y_pos, post.images[1].width /3, post.images[1].height /3)
        image(post.images[3], post.x+30 + (post.w - 60 )/4 - post.images[3].width / 4 + post.images[0].width /3, image_y_pos+ post.images[1].height /3, post.images[3].width /3, post.images[3].height /3)
        
        noFill()
        strokeWeight(4);
        stroke(255)
        rectMode(CORNER)
        
        rect(post.x+30 + (post.w - 60 )/4 - post.images[0].width / 4 - 4,image_y_pos-2,post.images[0].width * 0.66  + 8 ,post.images[0].height * 0.66 + 4, 15)
        
        pop()    
    }
    // Post Image Gallary
    if(post.images.length > 0){
    }
  
  push()
  fill(20)
  noStroke()
  
  text(post.message,post.x + 70,post.y + 50, post.w - 110  ,70)
  pop()
    // Post Text
  
  
}

function DrawGenericPost(post) {
    
    // Post Head
    push()
    fill(255)
    noStroke()
    strokeWeight(3)
    rect(post.x,post.y,post.w ,post.h)
    stroke(0)
    strokeWeight(2)
    fill(200)
    ellipse(post.x + 40,post.y + 30,35,35)
    ellipse(post.x + 40,post.y + 35,20,20)
    ellipse(post.x + 40,post.y + 25,15,15)
    fill(0)
    textSize(18)
    noStroke()
    text(post.name,post.x + 70,post.y + 35)
    pop()
    // Post Image Gallary
    if(post.images.length > 0){
      push()
      noFill()
      strokeWeight(0.5)
      stroke(160)
      //rect(post.x + 15, post.y + 65,post.w - 30,post.h - 160)
      rectMode(CENTER)
      
      image(post.images[post.displayed_image_index],post.x+30 + (post.w - 60 )/2 - post.images[post.displayed_image_index].width / 2,post.y+80)
      rectMode(CORNER)

      if(post.images.length > 1){
        let distance = dist(mouseX,mouseY,post.next_button_center_x,post.next_button_center_y)
        fill(map(distance,0,50,100,150)) // map so that the colour changes slightly when near the button
        noStroke()
        if(distance <post.button_radius){
          ellipse(post.next_button_center_x,post.next_button_center_y,post.button_radius)
        }



        distance = dist(mouseX,mouseY,post.prev_button_center_x,post.prev_button_center_y)
        fill(map(distance,0,50,100,150)) // map so that the colour changes slightly when near the button
        noStroke()
        if(distance < post.button_radius){
          ellipse(post.prev_button_center_x,post.prev_button_center_y,post.button_radius)
        }            
      }

      pop()
      
    }
  
  push()
  if(post.censored){
    strokeWeight(14)
    stroke(200,0,0,200, 20)
    line(post.x + 16,post.y + 16,post.x + post.w - 16,post.y + post.h - 16)
    line(post.x + post.w - 16,post.y + 16,post.x + 16,post.y + post.h - 16)
  }
  fill(20)
  noStroke()
  
  text(post.message,post.x + 20,post.y + post.h - 70, post.w - 40  ,70)
  pop()
    // Post Text
  
  
}


function mousePressed(){
  
  // Banner notification to jump between Apps
  for(let i = 0; i < rooms.length;i++){
      if(rooms[i].banner_active){
        if(Hover(screen_x + 10,screen_y,screen_x + screen_w - 20, 70)){
          current_room = rooms[i];
          
          for(let i = 0; i < current_room.posts.length;i++){
            current_room.ImageFormat(current_room.posts[i])
          }
          current_room.Move(0);
          current_room_index = i;
          rooms[i].banner_active = false;
          any_banner_active = false;
          return;
        }
      }
    }  
  
  // Next/Previous image buttons
  for(let i = 0; i < current_room.posts.length;i++){
  let post = current_room.posts[i]
  post.Update()
    // Searching through images on a post (the next image button)
  if(post.images.length > 1){
    let distance = dist(mouseX,mouseY,post.next_button_center_x,post.next_button_center_y)
    if(distance <post.button_radius){
      post.displayed_image_index++;
      if(post.displayed_image_index >= post.images.length){post.displayed_image_index = 0;}
      return;
    }


    // Previous image on the post button
    distance = dist(mouseX,mouseY,post.prev_button_center_x,post.prev_button_center_y)
    if(distance < post.button_radius){
      post.displayed_image_index--;
      if(post.displayed_image_index < 0){post.displayed_image_index = post.images.length - 1;}
      return;
    }
    }

  }

  // Pop the posts
  for(let i = 0; i < current_room.posts.length; i++){
    let post = current_room.posts[i]
    if(Hover(post.x,post.y,post.x + post.w,post.y + post.h) )
    {
      let e = new Explosion(post,post.x, post.y, post.w, post.h) // outer pressure wave
      let e2 = new Explosion(post,e.x, e.y, e.w, e.h) // inner pressure wave
      e2.thickness = 3
      e2.growth_rate = e.growth_rate/2
      explosions.push(e)
      explosions.push(e2)
      if(post.safe == false){
        correct_pop.stop();
        correct_pop.play();  
        point_bubbles.push(new PointBubble(1))
        // Create a new point bubble thing that floats to the point total.
        // Only update the point total when in comes in contact
        // points earned closly together combine into single point bubble ( +2's +3's)
      }else{
        incorrect_pop.stop();
        incorrect_pop.play();
        point_bubbles.push(new PointBubble(-3))
        // Negitive point bubbles
      }
      if(current_room.posts.length <= 15){ // maintain a minimum of posts so as to not break the illusion
        current_room.GeneratePost()
        current_room.ImageFormat(current_room.posts[current_room.posts.length-1])            
      }
  
      current_room.posts.splice(i,1);
      current_room.Move(0)
      return;
      
      // Introduce new posts 
    }
    
  
  }
  
}
function mouseReleased(){}
function mouseWheel(event){
  current_room.Move(-event.delta)
  
 
  
}
// FUNCTIONS

function DrawPhone(){
  push()
  noStroke()
  fill(220)
  rect(0,0,windowWidth,windowHeight)
  
  // Draw what is on the screen
  strokeWeight(2)
  stroke(0)

  
  fill(140)
  current_room.Display()
  beginShape()
    vertex(phone_x,phone_y)
    vertex(phone_x + phone_w,phone_y)
    vertex(phone_x + phone_w, phone_y + phone_h)
    vertex(phone_x,phone_y + phone_h)
      beginContour()
      vertex(screen_x,screen_y + screen_h)
      vertex(screen_x + screen_w, screen_y + screen_h)
      vertex(screen_x + screen_w,screen_y)
      vertex(screen_x,screen_y)
      endContour()
  endShape(CLOSE)
  
  // to block out the top and bottom of the phone to prevent seeing the posts as they slide in and out of the phone vertically
  noStroke()
  fill(220)
  rect(phone_x,phone_y - 500,phone_w,500)
  rect(phone_x,phone_y + phone_h,phone_w,500)
  pop()
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