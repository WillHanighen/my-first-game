import config from './config.js'

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
  this.zombieAPatrollDistance = Math.floor(Math.random() * 201);
  this.zombieAPatrolling = true;

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
    repeat: -1
  })

  this.player.play("idle");
  this.zombieA.play("zombie_idle_a");

  // Add collision between entities
  this.physics.add.collider(this.player, this.floor);
  this.physics.add.collider(this.zombieA, this.floor);
  this.physics.add.collider(this.player, this.zombieA, (player, zombieA) => {
    console.log("Player collided with zombie A");
    this.health = Math.max(0, this.health - this.zombieAdamage);
    this.zombieA.play("zombie_attack_A", true);
  }, null, this);

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

export default create;
