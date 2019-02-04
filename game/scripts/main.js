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
  this.load.image('bg', 'game/assets/map.png');
  this.load.image('block', 'game/assets/RoverUp.png');

  this.load.image('rover', 'game/assets/rover_basic.png');
}

function create () {

  console.log(this);

  var mapWidth = 1024 * 64;
  var mapHeight = 1024 * 64;

  this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
  this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

  //  Mash 4 images together to create our background
  this.add.image(0, 0, 'bg').setOrigin(0);
  this.add.image(1280, 0, 'bg').setOrigin(0);
  this.add.image(0, 900, 'bg').setOrigin(0);
  this.add.image(1280, 900, 'bg').setOrigin(0);


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

  player.setCollideWorldBounds(true);

  this.cameras.main.startFollow(player, true, 0.5, 0.5);

  //this.cameras.main.setDeadzone(400, 200);
  this.cameras.main.setZoom(1);

  text = this.add.text(32, 32).setScrollFactor(0).setFontSize(16).setColor('#ffffff');

}

function update () {
  var cam = this.cameras.main;

  text.setText([
      'X: ' + Math.round(cam.scrollX),
      'Y: ' + Math.round(cam.scrollY)
  ]);

  updateControls();

  performMovement(player, getDirection());

}

function updateControls() {
  Keys.Up = keyUp.isDown || keyW.isDown;
  Keys.Down = keyDown.isDown || keyS.isDown;
  Keys.Left = keyLeft.isDown || keyA.isDown;
  Keys.Right = keyRight.isDown || keyD.isDown;
  Keys.Boost = keyShift.isDown;
}