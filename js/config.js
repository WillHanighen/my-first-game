import preload from './preload.js';
import create from './create.js'
import update from './update.js';

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

export default config;
