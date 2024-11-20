import { animations } from "./animations.js";
import { iniciarAudios } from "./audios.js";
const anchoVnetana = window.innerWidth;
const altoVentana = 280;
const anchoTile = anchoVnetana;
const altoTile = altoVentana / 5;
const empiezaMario = anchoTile / 3;

const config = {
  autofocus: false,
  type: Phaser.AUTO,
  width: anchoVnetana,
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

var mario;
var goomba;
var score = 0;
var marioBloqueado = false;
var marioAgachado = false;
var marioEstado = 0;
var emptyBlocksList = [];
let randomMontaña = Phaser.Math.Between(0, 200);
let randomMontañaPequeña = Phaser.Math.Between(0, 800);
let randomPiso = Phaser.Math.Between(520, 450);
var ramdomMisteryBlocksX = Phaser.Math.Between(430, 480);
var ramdomMisteryBlocksY = Phaser.Math.Between(180, 190);
let altoPaisaje = altoVentana - altoTile + 26;

function crearMario() {
  mario = this.physics.add
    .sprite(anchoVnetana / 9, altoTile, "mario-small")

    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(300);
}
function createEnemigos() {
  const VELOCIDAD_INICIAL = 50;

  // Crear un grupo de enemigos
  this.enemigos = this.physics.add.group({
    key: "goomba",
    repeat: 8, // número de goombas adicionales
    setXY: { x: anchoVnetana / 3, y: 200, stepX: 190 },
  });

  this.enemigos.children.iterate(function (goomba) {
    goomba.setOrigin(0, 1);
    goomba.setGravityY(300);
    goomba.anims.play("goomba-walk");

    let direction = Phaser.Math.Between(0, 10);
    goomba.setVelocityX(direction > 1 ? -VELOCIDAD_INICIAL : VELOCIDAD_INICIAL);
  });

  this.physics.add.collider(this.enemigos, this.tile1);
  this.physics.add.collider(this.enemigos, this.tile2);
  this.physics.add.collider(this.enemigos, this.pipe, (enemigos, pipe) => {
    this.enemigos = enemigos;
    if (enemigos.body.blocked.down && enemigos.body.blocked.right) {
      enemigos.setVelocityX(-VELOCIDAD_INICIAL);
    } else if (enemigos.body.blocked.down && enemigos.body.blocked.left) {
      enemigos.setVelocityX(VELOCIDAD_INICIAL);
    }
  });
}
function createBricks() {
  let randomX = Phaser.Math.Between(670, 674);
  let randomY = Phaser.Math.Between(205, 205);
  this.bricks = this.physics.add.staticGroup({
    key: "brick-image",
    repeat: 1,
    setXY: { x: randomX, y: randomY, stepX: 400 },
  });
}
function createMisteryBlocks() {
  let randomX = Phaser.Math.Between(296, 300);
  let randomY = Phaser.Math.Between(180, 190);
  this.misteryBricks = this.physics.add.staticGroup({
    key: "mistery-Blocks",
    repeat: 1,
    setXY: { x: randomX, y: randomY, stepX: 410 },
  });

  this.misteryBricks.children.iterate(function (block) {
    block.isHit = false;
    block.anims.play("block-shine", true);
    let random = Phaser.Math.Between(0, 100);
    if ((random) => 50) {
      let newBlockX = block.x;
      let newBlockY = block.y;

      let newMysterisRandom = this.physics.add.staticGroup({
        key: "mistery-Blocks",
        repeat: 1,
        setXY: { x: newBlockX + 16, y: newBlockY, stepX: 70 },
      });
      newMysterisRandom.children.iterate(function (newBlock) {
        newBlock.anims.play("block-shine", true);
        this.physics.add.collider(
          mario,
          newBlock,
          hitMisteryBlocks,
          null,
          this
        );
      }, this);
    }
  }, this);
}
function hitBricks(mario, bricks) {
  if (mario.body.touching.up && bricks.body.touching.down) {
    console.log("colision con bricks");
    this.tweens.add({
      targets: bricks,
      y: bricks.y - 10,
      ease: "Power1",
      duration: 100,
      yoyo: true,
    });
    // bricks.destroy();
  }
}

function hitMisteryBlocks(mario, misteryBlocks) {
  if (!mario.body.blocked.up) {
    return;
  }

  if (emptyBlocksList.includes(misteryBlocks)) {
    return;
  }
  emptyBlocksList.push(misteryBlocks);
  misteryBlocks.isHit = true;
  if (!misteryBlocks.isHit) {
    return;
  } else {
    misteryBlocks.anims.play("block-hit", true);
  }
  // Animar el bloque
  this.tweens.add({
    targets: misteryBlocks,
    y: misteryBlocks.y - 20,
    ease: "Power1",
    duration: 100,
    yoyo: true,
  });

  let random = Phaser.Math.Between(0, 100);

  if (random > 50) {
    let coin = this.physics.add.sprite(
      misteryBlocks.x,
      misteryBlocks.y - 20,
      "coin"
    );

    coin.body.allowGravity = false;
    this.coin = coin;
    if (this.coin) {
      this.coin.anims.play("coin-shine", true);
      this.physics.add.overlap(mario, coin, consumeCoin, null, this);
    } else {
      return;
    }

    // Añadir un collider con una función de callback para manejar la colisión

    this.tweens.add({
      targets: coin,
      duration: 250,
      y: coin.y - 6,
      start: performance.now(),
      onComplete: () => {
        this.tweens.add({
          targets: coin,
          duration: 250,
          y: coin.y + 10,
        });
      },
    });
  } else if (random <= 50) {
    let hongo = this.physics.add.sprite(
      misteryBlocks.x,
      misteryBlocks.y - 20,
      "hongo-xl"
    );
    hongo.body.allowGravity = false;
    this.hongo = hongo;

    function consumeHongo(mario, hongo) {
      this.sound.play("power-up", { volume: 0.2 });
      mario.anims.play("mario-xl-stop", true);
      hongo.destroy();
      marioEstado += 1;
      if (marioEstado > 0) {
        //importante para cuando un sprite cambia se tienen que manejar sus alturas para que coincidan con el resto del mapa: explicacion:mira, si mario va a crecer y cambiar de sprite a un tamaño mas grande le decimos con setOffset que mario se desplaza nada en el eje x pero en el eje y se desplazar su altura y lo dividimos 2 para que vuelva a tocar el suelo visualmente si no flotara por que su altura se desplazara solo hacia arriba y despues lo IMPORTANTE:
        mario.body.setOffset(0, mario.height / 2);
        mario.body.setSize(mario.width, mario.height, true);
      }
      console.log(marioEstado);
    }
    this.physics.add.collider(mario, hongo, consumeHongo, null, this);
    this.tweens.add({
      targets: hongo,
      duration: 250,
      y: hongo.y - 6,
      start: performance.now(),
      onComplete: () => {
        this.tweens.add({
          targets: hongo,
          duration: 550,
          y: hongo.y + 10,
          start: performance.now(),
          onComplete: () => {
            if (!hongo) {
              return;
            }
            if (Phaser.Math.Between(0, 10) <= 4) {
              hongo.setVelocityX(50);
              setTimeout(() => {
                hongo.body.allowGravity = true;
                this.physics.add.collider(hongo, this.tile1);
                this.physics.add.collider(hongo, this.tile2);
                this.physics.add.collider(hongo, this.tile3);
                this.physics.add.collider(
                  hongo,
                  this.pipe,
                  function (hongo, pipe) {
                    this.pipe = pipe;
                    hongo.setVelocityX(-50);
                  }
                );
              }, 400);
            } else {
              hongo.setVelocityX(-50);
              setTimeout(() => {
                hongo.body.allowGravity = true;
                this.physics.add.collider(hongo, this.tile1);
                this.physics.add.collider(hongo, this.tile2);
                this.physics.add.collider(hongo, this.tile3);
                this.physics.add.collider(
                  hongo,
                  this.pipe,
                  function (hongo, pipe) {
                    this.pipe = pipe;
                    hongo.setVelocityX(50);
                  }
                );
              }, 400);
            }
          },
        });
      },
    });
  }
}

// Asegúrate de exportar la función sumaScore
export function sumaScore() {
  // vamos a agarrar el div con el id score y le ponemos de froma dinamica el score
  const scoreElement = document.getElementById("score");
  scoreElement.innerText = score;
}

function marioWalk() {
  if (this.keys.left.isDown) {
    mario.setVelocityX(-110);
    if (!mario.body.touching.down) {
      mario.setVelocityX(-94);
    }
    mario.flipX = true;
    mario.body.touching.down && mario.anims.play("mario-walk", true);
  } else if (this.keys.right.isDown) {
    mario.setVelocityX(+110);
    if (!mario.body.touching.down) {
      mario.setVelocityX(94);
    }
    mario.flipX = false;
    mario.body.touching.down && mario.anims.play("mario-walk", true);
  } else if (mario.body.touching.down) {
    mario.setVelocityX(0);
    mario.anims.play("mario-stop", true);
  }
  if (this.keys.up.isDown && mario.body.touching.down) {
    mario.setVelocityY(-260);
    mario.anims.play("mario-jump");
    this.sound.play("mario-jumping", { volume: 0.2 });
  }

  if (mario.y >= altoVentana && !mario.isDead) {
    mario.isDead = true;
    mario.setCollideWorldBounds(false);
    if (!this.gameOverSound) {
      this.sound.add("game-over", { volume: 0.2 }).play();
      this.gameOverSound = true;
    }
    setTimeout(() => {
      mario.setVelocityX(0);
      mario.setVelocityY(-285);
      mario.anims.play("mario-dead", true);
      mario.setGravityY(500);
    }, 100);
    setTimeout(() => {
      this.scene.restart();
    }, 3000);
  }
}

function caminarXL() {
  if (mario.body.touching.down && this.keys.down.isDown) {
    mario.anims.play("mario-xl-down", true);
    marioAgachado = true;
    mario.setVelocityX(0); // Detener el movimiento horizontal mientras está agachado
  } else {
    marioAgachado = false;

    if (this.keys.left.isDown) {
      mario.setVelocityX(-110);
      mario.body.touching.down && mario.anims.play("mario-xl-walk", true);
      mario.flipX = true;
    } else if (this.keys.right.isDown) {
      mario.setVelocityX(+110);
      mario.flipX = false;
      mario.body.touching.down && mario.anims.play("mario-xl-walk", true);
    } else if (mario.body.touching.down) {
      mario.setVelocityX(0);
      mario.anims.play("mario-xl-stop", true);
    }

    if (this.keys.up.isDown && mario.body.touching.down) {
      this.sound.play("mario-jumping", { volume: 0.2 });
      mario.setVelocityY(-260);
      mario.anims.play("mario-xl-jump");
    }
  }

  if (mario.y >= altoVentana && !mario.isDead) {
    mario.isDead = true;
    mario.setCollideWorldBounds(false);
    if (!this.gameOverSound) {
      this.sound.add("game-over", { volume: 0.2 }).play();
      this.gameOverSound = true;
    }
    setTimeout(() => {
      mario.setVelocityY(-275);
      mario.setGravityY(500);
    }, 100);
    setTimeout(() => {
      marioEstado = 0;
      this.scene.restart();
    }, 3000);
  }
}
function consumeCoin(mario, coin) {
  this.sound.play("coin-sound", { volume: 0.2 });
  const scoreText = this.add.text(coin.x, coin.y, "100", {
    fontFamily: "pixel",
    fontSize: anchoVnetana / 90,
  });
  score += 100;
  this.tweens.add({
    targets: scoreText,
    duration: 500,
    y: scoreText.y - 20,
    onComplete: () => {
      this.tweens.add({
        targets: scoreText,
        duration: 100,
        alpha: 0,
        onComplete: () => {
          scoreText.destroy();
        },
      });
    },
  });
  if (scoreText) {
    sumaScore();
    console.log(score);
  }

  coin.destroy();
}

function hitGoomba(mario, goomba) {
  if (mario.body.touching.down && goomba.body.touching.up) {
    // Mario colisiona con Goomba desde arriba
    goomba.anims.play("goomba-hit", true); // Animación específica para el salto sobre Goomba

    mario.setVelocityY(-170); // Rebote de Mario
    this.sound.play("goomba-sound", { volume: 5.8 });
    setTimeout(() => {
      mario.anims.play("mario-jump", true);
    }, 50);
    setTimeout(() => {
      goomba.destroy();
    }, 200);
  } else {
    // Mario colisiona con Goomba desde los lados o desde abajo
    mario.isDead = true;
    goomba.destroy();
    mario.setCollideWorldBounds(false);
    if (!this.gameOverSound) {
      this.sound.add("game-over", { volume: 0.2 }).play();
      this.gameOverSound = true;
    }

    setTimeout(() => {
      mario.setVelocityY(-285);
      mario.anims.play("mario-dead", true);
      mario.setGravityY(500);
    }, 100);
    setTimeout(() => {
      mario.body.checkCollision.none = true;
    }, 100);
    setTimeout(() => {
      marioEstado = 0;
      this.scene.restart();
    }, 3000);
  }
}

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

  // cargar audios
  iniciarAudios(this);
}

function create() {
  animations(this);

  // dibujar elementos de la escena
  //nuebe
  this.add.image(100, 50, "cloud1").setOrigin(0.5, 0.5).setScale(0.15);
  //montallas
  this.mountain = this.physics.add.staticGroup();

  this.mountain
    .create(randomMontaña, altoPaisaje, "mountain")
    .setOrigin(0, 1)
    .refreshBody();
  this.mountain
    .create(randomMontañaPequeña, altoPaisaje, "mountain-small")
    .setOrigin(0, 1)
    .refreshBody();

  //flag
  this.add.image(1360, altoPaisaje - 4, "flag-base").setOrigin(0, 1);
  this.add.image(1353, altoPaisaje - 147, "finla-flag").setOrigin(0, 1);

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

  // Definir la función crearTile dentro de create
  function crearTile(x, y, width, height, texture) {
    const tile = this.add.tileSprite(x, y, width, height, texture);
    tile.setOrigin(0, 1);
    this.physics.add.existing(tile, true);
    return tile;
  }

  // Usar la función crearTile para crear los tiles
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
  createEnemigos.call(this);
  createBricks.call(this);
  createMisteryBlocks.call(this);

  //implementar fisicas y acciones
  this.physics.add.overlap(mario, this.coins, consumeCoin, null, this);
  this.physics.add.collider(mario, this.tile1);
  this.physics.add.collider(mario, this.tile2);
  this.physics.add.collider(mario, this.tile3);
  this.physics.add.collider(mario, this.floor);
  this.physics.add.collider(mario, this.pipe);
  this.physics.add.collider(mario, this.floorBricks);
  this.physics.add.collider(mario, this.enemigos, hitGoomba, null, this);
  // this.physics.add.collider(mario, this.block, hitBlock, null, this);
  this.physics.add.collider(
    mario,
    this.misteryBricks,
    hitMisteryBlocks,
    null,
    this
  );
  this.physics.add.collider(mario, this.bricks, hitBricks, null, this);

  // tamaño del mundo y camaras
  this.physics.world.setBounds(0, 0, 1488, config.height);
  this.cameras.main.setBounds(0, 0, 1528, config.height);
  this.cameras.main.startFollow(mario);

  this.keys = this.input.keyboard.createCursorKeys();
}

function update() {
  if (marioEstado == 1) {
    caminarXL.call(this);
  } else {
    marioWalk.call(this);
  }

  if (mario.isDead) {
    mario.anims.play("mario-dead", true);
  }
}
new Phaser.Game(config);
