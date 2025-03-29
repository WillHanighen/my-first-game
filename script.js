const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,  // Base width
    height: 600, // Base height
  },
  backgroundColor: "#666666",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1200 },
      debug: true,
      maxVelocity: { x: 500, y: 1000 }
    }
  },
  render: {
    pixelArt: true,
    antialias: false
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
    this.load.image("background", "assets/background/dead_forest.png");
    console.log("Background image loaded successfully");

    this.load.spritesheet("idle", "assets/Homeless_1/Idle.png", { 
      frameWidth: 128,
      frameHeight: 128
    });
    console.log("Idle spritesheet loaded successfully");

    this.load.spritesheet("walk", "assets/Homeless_1/Walk.png", { 
      frameWidth: 128,
      frameHeight: 128
    });
    console.log("Walk spritesheet loaded successfully");

    this.load.spritesheet("run", "assets/Homeless_1/Run.png", { 
      frameWidth: 128,
      frameHeight: 128
    });
    console.log("Run spritesheet loaded successfully");

    this.load.spritesheet("jump", "assets/Homeless_1/Jump.png", { 
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet("zombie_idle_a", "assets/Zombie_1/Idle.png", {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet("zombie_walk_a", "assets/Zombie_1/Walk.png", {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet("zombie_hurt_a", "assets/Zombie_1/Hurt.png", {
      frameWidth: 128,
      frameHeight: 128    
    });
    this.load.spritesheet("zombie_attack_a", "assets/Zombie_1/Attack.png", {
      frameWidth: 128,
      frameHeight: 128
    });
    this.load.spritesheet("zombie_dead_a", "assets/Zombie_1/Dead.png", {
      frameWidth: 128,
      frameHeight: 128
    }); 
    console.log("Jump spritesheet loaded successfully");
  } catch (error) {
    console.error("Sprite sheet loading error:", error);
  }
}

function create() {
  console.log("Creating scene");

  // Add the background image to the scene
  const backgroundImage = this.add.image(0, 0, "background");
  console.log("Background image added to the scene");
  backgroundImage.setOrigin(0, 0);
  backgroundImage.setDisplaySize(800, 600); // Ensure the background fits the scene size

  // Create a background camera
  const backgroundCamera = this.cameras.add(0, 0, 800, 600);
  backgroundCamera.setBackgroundColor(0x666666); // Set the background color of the camera
  backgroundCamera.zoom = 1; // Set the initial zoom level of the camera

  // Create a main camera for the game objects
  const mainCamera = this.cameras.add(0, 0, 800, 600);
  mainCamera.zoom = 1; // Adjust the zoom level to fit the scene better

  // Create floor
  this.floor = this.add.rectangle(400, 550, 800, 20, 0x4a4a4a);
  this.physics.add.existing(this.floor, true); // true makes it static

  // Create player with physics
  this.player = this.physics.add.sprite(400, 300, "idle");
  this.player.setScale(2);
  this.player.setOrigin(0.5, 0.5);
  this.player.body.setSize(28, 64); // Set hitbox dimensions (width, height)
  this.player.body.setOffset(52, 64); // Adjust hitbox offset (x, y)
  this.player.body.setDrag(3000, 0); // Adjust values as needed
  this.player.body.setBounce(0);
  this.player.body.setMass(5); // Increase mass so it doesn’t get pushed easily

  // Create zombier A
  this.zombieA = this.physics.add.sprite(600, 300, "zombie_idle_a");
  this.zombieA.setScale(2);
  this.zombieA.setOrigin(0.5, 0.5);
  this.zombieA.body.setSize(24, 64); // Set hitbox dimensions (width, height)
  this.zombieA.body.setOffset(54, 64); // Adjust hitbox offset (x, y)
  this.zombieA.body.setDrag(2500, 0); // Adjust values as needed
  this.zombieA.body.setBounce(0);
  this.zombieA.body.setMass(5); // Increase mass so it doesn’t get pushed easily
  this.zombieAdamage = 5;
  this.zombieAHealth = 35;
  this.zombieAPatrollCounter = 0;
  this.zombieAPatrollDistance = Math.floor(Math.random() * 301);

  // Add collision between entities
  this.physics.add.collider(this.player, this.floor);
  this.physics.add.collider(this.zombieA, this.floor);
  this.physics.add.collider(this.player, this.zombieA, (player, zombieA) => {
    console.log("Player collided with zombie A");
    this.health = Math.max(0, this.health - this.zombieAdamage);
  }, null, this);

  // Create animations
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 4 }),
    frameRate: 8,
    repeat: -1,
    yoyo: true
  });

  this.anims.create({
    key: "walk",
    frames: this.anims.generateFrameNumbers("walk", { start: 0, end: 6 }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "run",
    frames: this.anims.generateFrameNumbers("run", { start: 0, end: 7 }),
    frameRate: 12,
    repeat: -1,
  });

  this.anims.create({
    key: "jumpStart",
    frames: this.anims.generateFrameNumbers("jump", { start: 0, end: 5 }),
    frameRate: 18,
    repeat: 0
  });

  this.anims.create({
    key: "jumpEnd",
    frames: this.anims.generateFrameNumbers("jump", { start: 5, end: 15 }),
    frameRate: 6,
    repeat: 0
  });

  this.anims.create({
    key: "zombie_idle_a",
    frames: this.anims.generateFrameNumbers("zombie_idle_a", { start: 0, end: 6 }),
    frameRate: 6,
    repeat: -1,
    yoyo: true
  });
  this.anims.create({
    key: "zombie_walk_a",
    frames: this.anims.generateFrameNumbers("zombie_walk_a", { start: 0, end: 6 }),
    frameRate: 6,
    repeat: -1,
  })
  this.anims.create({
    key: "zombie_attack_a",
    frames: this.anims.generateFrameNumbers("zombie_attack_a", { start: 0, end: 9 }),
    frameRate: 6,
    repeat: 0
  })

  this.player.play("idle");
  this.zombieA.play("zombie_idle_a");

  // Status values
  this.stamina = 100;
  this.health = 100;

  // Create status bars with padding from bottom-left
  const padding = 10;
  const barWidth = 200;
  const barHeight = 15;
  const barSpacing = 5; // Add spacing between bars

  // Stamina bar background
  this.staminaBarBg = this.add.rectangle(
    padding,
    this.scale.height - padding - barHeight,
    barWidth, 
    barHeight,
    0x888888  // Light gray background
  );
  this.staminaBarBg.setOrigin(0, 1);
  this.staminaBarBg.setScrollFactor(0);
  this.staminaBarBg.setDepth(4);

  // Actual stamina bar
  this.staminaBar = this.add.rectangle(
    padding,
    this.scale.height - padding - barHeight,
    barWidth, 
    barHeight,
    0x008000  // Green fill
  );
  this.staminaBar.setOrigin(0, 1);
  this.staminaBar.setScrollFactor(0);
  this.staminaBar.setDepth(5);

  // 20% stamina tick
  this.staminaTick = this.add.rectangle(
    padding + barWidth * 0.2,
    this.scale.height - padding - barHeight,
    2, 
    barHeight,
    0x000000  // Black tick
  );
  this.staminaTick.setOrigin(0, 1);
  this.staminaTick.setScrollFactor(0);
  this.staminaTick.setDepth(6);
  if (config.physics.arcade.debug) {
  // Stamina bar label with current value
    this.staminaLabel = this.add.text(
      padding, 
      this.scale.height - padding - barHeight * 2 - barSpacing, 
      "Stamina: 100%", 
      { 
        fontSize: '12px', 
        color: '#ffffff' 
      }
    );
  this.staminaLabel.setOrigin(0, 1);
  this.staminaLabel.setScrollFactor(0);
  this.staminaLabel.setDepth(6);
  }

  // Health bar background
  this.healthBarBg = this.add.rectangle(
    padding,
    this.scale.height - padding - barHeight * 2 - barSpacing,
    barWidth, 
    barHeight,
    0x888888  // Light gray background
  );
  this.healthBarBg.setOrigin(0, 1);
  this.healthBarBg.setScrollFactor(0);
  this.healthBarBg.setDepth(4);

  // Health bar
  this.healthBar = this.add.rectangle(
    padding,
    this.scale.height - padding - barHeight * 2 - barSpacing,
    barWidth, 
    barHeight,
    0xff0000  // Red fill
  );
  this.healthBar.setOrigin(0, 1);
  this.healthBar.setScrollFactor(0);
  this.healthBar.setDepth(5);

  // 20% health tick
  this.healthTick = this.add.rectangle(
    padding + barWidth * 0.2,
    this.scale.height - padding - barHeight * 2 - barSpacing,
    2, 
    barHeight,
    0x000000  // Black tick
  );
  this.healthTick.setOrigin(0, 1);
  this.healthTick.setScrollFactor(0);
  this.healthTick.setDepth(6);

  if (config.physics.arcade.debug) {
    // Health bar label with current value
    this.healthLabel = this.add.text(
      padding, 
      this.scale.height - padding - barHeight * 3 - barSpacing * 2, 
      "Health: 100%", 
      { 
        fontSize: '12px', 
        color: '#ffffff' 
      }
    );
    this.healthLabel.setOrigin(0, 1);
    this.healthLabel.setScrollFactor(0);
    this.healthLabel.setDepth(6);
  }
 

  // Setup controls
  this.controls = this.input.keyboard.addKeys({
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
    jump: Phaser.Input.Keyboard.KeyCodes.SPACE
  });

  // Add these lines at the end of the create function
  this.canRun = true;
  this.staminaRecoveryDelay = 0;
  this.jumpCooldown = 0; // Initialize jump cooldown
}

function update() {
  // Modify the isRunning check
  const shiftKey = this.input.keyboard.addKey('SHIFT');
  let isRunning = false;

  if (this.stamina <= 0) {
    this.canRun = false;
    this.staminaRecoveryDelay = 360; // Set a delay of 360 frames (3 second at 60 FPS)
  }

  if (this.canRun && shiftKey.isDown && this.stamina > 0) {
    isRunning = true;
  }

  if (this.staminaRecoveryDelay > 0) {
    this.staminaRecoveryDelay--;
  } else if (this.stamina >= 20) { // Allow running again when stamina is at least 20%
    this.canRun = true;
  }
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

  // Handle jumping
  if (this.jumpCooldown > 0) {
    this.jumpCooldown--; // Decrease cooldown each frame
  }

  if (this.controls.jump.isDown && this.player.body.touching.down && this.stamina >= 20 && this.jumpCooldown <= 0) {
    this.player.setVelocityY(-600);
    this.player.play("jumpStart", true);
    this.isJumping = true;
    this.isLanding = false;
    this.stamina = Math.max(0, this.stamina - 10); // Reduce stamina by 10%
    this.jumpCooldown = 15; // Set cooldown to 15 frames (0.25 seconds at 60 FPS)
  } else if (!this.player.body.touching.down) {
    // In the air
    if (this.player.body.velocity.y > 200 && !this.isLanding) {
      this.player.play("jumpEnd", true);
      this.isLanding = true;
    }
  } else {
    // On the ground
    this.isJumping = false;
    this.isLanding = false;

    // Flip sprite based on movement direction
    if (velocityX !== 0) {
      this.player.setFlipX(velocityX < 0);
    }

    if (moving) {
      if (isRunning) {
        this.stamina = Math.max(0, this.stamina - 0.1);
        this.player.play("run", true);
      } else {
        this.player.play("walk", true);
        this.stamina = Math.min(100, this.stamina + 0.01);
      }
    } else {
      this.player.play("idle", true);
      this.stamina = Math.min(100, this.stamina + 0.05);
    }
  }

  // Variable jump height
  if (!this.controls.jump.isDown && this.player.body.velocity.y < 0) {
    this.player.setVelocityY(this.player.body.velocity.y * 0.5);
  }

  if (config.physics.arcade.debug) {
      // Update status bars
    // For stamina
    const staminaWidth = this.stamina * 2;
    this.staminaBar.width = staminaWidth;
  
    this.staminaBar.fillColor = 0x32CD32; // Solid medium green
    // Update stamina label with percentage
    this.staminaLabel.setText(`Stamina: ${Math.round(this.stamina)}%`);
    // For health
    const healthWidth = this.health * 2;
    this.healthBar.width = healthWidth;
    // Update health label with percentage
    this.healthLabel.setText(`Health: ${Math.round(this.health)}%`);
  }

  // zombie movement
  this.zombieSpeed = 1;
  this.zombieAPatrolling = true;
  this.zombieAPatrollingSpeed = 0.5;
  if (this.zombieA && this.zombieAPatrolling) {
    if (this.zombieAPatrollDistance > this.zombieAPatrollCounter) {
      this.zombieA.x += this.zombieAPatrollingSpeed;
      this.zombieAPatrollCounter += this.zombieAPatrollingSpeed;
    } else {
      this.zombieA.x -= this.zombieAPatrollingSpeed;
      this.zombieAPatrollCounter -= this.zombieAPatrollingSpeed;
    }
    if (this.zombieAPatrollDistance == this.zombieAPatrollCounter) {
      this.zombieAPatrollCounter = 0;
      this.zombieAPatrollDistance = -1 * (Math.random() * 301);
    }
    console.log(this.zombieAPatrollDistance);
    console.log(this.zombieAPatrollCounter);
  }
}

const game = new Phaser.Game(config);
