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

export default preload;
