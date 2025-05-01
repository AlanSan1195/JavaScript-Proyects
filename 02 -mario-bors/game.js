import { animations } from "./animations.js";
import { iniciarAudios } from "./audios.js";
import { marioWalk, caminarXL } from "./controls.js";
import { createEnemigos } from "./createEnemigos.js";
import {
  createBricks,
  createMisteryBlocks,
  hitMisteryBlocks,
  hitBricks,
} from "./bricksFunctions.js";
import { consumeCoin, sumaScore } from "./coinsAndScore.js";
import { hitGoomba, hitKoopa } from "./hitEnemies.js";

export const anchoVentana = window.innerWidth;
export const altoVentana = 280;
export const anchoTile = anchoVentana;
export const altoTile = altoVentana / 5;
export const empiezaMario = anchoTile / 3;

//1.- motor phaser
const config = {
  autofocus: false,
  type: Phaser.AUTO,
  width: anchoVentana,
  height: altoVentana,
  backgroundColor: "#049cd8",
  parent: "game",
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  },
};

// Variables globales
let randomMontaña = Phaser.Math.Between(0, 200);
let randomMontañaPequeña = Phaser.Math.Between(600, 900);
let altoPaisaje = altoVentana - altoTile + 26;
export function crearMario() {
  this.mario = this.physics.add
    .sprite(anchoVentana / 8, altoTile, "mario-small")

    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(300);
}
export function matarMario(mario) {
  mario.isDead = true;
  mario.setCollideWorldBounds(false);
  if (!this.gameOverSound) {
    this.sound.add("game-over", { volume: 0.2 }).play();
    this.gameOverSound = true;
  }

  setTimeout(() => {
    mario.setVelocityY(-285);
    this.marioEstado = 0;
    mario.anims.play("mario-dead", true);
    mario.setGravityY(500);
  }, 100);
  setTimeout(() => {
    mario.body.checkCollision.none = true;
  }, 100);
  setTimeout(() => {
    this.marioEstado = 0;
    this.scene.restart();
  }, 3000);
}

//2.- cargar sprites
function preload() {
  // cargara elmenetos de la escena

  this.load.image("cloud1", "assets/scenery/overworld/cloud1.png");
  this.load.image("mountain", "assets/scenery/overworld/mountain2.png");
  this.load.image("mountain-small", "assets/scenery/overworld/mountain1.png");
  this.load.image("flag-base", "assets/scenery/flag-base.png");
  this.load.image("finla-flag", "assets/scenery/final-flag.png");
  this.load.image("pipe-L", "assets/scenery/horizontal-final-tube.png");
  this.load.image("castel", "assets/scenery/castle.png");
  this.load.spritesheet("mario-small", "assets/entities/mario.png", {
    frameWidth: 18,
    frameHeight: 16,
  });
  this.load.spritesheet("mario-xl", "assets/entities/mario-grown.png", {
    frameWidth: 18,
    frameHeight: 32,
  });

  //cargar plataformas
  this.load.image("floorBricks", "assets/scenery/overworld/floorbricks.png");
  this.load.image("pipe", "assets/scenery/pipe1.png");
  this.load.image("bush", "assets/scenery/overworld/bush1.png");
  this.load.spritesheet(
    "mistery-Blocks",
    "assets/blocks/underground/misteryBlock.png",
    {
      frameWidth: 16,
      frameHeight: 16,
    }
  );
  this.load.spritesheet(
    "empty-blocks",
    "assets/blocks/overworld/customBlock.png",
    {
      frameWidth: 16,
      frameHeight: 16,
    }
  );
  this.load.image("brick-image", "assets/blocks/overworld/customBlock.png");
  this.load.image("empty-block", "assets/blocks/underground/emptyBlock.png");

  // cargar coleccionables
  this.load.image("hongo-xl", "assets/collectibles/super-mushroom.png");
  this.load.spritesheet("coin", "assets/collectibles/coin.png", {
    frameWidth: 16,
    frameHeight: 16,
  });

  // cargar enemigos
  this.load.spritesheet("goomba", "assets/entities/overworld/goomba.png", {
    frameWidth: 16,
    frameHeight: 16,
  });
  this.load.spritesheet("koopa", "assets/entities/koopa.png", {
    frameWidth: 16,
    frameHeight: 16,
  });
  this.load.spritesheet("koopa-hidden", "assets/entities/shell.png", {
    frameWidth: 16,
    // esta imagen no mide 32x 16 mide 32x15 se modifico el higth a 15
    frameHeight: 15,
  });

  // cargar audios
  iniciarAudios(this);
}

// 3.- crear el juego
function create() {
  this.marioEstado = 0;
  animations(this);
  console.log("estado de mario:", this.marioEstado);

  // dibujar elementos de la escena
  this.add.image(100, 50, "cloud1").setOrigin(0.5, 0.5).setScale(0.15);

  this.mountain = this.physics.add.staticGroup();
  this.mountain
    .create(randomMontaña, altoPaisaje, "mountain")
    .setOrigin(0, 1)
    .refreshBody();
  this.mountain
    .create(randomMontaña + 880, altoPaisaje, "mountain")
    .setOrigin(0, 1)
    .refreshBody();
  this.mountain
    .create(randomMontañaPequeña, altoPaisaje, "mountain-small")
    .setOrigin(0, 1)
    .refreshBody();

  this.bush = this.physics.add.staticGroup();
  this.bush.create(260, 250, "bush").setOrigin(0, 1).refreshBody();

  this.pipe = this.physics.add.staticGroup();
  this.pipe.create(200, 250, "pipe").setOrigin(0, 1).refreshBody();
  this.pipe.create(340, 270, "pipe").setOrigin(0, 1).refreshBody();

  this.castel = this.physics.add.staticGroup();
  this.castel.create(1440, altoPaisaje, "castel").setOrigin(0, 1).refreshBody();

  this.floorBricks = this.physics.add.staticGroup();
  this.floorBricks
    .create(1150, altoPaisaje - 77, "floorBricks")
    .setOrigin(0, 1)
    .refreshBody();

  this.flag = this.physics.add.staticGroup();
  this.flag
    .create(1360, altoPaisaje - 4, "flag-base")
    .setOrigin(0, 1)
    .refreshBody();
  this.flag
    .create(1353, altoPaisaje - 147, "finla-flag")
    .setOrigin(0, 1)
    .refreshBody();

  // coleccionables
  this.coins = this.physics.add.staticGroup();
  this.coins.create(100, 200, "coin").anims.play("coin-shine", true);
  this.coins.create(300, 160, "coin").anims.play("coin-shine", true);

  // crear suelos tileados
  function crearTile(x, y, width, height, texture) {
    const tile = this.add.tileSprite(x, y, width, height, texture);
    tile.setOrigin(0, 1);
    this.physics.add.existing(tile, true);
    return tile;
  }

  this.tile1 = crearTile.call(
    this,
    0,
    altoVentana - altoTile + 80,
    500,
    altoTile,
    "floorBricks"
  );
  this.tile2 = crearTile.call(
    this,
    570,
    altoVentana - altoTile + 79,
    950,
    altoTile,
    "floorBricks"
  );

  crearMario.call(this);
  createEnemigos(this, anchoVentana);
  createBricks.call(this);
  createMisteryBlocks.call(this);

  // físicas
  this.physics.add.overlap(this.mario, this.coins, consumeCoin, null, this);
  this.physics.add.collider(this.mario, this.tile1);
  this.physics.add.collider(this.mario, this.tile2);
  this.physics.add.collider(this.mario, this.pipe);
  this.physics.add.collider(this.mario, this.floorBricks);
  this.physics.add.collider(this.mario, this.goombas, hitGoomba, null, this);
  this.physics.add.collider(this.mario, this.koopas, hitKoopa, null, this);
  this.physics.add.collider(this.goombas, this.koopas);
  this.physics.add.collider(this.mario, this.bricks, hitBricks, null, this);
  this.physics.add.collider(
    this.mario,
    this.misteryBricks,
    hitMisteryBlocks,
    null,
    this
  );

  // mundo y cámara
  this.physics.world.setBounds(0, 0, 1488, config.height);
  this.cameras.main.setBounds(0, 0, 1528, config.height);
  this.cameras.main.startFollow(this.mario); // Solo UNA VEZ aquí

  // teclas
  this.keys = this.input.keyboard.createCursorKeys();
}

// 4.- iniciar juego
function update() {
  if (this.marioEstado == 1) {
    caminarXL.call(this);
  } else {
    marioWalk.call(this);
  }

  if (this.mario.isDead) {
    this.mario.anims.play("mario-dead", true);
  }
}
new Phaser.Game(config);
