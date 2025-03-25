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
  console.log("Attempting to load sprite sheet");
  // Verify exact path and log potential issues
  try {
    this.load.spritesheet("player", "assets/Homeless_1/Idle.png", { 
      frameWidth: 64,  // Confirm these match your sprite sheet
      frameHeight: 64
    });
  } catch (error) {
    console.error("Sprite sheet loading error:", error);
  }
}

function create() {
  console.log("Creating scene");

  // Create player with more explicit positioning and scaling
  this.player = this.physics.add.sprite(400, 300, "player")
    .setScale(2)  // Adjust scale to make sprite visible
    .setOrigin(0.5);  // Center the sprite

  // Explicit animation creation
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("player", { start: 0, end: 7 }),
    frameRate: 10,
    repeat: -1
  });

  this.player.play("walk");
}

function update() {
  const cursors = this.input.keyboard.createCursorKeys();

  // Simple movement controls
  this.player.setVelocityX(
    cursors.left.isDown ? -160 : 
    cursors.right.isDown ? 160 : 0
  );

  this.player.setVelocityY(
    cursors.up.isDown ? -160 : 
    cursors.down.isDown ? 160 : 0
  );
}

const game = new Phaser.Game(config);