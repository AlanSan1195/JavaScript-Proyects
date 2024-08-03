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
      debug: false,
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
let altoPaisaje = altoVentana - altoTile + 26;

function crearMario() {
  mario = this.physics.add
    .sprite(anchoVnetana / 9, altoTile, "mario-small")

    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(300);
}

function createEnemigos() {
  goomba = this.physics.add.sprite(anchoVnetana / 3, 200, "goomba");
  goomba.setOrigin(0, 1);
  goomba.setGravityY(300);
  goomba.anims.play("goomba-walk");

  let randomgombadirection = Phaser.Math.Between(0, 10);
  if (randomgombadirection > 1) {
    goomba.setVelocityX(-50);
  } else {
    goomba.setVelocityX(50);
  }

  this.physics.add.collider(goomba, this.tile1);
  this.physics.add.collider(goomba, this.pipe, function (goomba, pipe) {
    this.pipe = pipe;
    if (goomba.setVelocityX(-40)) {
      goomba.setVelocityX(40);
    } else {
      goomba.setVelocityX(-40);
    }
    if (!mario.isDead) {
      return;
    }
  });
}
// Asegúrate de exportar la función sumaScore
export function sumaScore() {

  // vamos a agarrar el div con el id score y le ponemos de froma dinamica el score
  const scoreElement = document.getElementById("score");
  scoreElement.innerText = (score);
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

function hitBlock(mario, block) {
  console.log("hit block and get hongo");
  if (!mario.body.blocked.up) {
    return;
  }

  if (emptyBlocksList.includes(block)) {
    return;
  }
  emptyBlocksList.push(block);
  block.isHit = true;
  // Animar el bloque
  this.tweens.add({
    targets: block,
    y: block.y - 20,
    ease: "Power1",
    duration: 100,
    yoyo: true,
  });

  let random = Phaser.Math.Between(0, 100);

  if (random > 10) {
    let coin = this.physics.add.sprite(block.x, block.y - 20, "coin");

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
    let hongo = this.physics.add.sprite(block.x, block.y - 20, "hongo-xl");
    hongo.body.allowGravity = false;
    this.hongo = hongo;

    function consumeHongo(mario, hongo) {
      this.sound.play("power-up", { volume: 0.2 });
      mario.anims.play("mario-xl-stop", true);
      hongo.destroy();
      marioEstado += 1;
      if (marioEstado > 0) {
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
                this.physics.add.collider(hongo, this.floor);
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
                this.physics.add.collider(hongo, this.floor);
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
function hitGoomba(mario, goomba) {
  if (mario.body.touching.down && goomba.body.touching.up) {
    // Mario colisiona con Goomba desde arriba
    goomba.anims.play("goomba-hit", true); // Animación específica para el salto sobre Goomba

    mario.setVelocityY(-170); // Rebote de Mario
    this.sound.play("goomba-sound");
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
  this.load.spritesheet("mario-small", "assets/entities/mario.png", {
    frameWidth: 18,
    frameHeight: 16,
  });
  this.load.spritesheet("mario-xl", "assets/entities/mario-grown.png", {
    frameWidth: 18,
    frameHeight: 32,
  });

  //cargar plataformas
  this.load.image("floorbricks", "assets/scenery/overworld/floorbricks.png");
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
  this.add.image(100, 50, "cloud1").setOrigin(0.5, 0.5).setScale(0.15);
  this.mountain = this.physics.add.staticGroup();
  this.mountain
    .create(randomMontaña, altoPaisaje, "mountain")
    .setOrigin(0, 1)
    .refreshBody();
  this.mountain
    .create(randomMontañaPequeña, altoPaisaje, "mountain-small")
    .setOrigin(0, 1)
    .refreshBody();
  this.block = this.add.sprite(150, 180, "mistery-Blocks");
  this.physics.add.existing(this.block);
  this.block.body.setImmovable(true); // evito que se mueva el bloque si mario colisiona con el
  this.block.body.allowGravity = false; // Evitar que el bloque sea afectado por la gravedad

  this.bush = this.physics.add.staticGroup();
  this.bush.create(260, 250, "bush").setOrigin(0, 1);

  this.pipe = this.physics.add.staticGroup();
  this.pipe.create(200, 250, "pipe").setOrigin(0, 1).refreshBody();

  // coleccionables
  this.coins = this.physics.add.staticGroup();
  this.coins
    .create(100, 200, "coin")
    .setOrigin(0, 1)
    .anims.play("coin-shine", true);
  this.coins
    .create(300, 160, "coin")
    .setOrigin(0, 1)
    .anims.play("coin-shine", true);

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
    "floorbricks"
  );
  this.tile2 = crearTile.call(
    this,
    570,
    altoVentana - altoTile + 79,
    550,
    altoTile,
    "floorbricks"
  );
  this.tile3 = crearTile.call(
    this,
    1200,
    altoVentana - altoTile + 79,
    350,
    altoTile,
    "floorbricks"
  );
  crearMario.call(this);
  createEnemigos.call(this);

  //implementar physics y acciones
  this.physics.add.overlap(mario, this.coins, consumeCoin, null, this);
  this.physics.add.collider(mario, this.tile1);
  this.physics.add.collider(mario, this.tile2);
  this.physics.add.collider(mario, this.tile3);
  this.physics.add.collider(mario, this.floor);
  this.physics.add.collider(mario, this.pipe);
  this.physics.add.collider(mario, goomba, hitGoomba, null, this);
  this.physics.add.collider(mario, this.block, hitBlock, null, this);

  // tamaño del mundo y camaras
  this.physics.world.setBounds(0, 0, 2000, config.height);
  this.cameras.main.setBounds(0, 0, 2000, config.height);
  this.cameras.main.startFollow(mario);

  this.keys = this.input.keyboard.createCursorKeys();
}

function update() {
  if (marioEstado == 1) {
    mario.setOffset(0, mario.height / 2);

    caminarXL.call(this);
  } else {
    marioWalk.call(this);
  }

  if (this.block.isHit) {
    this.block.anims.play("block-hit", true);
  } else {
    this.block.isHit = false;
    this.block.anims.play("block-shine", true);
  }
  if (mario.isDead) {
    mario.anims.play("mario-dead", true);
  }
}
new Phaser.Game(config);
