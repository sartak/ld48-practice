import SuperScene from './scaffolding/SuperScene';
import prop from './props';
import analytics from './scaffolding/lib/analytics';
import {NormalizeVector} from './scaffolding/lib/vector';

export default class PlayScene extends SuperScene {
  constructor() {
    super({
      input: {
        gamepad: true,
      },
      physics: {
        arcade: {
          fps: 60,
        },
      },
    });

    this.performanceProps = [];
    this.mapsAreRectangular = true;
  }

  initialSaveState() {
    return {
      createdAt: Date.now(),
    };
  }

  saveStateVersion() {
    return 1;
  }

  migrateSaveStateVersion1(save) {
  }

  init(config) {
    super.init(config);
  }

  preload() {
    super.preload();
  }

  create(config) {
    super.create(config);
    this.player = this.physics.add.sprite(this.game.config.width / 2, this.game.config.height - 40, 'spritePlayer');
  }

  setupAnimations() {
  }

  processInput(time, dt) {
    const {command} = this;

    let dx = 0;
    let stickInput = false;

    if (command.right.held) {
      dx = 1;
    } else if (command.left.held) {
      dx = -1;
    }

    if (command.lstick.held) {
      [dx] = command.lstick.held;
      stickInput = true;
    } else if (command.rstick.held) {
      [dx] = command.rstick.held;
      stickInput = true;
    }

    if (stickInput) {
      if (Math.abs(dx) > 0.9) {
        dx = dx < 0 ? -1 : 1;
      }
    }

    if (Math.abs(dx) > 1) {
      dx = 1 * dx < 0 ? -1 : 1;
    }

    this.player.setVelocityX(this.player.body.velocity.x + (dx * dt));

    if (dx < 0) {
      this.player.facingLeft = true;
    } else if (dx > 0) {
      this.player.facingLeft = false;
    }

    if (command.shoot.held) {
      this.shootGun();
    }

    if (command.jump.held) {
      this.jump();
    }
  }

  shootGun() {
    const {player} = this;
    let dx = 1;
    if (player.facingLeft) {
      dx *= -1;
    }

    const {x, y} = player;
    const bullet = this.physics.add.sprite(x + player.width * dx, y, 'gunBullet');
    bullet.setVelocityX(dx * prop('gun.speed'));
    bullet.body.allowGravity = false;
  }

  jump() {
    const {player} = this;
    player.setVelocityY(-prop('jump.velocity'));
  }

  fixedUpdate(time, dt) {
    this.processInput(time, dt);

    this.physics.world.gravity.y = prop('jump.base_gravity');

    this.player.setVelocityX(this.player.body.velocity.x * (1 - prop('physics.drag')));
    this.player.setVelocityY(this.player.body.velocity.y * (1 - prop('physics.drag')));
  }

  launchTimeSight() {
    super.launchTimeSight();
  }

  renderTimeSightFrameInto(scene, phantomDt, time, dt, isLast) {
    const objects = [];

    const player = scene.physics.add.sprite(this.player.x, this.player.y, 'spritePlayer');
    player.alpha = 0.4;
    objects.push(player);

    return objects;
  }

  debugHandlePointerdown(event) {
    let {x, y} = event;

    x += this.camera.scrollX;
    y += this.camera.scrollY;

    this.player.x = x;
    this.player.y = y;
  }

  _hotReloadCurrentLevel() {
    super._hotReloadCurrentLevel({
    }, {
      animation: 'crossFade',
      duration: 200,
      delayNewSceneShader: true,
      removeOldSceneShader: true,
    }).then((scene) => {
    });
  }

  _hot() {
  }
}
