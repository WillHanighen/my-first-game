const config = {
  type: Phaser.AUTO,
  width: 800,  // Fixed width
  height: 600, // Fixed height
  backgroundColor: "#666666",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true  // Ensure debug is on
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};

function preload() {
  console.log("Attempting to load sprite sheets");
  try {
    this.load.spritesheet("idle", "assets/Homeless_1/Idle.png", { 
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet("walk", "assets/Homeless_1/Walk.png", { 
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet("run", "assets/Homeless_1/Run.png", { 
      frameWidth: 128,
      frameHeight: 128
    });
  } catch (error) {
    console.error("Sprite sheet loading error:", error);
  }
}

function create() {
  console.log("Creating scene");

  this.player = this.physics.add.sprite(400, 300, "idle")
    .setScale(2);

  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 5 }),
    frameRate: 8,
    repeat: -1,
    yoyo: true
  });

  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNumbers("walk", { start: 0, end: 5 }),
    frameRate: 8,
    repeat: -1,
    yoyo: true
  });

  this.anims.create({
    key: "run",
    frames: this.anims.generateFrameNumbers("run", { start: 0, end: 5 }),
    frameRate: 12,
    repeat: -1,
    yoyo: true
  });

  this.player.play("idle");
  
  // Status values
  this.stamina = 100;
  this.health = 100;
  
  // Create status bars
  this.staminaBar = this.add.rectangle(20, 560, 200, 20, 0x0000ff);
  this.staminaBar.setOrigin(0, 0);
  
  this.healthBar = this.add.rectangle(20, 590, 200, 20, 0xff0000);
  this.healthBar.setOrigin(0, 0);
}

function update() {
  const cursors = this.input.keyboard.createCursorKeys();
  const isRunning = cursors.shift.isDown && this.stamina > 0;
  const speed = isRunning ? 300 : 160;
  
  let moving = false;
  
  if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown) {
    moving = true;
    this.player.setVelocityX(cursors.left.isDown ? -speed : cursors.right.isDown ? speed : 0);
    this.player.setVelocityY(cursors.up.isDown ? -speed : cursors.down.isDown ? speed : 0);
    
    if (isRunning) {
      this.stamina = Math.max(0, this.stamina - 0.5);
      this.player.play("run", true);
    } else {
      this.player.play("walk", true);
    }
  } else {
    this.player.setVelocity(0);
    this.player.play("idle", true);
    this.stamina = Math.min(100, this.stamina + 0.2);
  }
  
  // Update status bars
  this.staminaBar.width = this.stamina * 2;
  this.healthBar.width = this.health * 2;
}

const game = new Phaser.Game(config);