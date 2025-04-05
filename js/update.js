import config from './config.js'

function update() {
  // Modify the isRunning check
  const shiftKey = this.input.keyboard.addKey('SHIFT');
  let isRunning = false;

  if (this.stamina <= 0) {
    this.canRun = false;
    this.staminaRecoveryDelay = 360; // Set a delay of 360 frames (3 second 60 FPS)
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
  this.zombieSpeed = 0.5;
  this.zombieAPatrollingSpeed = 0.2;
  this.zombieADetectionRange = 275;

  if (this.zombieA.x + this.zombieADetectionRange > this.player.x && this.zombieA.x - this.zombieADetectionRange < this.player.x) {
    this.zombieAPatrolling = false;
  } else {
    this.zombieAPatrolling = true;
  }

  if (this.zombieA && this.zombieAPatrolling) {
    if (this.zombieAPatrollDistance > this.zombieAPatrollCounter) {
      this.zombieA.play("zombie_walk_a", true);
      this.zombieA.setFlipX(false);
      this.zombieA.x += this.zombieAPatrollingSpeed;
      this.zombieAPatrollCounter += this.zombieAPatrollingSpeed;
    } else {
      this.zombieA.play("zombie_walk_a", true);
      this.zombieA.setFlipX(true);
      this.zombieA.x -= this.zombieAPatrollingSpeed;
      this.zombieAPatrollCounter -= this.zombieAPatrollingSpeed;
    }
    if (Math.floor(this.zombieAPatrollDistance) == Math.floor(this.zombieAPatrollCounter)) {
      this.zombieAPatrollCounter = 0;
      if (this.zombieAPatrollDistance < 0) {
        this.zombieAPatrollDistance = Math.random() * 201;
      } else {
        this.zombieAPatrollDistance = -1 * (Math.random() * 201);
      }
    }
  } else if (this.zombieAPatrolling == false) {
    if (this.zombieA.x < this.player.x) {
      this.zombieA.play("zombie_walk_a", true);
      this.zombieA.setFlipX(false);
      this.zombieA.x += this.zombieSpeed;
    } else {
      this.zombieA.play("zombie_walk_a", true);
      this.zombieA.setFlipX(true);
      this.zombieA.x -= this.zombieSpeed;
    }
  }
}

export default update;
