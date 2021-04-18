import {
  builtinPropSpecs, ManageableProps, PropLoader, makePropsWithPrefix,
  preprocessPropSpecs,
} from './scaffolding/lib/props';

const particleImages = [
  'spritePlayer',
];

export const commands = {
  shoot: {
    input: ['keyboard.Z', 'gamepad.A'],
    cooldown: 200,
  },

  jump: {
    input: ['keyboard.X', 'gamepad.B'],
  },

  up: {
    input: ['keyboard.UP', 'gamepad.UP'],
  },
  down: {
    input: ['keyboard.DOWN', 'gamepad.DOWN'],
  },
  left: {
    input: ['keyboard.LEFT', 'gamepad.LEFT'],
  },
  right: {
    input: ['keyboard.RIGHT', 'gamepad.RIGHT'],
  },
  lstick: {
    input: ['gamepad.LSTICK.RAW'],
    joystick: true,
  },
  rstick: {
    input: ['gamepad.RSTICK.RAW'],
    joystick: true,
  },

  restart: {
    input: ['keyboard.R'],
    execute: (scene) => scene.replaceWithSelf(),
    debug: true,
    unignorable: true,
    unreplayable: true,
  },
  quit: {
    input: ['keyboard.Q'],
    execute: 'forceQuit',
    debug: true,
    unignorable: true,
    unreplayable: true,
  },
  recordCycle: {
    input: ['gamepad.R1'],
    unreplayable: true,
    debug: true,
    unignorable: true,
    execute: (scene, game) => {
      const {_replay, _recording} = game;
      if (_replay && _replay.timeSight) {
        game.stopReplay();
      } else if (_replay) {
        setTimeout(() => {
          game.stopReplay();
          game.beginReplay({..._replay, timeSight: true});
        });
      } else if (_recording) {
        game.stopRecording();
      } else {
        game.beginRecording();
      }
    },
  },
};

export const shaderCoordFragments = null;
export const shaderColorFragments = null;

export const propSpecs = {
  ...builtinPropSpecs(commands, shaderCoordFragments, shaderColorFragments),

  'physics.drag': [0.1, 0, 1],

  'player.facingLeft': [false, null],
  'player.speed': [20, 0, 10000],

  'gun.cooldown': [200, 0, 10000],
  'gun.speed': [200, 0, 10000],

  'jump.velocity': [200, 0, 10000],
  'jump.base_gravity': [2000, 0, 10000],

  'effects.exitSpark.particles': [{
    image: 'spritePlayer',
    speed: 20,
    scaleX: 1,
    scaleY: 1,
    alpha: 0.2,
    quantity: 6,
    frequency: 3000,
    lifespan: 5000,
    preemit: true,
  }],
};

export const tileDefinitions = {
  '.': null, // background
  '@': null, // player
  '*': {
    image: 'tileWall',
    group: 'wall',
    isStatic: true,
    combine: true,
  },
  '#': {
    group: 'wall',
    isStatic: true,
    combine: '*',
  },
};

preprocessPropSpecs(propSpecs, particleImages);

export const manageableProps = new ManageableProps(propSpecs);
export const propsWithPrefix = makePropsWithPrefix(propSpecs, manageableProps);
export default PropLoader(propSpecs, manageableProps);
