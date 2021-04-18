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
    this.createLevel('intro');
    this.player = this.createPlayer();
    this.setupPhysics();
    this.particleSystem('effects.exitSpark', {x: 200, y: 200});
  }

  createPlayer() {
    const {level} = this;
    const tile = level.mapLookups['@'][0];
    const [x, y] = this.positionToScreenCoordinateHalf(tile.x, tile.y);
    const player = this.physics.add.sprite(x, y, 'spritePlayer');
    tile.object = player;
    return player;
  }

  setupAnimations() {
  }

  setupPhysics() {
    const {level, physics, player} = this;
    const {groups} = level;
    physics.add.collider(player, groups.wall.group);
  }

  processInput(time, dt) {
    const {command, player} = this;

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

    player.setVelocityX(player.body.velocity.x + (dx * prop('player.speed')));

    if (dx < 0) {
      player.facingLeft = true;
    } else if (dx > 0) {
      player.facingLeft = false;
    }

    if (command.shoot.held) {
      this.shootGun();
    }

    if (player.body.touching.down) {
      player.isJumping = false;
    }

    if (player.body.touching.down && command.jump.held && !player.isJumping) {
      this.beginJump();
    } else if (player.isJumping && command.jump.held) {
      this.continueJump();
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

  beginJump() {
    const {player} = this;
    player.setVelocityY(-prop('jump.velocity'));
    player.isJumping = true;
  }

  continueJump() {
    const {player} = this;
    player.setVelocityY(-prop('jump.velocity'));
  }

  fixedUpdate(time, dt) {
    this.processInput(time, dt);

    this.physics.world.gravity.y = prop('jump.base_gravity');

    // still pretty terrible but eh
    const drag = prop('physics.drag') ** (1 / this.timeScale);
    this.player.setDrag(drag, drag);
    this.player.body.useDamping = true;
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
