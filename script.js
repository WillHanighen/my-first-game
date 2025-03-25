const config = {
  type: Phaser.AUTO,
  width: 800,  // Fixed width
  height: 600, // Fixed height
  backgroundColor: "#666666",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1200 },
      debug: true,  // Ensure debug is on
      maxVelocity: { x: 500, y: 1000 }
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
    this.load.spritesheet("jump", "assets/Homeless_1/Jump.png", { 
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

  this.anims.create({
    key: "jumpStart",
    frames: this.anims.generateFrameNumbers("jump", { start: 0, end: 5 }),
    frameRate: 18,
    repeat: 0
  });

  this.anims.create({
    key: "jumpEnd",
    frames: this.anims.generateFrameNumbers("jump", { start: 6, end: 16 }),
    frameRate: 18,
    repeat: 0
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
  
  // Setup controls
  this.controls = this.input.keyboard.addKeys({
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
    jump: Phaser.Input.Keyboard.KeyCodes.SPACE
  });
}

function update() {
  const isRunning = this.input.keyboard.addKey('SHIFT').isDown && this.stamina > 0;
  const acceleration = isRunning ? 2000 : 1000;
  const maxSpeed = isRunning ? 300 : 160;
  
  let moving = false;
  let velocityX = this.player.body.velocity.x;
  
  // Handle horizontal movement with acceleration
  if (this.controls.left.isDown) {
    moving = true;
    this.player.setAccelerationX(-acceleration);
  } else if (this.controls.right.isDown) {
    moving = true;
    this.player.setAccelerationX(acceleration);
  } else {
    this.player.setAccelerationX(0);
    // Add friction when not moving
    this.player.setDragX(1000);
  }
  
  // Clamp horizontal velocity
  if (Math.abs(this.player.body.velocity.x) > maxSpeed) {
    this.player.setVelocityX(maxSpeed * Math.sign(this.player.body.velocity.x));
  }
  
  // Jump mechanics
  if (this.controls.jump.isDown && this.player.body.touching.down) {
    this.player.setVelocityY(-600);
    this.player.play("jumpStart", true);
    this.isJumping = true;
    this.isLanding = false;
  }
  
  // Variable jump height
  if (!this.controls.jump.isDown && this.player.body.velocity.y < 0) {
    this.player.setVelocityY(this.player.body.velocity.y * 0.5);
  }
  
  // Handle animations based on state
  if (!this.player.body.touching.down) {
    if (this.player.body.velocity.y > 200 && !this.isLanding) {
      this.player.play("jumpEnd", true);
      this.isLanding = true;
    }
  } else {
    this.isJumping = false;
    this.isLanding = false;
    
    // Flip sprite based on movement direction
    if (velocityX !== 0) {
      this.player.setFlipX(velocityX < 0);
    }
    
    if (moving) {
      if (isRunning) {
        this.stamina = Math.max(0, this.stamina - 0.5);
        this.player.play("run", true);
      } else {
        this.player.play("walk", true);
      }
    } else {
      this.player.play("idle", true);
      this.stamina = Math.min(100, this.stamina + 0.2);
    }
  }
  
  // Update status bars
  this.staminaBar.width = this.stamina * 2;
  this.healthBar.width = this.health * 2;
}

const game = new Phaser.Game(config);
