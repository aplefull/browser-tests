function music() {
var config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 900,
  scale: {
    mode: Phaser.Scale.FIT,
    },
  //autoCenter: Phaser.Scale.CENTER_BOTH,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let startOffset = config.width/20;
let endOffset = config.width/5;
let startPosMarker = 2 * (config.width/5);
let endPosMarker = config.width/5;
let playerLives = 3;
let gameState = 0;
let gameOverTimer = 0;

class Note {

  constructor(height, width, quadrant, timeInterval, color, svg, pinksvg, id) {
    switch (quadrant){
      case 1:
        this.startPosX = 625;
        this.endPosX = 430;
        this.startPosY = 430;
        this.endPosY = 730;
      break;
      case 2:
        this.startPosX = 730;
        this.endPosX = 675;
        this.startPosY = 424;
        this.endPosY = 730;
        break;
      case 3:
        this.startPosX = 850;
        this.endPosX = 915;
        this.startPosY = 450;
        this.endPosY = 730;
        break;
      case 4:
        this.startPosX = 960;
        this.endPosX = 1100;
        this.startPosY = 440;
        this.endPosY = 730;
        break;
    }
  this.startScale = 0.2;
  this.endScale = 1.5;
  this.height = height;
  this.width = width;
  this.timeInterval = timeInterval;
  this.thisRect = svg;
  this.thisRect.x = this.startPosX;
  this.thisRect.y = this.startPosY;
  this.thisRect.angle = Math.random()*360;
  this.thisRect.setDepth(2);
  this.pinkRect = pinksvg;
  this.pinkRect.x = this.thisRect.x
  this.pinkRect.y = this.thisRect.Y
  this.pinkRect.angle = this.thisRect.angle;
  this.pinkRect.setDepth(2);
  this.pinkRect.visible = false;
  this.noteTime;
  this.startTime = new Date().getTime();
  this.markForDeletion = false;
  this.noteID = id;
  this.quadrant = quadrant;
  this.hit = 0;
  }

noteUpdate(){
    //STARTS AT 0 AND GOES TO VISUAL INTERVAL
    this.noteTime = Math.abs(this.startTime - new Date().getTime());
    if (this.noteTime >= this.timeInterval + leniency){
      this.thisRect.y = -1000;
      this.pinkRect.y = -1000;
      this.markForDeletion = true;
      if (this.hit == 0){
        beatsHit[this.noteID] = 2;
        spawnIndicator(2);
      }
    }
    else {
      this.thisRect.y = lerp(this.startPosY, this.endPosY, this.noteTime/this.timeInterval);
      this.thisRect.x = lerp(this.startPosX, this.endPosX, this.noteTime/this.timeInterval);

      this.thisRect.scale = lerp(this.startScale, this.endScale, this.noteTime/this.timeInterval);

      this.thisRect.angle += (this.noteTime/1000);

      this.pinkRect.x = this.thisRect.x;
      this.pinkRect.y = this.thisRect.y;
      this.pinkRect.scale = this.thisRect.scale;
      this.pinkRect.angle = this.thisRect.angle;

      if ( (this.noteTime/this.timeInterval) > (1-(leniency/this.timeInterval)) && (this.noteTime/this.timeInterval) <= (1+(leniency/this.timeInterval)) ){
        this.thisRect.visible = false;
        this.pinkRect.visible = true;
        //console.log("Hit time");
      }
      else {
        this.thisRect.visible = true;
        this.pinkRect.visible = false;
      }

    }
    this.thisRect.update();
    this.pinkRect.update();
  }

checkNoteHit(q){
  let hitStatus;
    if (this.noteTime > this.timeInterval-leniency && this.noteTime < this.timeInterval+leniency && this.quadrant == q){
      hitStatus = 1;
    }
    else {
    hitStatus = 2;
    }
    this.hit = hitStatus;
    return hitStatus;
  }

}

class Indicator {

  constructor(graphic, duration) {
    this.graphic = graphic;
    this.graphic.setDepth(5);
    this.ctr = new Date().getTime();
    this.duration = new Date().getTime() + duration;
    this.markForDeletion = false;
  }

  update(){
      this.ctr = this.duration - new Date().getTime();
      if (this.ctr <= 0){
        this.markForDeletion = true;
      }
  }
}

var game = new Phaser.Game(config);
var scene;
let lives = [];
let broken = [];
let playBtn;
let playBtnImage;

//----- keep the tags below; they are replaced with code from the deploy script
document.querySelectorAll("canvas").forEach(el=>el.classList.add("transition"));
document.querySelectorAll("canvas").forEach(el=>el.style.zIndex = 2000);
//-----

function preload()
{
  scene = this;
  this.load.svg('BKGRNDFRAME', 'assets4/BKGRNDFRAME.svg', { width: config.width, height: config.height });
  //config.width/2, config.height/2
  this.load.svg('TOPFRAME', 'assets4/TOPFRAME.svg', { width: 1027, height: 446 });
  //798, 540
  this.load.svg('BTMFRAME', 'assets4/BTMFRAME.svg', { width: 1343, height: 223 });
  //795, 791
  this.load.svg('RADARSCREEN', 'assets4/RADARSCREEN.svg', { width: 1295, height: 459 });

  //this.load.svg('FRAME1', 'assets4/FRAME1.svg', { width: config.width, height: config.height });
  this.load.svg('FRAME1a', 'assets4/FRAME1a.svg', { width: config.width, height: config.height });

  //this.load.svg('FRAME2', 'assets4/FRAME2.svg', {scale: 3});
  this.load.svg('FRAME2a', 'assets4/FRAME2a.svg', { width: config.width, height: config.height });
  this.load.image('SPACE', 'assets4/SPACE.png', { width: config.width, height: config.height });
  this.load.svg('CATPAWS', 'assets4/CatPaws.svg', { width: config.width, height: config.height});

  //798, 672
  //this.load.svg('BUTTONS', 'assets4/buttons/OffBtn.svg', { width: 1300, height: 100 });
  // 315, 800 = 500, 875
  this.load.svg('CATBTN-R1', 'assets4/buttons/CatBtnL1.svg', { width: 185, height: 100 });
  this.load.svg('CATBTN-R2', 'assets4/buttons/CatBtnL2.svg', { width: 185, height: 100 });
  this.load.svg('CATBTN-L1', 'assets4/buttons/CatBtnR1.svg', { width: 185, height: 100 });
  this.load.svg('CATBTN-L2', 'assets4/buttons/CatBtnR2.svg', { width: 185, height: 100 });

  this.load.svg('OFFBTN-L2', 'assets4/buttons/OffL2.svg', { width: 185, height: 100 });
  this.load.svg('OFFBTN-L1', 'assets4/buttons/OffL1.svg', { width: 185, height: 100 });
  this.load.svg('OFFBTN-R1', 'assets4/buttons/OffR1.svg', { width: 185, height: 100 });
  this.load.svg('OFFBTN-R2', 'assets4/buttons/OffR2.svg', { width: 185, height: 100 });

  this.load.svg('ASTEROID1', 'assets4/asteroids/Asteroid01.svg', { width: 80, height: 80 });
  this.load.svg('ASTEROID2', 'assets4/asteroids/Asteroid02.svg', { width: 80, height: 80 });
  this.load.svg('ASTEROID3', 'assets4/asteroids/Asteroid03.svg', { width: 80, height: 80 });
  this.load.svg('ASTEROID4', 'assets4/asteroids/Asteroid04.svg', { width: 80, height: 80 });
  this.load.svg('PINKASTEROID1', 'assets4/asteroids/RadarAsteroid01.svg', { width: 80, height: 80 });
  this.load.svg('PINKASTEROID2', 'assets4/asteroids/RadarAsteroid02.svg', { width: 80, height: 80 });
  this.load.svg('PINKASTEROID3', 'assets4/asteroids/RadarAsteroid03.svg', { width: 80, height: 80 });
  this.load.svg('PINKASTEROID4', 'assets4/asteroids/RadarAsteroid04.svg', { width: 80, height: 80 });

  this.load.svg('CATNEUTRAL', 'assets4/CatSignifierIdle.svg', { width: 120, height: 120 });
  this.load.svg('CATGOOD', 'assets4/CatSignifierGood.svg', { width: 120, height: 120 });
  this.load.svg('CATBAD', 'assets4/CatSignifierBad.svg', { width: 120, height: 120 });

  this.load.svg('LIFE', 'assets4/Live.svg', { width: 80, height: 80 });
  this.load.svg('LOST', 'assets4/LostLive.svg', { width: 80, height: 80 });

  this.load.svg('PLAY', 'assets4/PLAY.svg', { width: 80, height: 80 });
  this.load.svg('LINE', 'assets4/lineSig.svg', { width: 1000, height: 80 });

  //console.log(this);
}

let songStartTime;
let beatMarkers;
let nextBeat;
let lastBeat;
let nextVisualBeat;
let lastVisualBeat;
let currentVisualMarker;
let currentMarker;
let songStarted;
let currentTime;
let noteTime;
const leniency = 250; //The leniency given to the player for hitting each beat, in milliseconds.
let r2;
let r4;
let hitrect;
let missrect;
let gameOverRect;
let gameOverText;
let random;
let nextNote;
let pendingNotes;
let pendingIndicators;
let visualInterval = 1500;
let notespawned = false;
var ctx = new (window.AudioContext || window.webkitAudioContext)();
let audio = new Audio("assets4/Music/Melting Point V2 (Shortened).mp3");
audio.crossOrigin = "anonymous";

const source = ctx.createMediaElementSource(audio);
const gainNode = ctx.createGain();


function create()
{
  //sets up audio and beat markers
  source.connect(gainNode);
  gainNode.connect(ctx.destination);
  gainNode.gain.setValueAtTime(0.2, ctx.currentTime);

  beatMarkers = [
    //126,
    1126,
    2126,
    3126, 3627,
    4126,
    5126,
    6126,
    7126,
    7627, 8126,
    9126,
    10126,
    10877, 11377, 11875,
    12126, 12844, 13114, 13735,
    14126, 14865, 15128, 15627,
    16126, 16804, 17478, 17859,
    18126, 18548, 19364, 19877,
    20126, 20734, 21250, 21587,
    22126, 22485, 22859,
    23126, 23504, 23877, 24126,
    25126,
    26126,
    27126, 27378, 27628, 28004,
    28126,
    29126,
    30126, 30734,
    31126,
    32126, 32635,
    33126, 33668, 34117, 35150,
    36126,
    37126,
    38126,
    39126, 39668, 39874, 40126,
    41126,
    42126,
    43118, 43618,
    44126, 44371, 44622, 44850, 45273, 45595,
    46126, 46400, 46650, 46885, 47126,
    47373, 47641,
    48126, 48668, 49323, 49850, 50126,
    50393, 50620, 50868, 51126, 51390, 51620,
    52126,
    53126,
    54126,
  ];
  beatDirections = [
    //1,
    4,
    1,
    1, 3,
    1,
    4,
    1,
    3,
    2, 1,
    3,
    2,
    1, 3, 2,
    1, 1, 3, 2,
    1, 2, 4, 3,
    1, 1, 3, 2,
    1, 3, 2, 1,
    1, 1, 3, 2,
    3, 3, 2,
    1, 4, 3, 4,
    3,
    3,
    2, 4, 3, 1,
    1,
    1,
    3, 2,
    2, 3,
    4, 2, 3, 1,
    4,
    1,
    3,
    4, 2, 3, 1,
    2,
    1,
    3, 2,
    1, 4, 2, 3, 2, 1,
    1, 4, 3, 2, 1,
    3, 2,
    1, 1, 3, 2, 1,
    2, 3, 4, 3, 2, 1,
    1,
    1,
    1,
    2
    ];
  visualBeatMarkers = [];
  for (var b = 0; b < beatMarkers.length; b++){
    beatMarkers[b] += 3892;
    visualBeatMarkers[b] = beatMarkers[b] - visualInterval;
  }
  beatsHit = [];
  for (var i = 0; i<beatMarkers.length; i++){
    beatsHit[i] = 0;
  }
  nextBeat = beatMarkers[0];
  lastBeat = 0;
  currentMarker = 0;
  actualMarker = 0;
  songStarted = false;
  pendingNotes = [];
  pendingIndicators = [];

  //q1 = this.add.polygon(300, 300, "510 400 660 450 530 900 120 900", 0xff0000, 0.5).setDepth(4);
  var q1 = new Phaser.Geom.Polygon([
    545, 450,
    670, 450,
    555, 900,
    170, 900
  ]);

  var q2 = new Phaser.Geom.Polygon([
    671, 450,
    790, 450,
    780, 900,
    556, 900
  ]);

  var q3 = new Phaser.Geom.Polygon([
    791, 450,
    915, 450,
    1060, 900,
    791, 900
  ]);

  var q4 = new Phaser.Geom.Polygon([
    916, 450,
    1050, 450,
    1375, 900,
    1061, 900
  ]);


  //Adds visual elements
  //this.add.image((config.width/2), (config.height/2), 'BKGRNDFRAME').setDepth(0);
  this.add.image((config.width/2), (config.height/2), 'FRAME1').setDepth(-1);
  this.add.image((config.width/2), (config.height/2), 'FRAME2').setDepth(-1);

  this.add.image((config.width/2), (config.height/2), 'FRAME1a').setDepth(-1);
  this.add.image((config.width/2), (config.height/2), 'FRAME2a').setDepth(-1);
  this.add.image((config.width/2), (config.height/2), 'SPACE').setDepth(-2);
  this.add.image(800, 325, 'CATNEUTRAL').setDepth(4);
  this.add.image((config.width/2), (config.height*4 / 5), 'CATPAWS').setDepth(4);

  this.add.image(798, 560, 'TOPFRAME').setDepth(3);
  this.add.image(795, 791, 'BTMFRAME').setDepth(3);
  this.add.image(798, 672, 'RADARSCREEN').setDepth(1);
  let catBtnL2 = this.add.image(415, 830, 'CATBTN-L2').setDepth(3);
  let offBtnL2 = this.add.image(415, 835, 'OFFBTN-L2').setDepth(3);
  offBtnL2.visible = false;

  let catBtnL1 = this.add.image(675, 830, 'CATBTN-L1').setDepth(3);
  let offBtnL1 = this.add.image(675, 835, 'OFFBTN-L1').setDepth(3);
  offBtnL1.visible = false;

  let catBtnR1 = this.add.image(915, 830, 'CATBTN-R1').setDepth(3);
  let offBtnR1 = this.add.image(915, 835, 'OFFBTN-R1').setDepth(3);
  offBtnR1.visible = false;

  let catBtnR2 = this.add.image(1185, 830, 'CATBTN-R2').setDepth(3);
  let offBtnR2 = this.add.image(1185, 835, 'OFFBTN-R2').setDepth(3);
  offBtnR2.visible = false;

  lives[0] = this.add.image(130, 440, 'LIFE').setDepth(4);
  lives[1] = this.add.image(230, 445, 'LIFE').setDepth(4);
  lives[2] = this.add.image(330, 450, 'LIFE').setDepth(4);

  broken[0] = this.add.image(130, 440, 'LOST').setDepth(4);
  broken[1] = this.add.image(230, 445, 'LOST').setDepth(4);
  broken[2] = this.add.image(330, 450, 'LOST').setDepth(4);

  playBtn = this.add.image(1440, 440, 'PLAY').setDepth(4);
  let playRect = this.add.rectangle(1440, 440, 200, 200).setDepth(3);
  playRect.setInteractive();

  this.add.image(800, 730, 'LINE').setDepth(2);

  gameOverRect = this.add.rectangle(0, 0, 0, 0, 0xffff00).setDepth(6);
  gameOverText = this.add.text(800, 450, 'You win!', { color: '#000s', fontSize: '32px', align: 'center' }).setDepth(7);
  gameOverRect.visible = false;
  gameOverText.visible = false;

  for (i=0; i < 3;i++){
    broken[i].visible = false;
  }

  hitrect = this.add.rectangle(config.width /8, config.height - config.height/10, 40, 100, 0x00ff00);
  missrect = this.add.rectangle(config.width /8, config.height - config.height/10, 40, 100, 0xff0000);
  hitrect.visible = false;
  missrect.visible = false;

  random = Math.floor(Math.random() * 4) + 1;

  var btn = document.getElementById('btn')
  playRect.on('pointerdown', function (pointer) {

    //Play button logic

    ctx.resume();
    audio.play();
    songStartTime = new Date().getTime();
    songStarted = true;
    gameState = 1;
    gameOverRect.visible = false;
    gameOverText.visible = false;
    });

  document.addEventListener("mousemove", () => {
});


scene.input.on('pointerdown', function(pointer) {
	//console.log("scene input");
  let mousex = pointer.x;
  let mousey = pointer.y;
  //console.log(pointer.x +" "+ pointer.y);
  if (Phaser.Geom.Polygon.Contains(q1, mousex, mousey)){
    catBtnL2.visible = false;
    offBtnL2.visible = true;
    checkHit(1);
    };
  if (Phaser.Geom.Polygon.Contains(q2, mousex, mousey)){
      catBtnL1.visible = false;
      offBtnL1.visible = true;
      checkHit(2);
    };
  if (Phaser.Geom.Polygon.Contains(q3, mousex, mousey)){
      catBtnR1.visible = false;
      offBtnR1.visible = true;
      checkHit(3);
    };
  if (Phaser.Geom.Polygon.Contains(q4, mousex, mousey)){
      catBtnR2.visible = false;
      offBtnR2.visible = true;
      checkHit(4);
    };
  });

  scene.input.on('pointerup', function(pointer) {
    catBtnL1.visible = true;
    catBtnL2.visible = true;
    catBtnR1.visible = true;
    catBtnR2.visible = true;

    offBtnL1.visible = false;
    offBtnL2.visible = false;
    offBtnR1.visible = false;
    offBtnR2.visible = false;
  });

  //end of create
}


function checkHit(quad){
  let hitIndicator;
  //for each pending note
    for (var k = 0; k < pendingNotes.length; k++){
      //check note that passed the threshold
    if (currentTime - leniency < beatMarkers[actualMarker-1] && actualMarker-1 == pendingNotes[k].noteID && pendingNotes[k].hit == 0){
      hitOrMiss = pendingNotes[k].checkNoteHit(quad);
      if (hitOrMiss == 1){
        //console.log("hit", this);
      }
      else if (hitOrMiss == 2){
        //console.log("miss");
      }
      spawnIndicator(hitOrMiss);
      beatsHit[actualMarker-1] = hitOrMiss;
      break;
    }
    else if (actualMarker == pendingNotes[k].noteID && beatsHit[actualMarker] == 0){
      hitOrMiss = pendingNotes[k].checkNoteHit(quad);
      if (hitOrMiss == 1){
        //console.log("hit");
      }
      else if (hitOrMiss == 2){
        //console.log("miss");
      }
      spawnIndicator(hitOrMiss);
      beatsHit[actualMarker] = hitOrMiss;
      break;
    }
  }
}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}

function spawnIndicator(hitormiss){
  switch (hitormiss){
      case 1:
    hitIndicator = new Indicator(scene.add.image(800, 325, 'CATGOOD').setDepth(5), 250);
    pendingIndicators.push(hitIndicator);
    break;
      case 2:
      hitIndicator = new Indicator(scene.add.image(800, 325, 'CATBAD').setDepth(5), 250);
      pendingIndicators.push(hitIndicator);
      playerLives--;
    break;
      default:
    //console.log("Iunno");
  }
}


function update()
{
  if (gameState == 2){
    //console.log(gameOverTimer);
    gameOverTimer++;
    if (gameOverTimer > 200){
      gameOverRect.visible = true;
      gameOverText.visible = true;
      reset();

      //Game over logic

			//----- keep the below tags; they are replaced with code from the deploy script
			document.querySelectorAll("canvas").forEach(el=>el.classList.add("no-opacity"));
			changeScene();
			setTimeout(() => { game.destroy(true, false); }, 2000);
			//----- 

    }
  }
  if (playerLives < 3){
    lives[playerLives].visible = false;
    broken[playerLives].visible = true;
  }
  if (playerLives > 0){
  if (songStarted){
    currentTime = new Date().getTime() - songStartTime;
    playBtn.visible = false;
    if (pendingNotes){
    for (i=0; i<pendingNotes.length; i++){
      pendingNotes[i].noteUpdate(noteTime);
      if (pendingNotes[i].markForDeletion){
        pendingNotes.splice(i, 1);
      }
    }
  }
    if (pendingIndicators){
    for (i=0; i<pendingIndicators.length; i++){
      pendingIndicators[i].update();
      if (pendingIndicators[i].markForDeletion){
        pendingIndicators[i].graphic.destroy();
        pendingIndicators.splice(i, 1);
      }
    }
  }
    if (currentTime > beatMarkers[actualMarker]){
      actualMarker++;
      if (actualMarker >= beatMarkers.length){
        //console.log("Win!");
        gameState = 2;
      }
    }
    if (currentTime > visualBeatMarkers[currentMarker]){
      dir = beatDirections[currentMarker]
      let randomAsteroid = Math.floor(Math.random() * 4);
      let asteroidimg;
      let pinkasteroidimg;
      switch (randomAsteroid){
        case 0:
          asteroidimg = this.add.image(675, 835, 'ASTEROID1').setDepth(2);
          pinkasteroidimg = this.add.image(675, 835, 'PINKASTEROID1').setDepth(2);
          break;
          case 1:
          asteroidimg = this.add.image(675, 835, 'ASTEROID2').setDepth(2);
          pinkasteroidimg = this.add.image(675, 835, 'PINKASTEROID2').setDepth(2);
          break;
          case 2:
          asteroidimg = this.add.image(675, 835, 'ASTEROID3').setDepth(2);
          pinkasteroidimg = this.add.image(675, 835, 'PINKASTEROID3').setDepth(2);
          break;
          case 3:
          asteroidimg = this.add.image(675, 835, 'ASTEROID4').setDepth(2);
          pinkasteroidimg = this.add.image(675, 835, 'PINKASTEROID4').setDepth(2);
          break;

          default:
          asteroidimg = this.add.image(675, 835, 'ASTEROID1').setDepth(2);
          pinkasteroidimg = this.add.image(675, 835, 'PINKASTEROID1').setDepth(2);

      }
      nextNote = new Note(80, 80, dir, visualInterval, 0xFF0000, asteroidimg, pinkasteroidimg, currentMarker);
      pendingNotes.push(nextNote);
      currentMarker++;
      lastBeat = nextBeat;
      nextBeat = beatMarkers[currentMarker];
    }
  }
}
else {
  if (songStarted){
    reset();
    }
  }
if (pendingNotes){
  for (i=0; i<pendingNotes.length; i++){
    if (pendingNotes[i].markForDeletion){
      pendingNotes.splice(i, 1);
    }
  }
}
  if (pendingIndicators){
  for (i=0; i<pendingIndicators.length; i++){
    if (pendingIndicators[i].markForDeletion){
      pendingIndicators[i].graphic.destroy();
      pendingIndicators.splice(i, 1);
    }
  }
}
}

function reset(){
  ctx.suspend();
  audio.pause();
  audio.currentTime = 0;
  gameState = 0;
  playerLives = 3;
  for (var i = 0; i < beatsHit.length; i++){
    beatsHit[i] = 0;
  }
  for (var i = 0; i < 3; i++){
    lives[i].visible = true;
    broken[i].visible = false;
  }
  for (var k = 0; k < pendingNotes.length; k++){
    pendingNotes[k].markForDeletion = true;
    pendingNotes[k].thisRect.y = -1000;
    pendingNotes[k].pinkRect.y = -1000;
  }
  for (var k = 0; k < pendingIndicators.length; k++){
    pendingIndicators[k].markForDeletion = true;
  }
  songStarted = false;
  playBtn.visible = true;
  currentTime = 0;
  currentMarker = 0;
  actualMarker = 0;
  currentVisualMarker = 0;
  gameOverTimer = 0;
}
}
