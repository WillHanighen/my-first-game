const config = {
  type: Phaser.AUTO,
  width: 800,  // Fixed width
  height: 600, // Fixed height
  backgroundColor: "#666666",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
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

  // Create floor
  this.floor = this.add.rectangle(400, 550, 800, 20, 0x4a4a4a);
  this.physics.add.existing(this.floor, true); // true makes it static

  this.player = this.physics.add.sprite(400, 300, "idle")
    .setScale(2);
    
  // Add collision between player and floor
  this.physics.add.collider(this.player, this.floor);

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
  
  // Create status bars with padding from bottom-left
  this.staminaBar = this.add.rectangle(10, config.height - 40, 200, 15, 0x0000ff);
  this.staminaBar.setOrigin(0, 0);
  this.staminaBar.setStrokeStyle(2, 0x000000);
  
  this.healthBar = this.add.rectangle(10, config.height - 20, 200, 15, 0xff0000);
  this.healthBar.setOrigin(0, 0);
  this.healthBar.setStrokeStyle(2, 0x000000);
  
  // Setup WASD keys
  this.wasdKeys = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D
  });
}

function update() {
  const isRunning = this.input.keyboard.addKey('SHIFT').isDown && this.stamina > 0;
  const speed = isRunning ? 300 : 160;
  
  let moving = false;
  
  if (this.wasdKeys.left.isDown || this.wasdKeys.right.isDown || this.wasdKeys.up.isDown || this.wasdKeys.down.isDown) {
    moving = true;
    const velocityX = this.wasdKeys.left.isDown ? -speed : this.wasdKeys.right.isDown ? speed : 0;
    this.player.setVelocityX(velocityX);
    this.player.setVelocityY(this.wasdKeys.up.isDown ? -speed : this.wasdKeys.down.isDown ? speed : 0);
    
    // Flip sprite based on movement direction
    if (velocityX !== 0) {
      this.player.setFlipX(velocityX < 0);
    }
    
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