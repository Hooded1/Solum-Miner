var config = {
  width: 900,
  height: 400,
  type: Phaser.AUTO,
  parent: 'game-area',
  physics: {
    default: 'arcade',
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var player;
var cursors;
var debugText;
var game = undefined;

var keyUp, keyDown, keyLeft, keyRight, keyShift;

window.setTimeout(() => {
  game = new Phaser.Game(config);
}, 3000);

function preload ()
{
  var hack = '?v=' + (new Date()).getTime();

  this.load.image('bg', 'game/assets/map.png' + hack);
  this.load.image('block', 'game/assets/RoverUp.png' + hack);

  this.load.image('rover', 'game/assets/rover_basic.png' + hack);

  this.load.atlas('materials', 'game/assets/materials.png?' + hack, 'game/assets/materials.json' + hack);
  // var image1 = this.add.image(200, 300, 'materials', 'Dirt');
}

function create () {

  MapEnvironment.initialize(this);
  MapEnvironment.generateChunks((new Date()).getTime());


  //  Mash 4 images together to create our background
  //this.add.image(0, 0, 'bg').setOrigin(0);
  //this.add.image(1280, 0, 'bg').setOrigin(0);
  //this.add.image(0, 900, 'bg').setOrigin(0);
  //this.add.image(1280, 900, 'bg').setOrigin(0);

  keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
  keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
  keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  //cursors = this.input.keyboard.createCursorKeys();

  player = this.physics.add.image(400, 300, 'rover');
  player.setSize(64, 64);
  player.depth = 100;

 // player.setCollideWorldBounds(true);

  this.cameras.main.startFollow(player, false);

  //this.cameras.main.setDeadzone(400, 200);
  this.cameras.main.setZoom(1);

  text = this.add.text(32, 32).setScrollFactor(0).setFontSize(16).setColor('#ffffff');

}

function update () {
  var cam = this.cameras.main;

  var playerX = Math.floor(player.x / 64);
  var playerY = Math.floor(player.y / 64);

  MapEnvironment.position.x = playerX;
  MapEnvironment.position.y = playerY;

  text.setText([
      'X: ' + playerX,
      'Y: ' + playerY
  ]);

  updateControls();

  performMovement(player, getDirection());

  MapEnvironment.updateChunks();
}

function updateControls() {
  Keys.Up = keyUp.isDown || keyW.isDown;
  Keys.Down = keyDown.isDown || keyS.isDown;
  Keys.Left = keyLeft.isDown || keyA.isDown;
  Keys.Right = keyRight.isDown || keyD.isDown;
  Keys.Boost = keyShift.isDown;
}