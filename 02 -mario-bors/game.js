import { animations } from "./animations.js";

const config = {
  type: Phaser.AUTO,
  width: 244,
  height: 280,
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

var emptyBlocksList = [];

function hitBlock(mario, block) {
  console.log("hit block and get hongo");
  if (!mario.body.blocked.up) {
    return;
  }[]
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

  if (random < 30) {
    let coin = this.physics.add.sprite(block.x, block.y - 20, "coin");

    coin.body.allowGravity = false;
    this.coin = coin;
    if (this.coin) {
      this.coin.anims.play("coin-shine", true);
    } else {
      return;
    }

    // Añadir un collider con una función de callback para manejar la colisión
    this.physics.add.collider(this.mario, coin, function (mario, coin) {
      this.mario = mario;
      coin.destroy(); //
    });

    this.tweens.add({
      targets: coin,
      duration: 250,
      y: coin.y - 6,
      onComplete: () => {
        this.tweens.add({
          targets: coin,
          duration: 250,
          y: coin.y + 10,
        });
      },
    });
  } else if (random > 30) {
    let hongo = this.physics.add.sprite(block.x, block.y - 20, "hongo-xl");
    hongo.body.allowGravity = false;
    this.hongo = hongo;
    this.physics.add.collider(this.mario, hongo, function (mario, hongo) {
      this.mario = mario;
      hongo.destroy();
    });
    this.tweens.add({
      targets: hongo,
      duration: 250,
      y: hongo.y - 6,
      onComplete: () => {
        this.tweens.add({
          targets: hongo,
          duration: 550,
          y: hongo.y + 10,
          onComplete: () => {
            if (!hongo) {
              return;
            }
            if (Phaser.Math.Between(0, 10) <= 4) {
              hongo.setVelocityX(50);
              setTimeout(() => {
                hongo.body.allowGravity = true;
                this.physics.add.collider(hongo, this.tile);
                this.physics.add.collider(hongo, this.floor);
                this.physics.add.collider(hongo, this.pipe, function ( hongo , pipe){
                  this.pipe = pipe;
                  hongo.setVelocityX(-50);
                });
              }, 400);
            } else {
              hongo.setVelocityX(-50);
              setTimeout(() => {
                hongo.body.allowGravity = true;
                this.physics.add.collider(hongo, this.tile);
                this.physics.add.collider(hongo, this.floor);
                this.physics.add.collider(hongo, this.pipe, function (hongo, pipe ){
                  this.pipe = pipe;
                  hongo.setVelocityX(50);
                } );
              }, 400);
            }
          },
        });
      },
    });
  }
}

function preload() {
  // cargara elmenetos de la escena
  this.load.image("cloud1", "assets/scenery/overworld/cloud1.png");
  this.load.spritesheet("mario", "assets/entities/mario.png", {
    frameWidth: 18,
    frameHeight: 16,
  });

  //cargar plataformas
  this.load.image("floorbricks", "assets/scenery/overworld/floorbricks.png");
  this.load.image("pipe", "assets/scenery/pipe1.png");
  this.load.image("mountain", "assets/scenery/overworld/mountain2.png");
  this.load.image("mountain-small", "assets/scenery/overworld/mountain1.png");
  this.load.image("bush", "assets/scenery/overworld/bush1.png");
  this.load.audio("game-over", "assets/sound/music/gameOver.mp3");
  this.load.spritesheet(
    "mistery-Blocks",
    "assets/blocks/underground/misteryBlock.png",
    {
      frameWidth: 16,
      frameHeight: 16,
    }
  );
  this.load.image("empty-block", "assets/blocks/underground/emptyBlock.png");

  // cargara coleccionables
  this.load.image("hongo-xl", "assets/collectibles/super-mushroom.png");
  this.load.spritesheet("coin", "assets/collectibles/coin.png", {
    frameWidth: 16,
    frameHeight: 16,
  });
}
function create() {
  this.add.image(100, 50, "cloud1").setOrigin(0.5, 0.5).setScale(0.15);

  this.block = this.add.sprite(150, 200, "mistery-Blocks");
  this.physics.add.existing(this.block);
  this.block.body.setImmovable(true); // evito que se mueva el bloque si mario colisiona con el
  this.block.body.allowGravity = false; // Evitar que el bloque sea afectado por la gravedad

  this.mountain = this.physics.add.staticGroup();
  this.mountain.create(0, 250, "mountain").setOrigin(0, 1).refreshBody();
  this.mountain
    .create(400, 250, "mountain-small")
    .setOrigin(0, 1)
    .refreshBody();

  this.bush = this.physics.add.staticGroup();
  this.bush.create(260, 250, "bush").setOrigin(0, 1);

  this.pipe = this.physics.add.staticGroup();
  this.pipe.create(200, 250, "pipe").setOrigin(0, 1).refreshBody();
  // this.pipe.create(250, 250, "pipe").setOrigin(0, 1).refreshBody();

  this.tile = this.add
    .tileSprite(0, 280, 1000, 32, "floorbricks")
    .setOrigin(0, 1);
  this.physics.add.existing(this.tile, true);

  this.floor = this.physics.add.staticGroup();
  this.floor.create(1010, 280, "floorbricks").setOrigin(0, 1).refreshBody();
  this.floor.create(1180, 280, "floorbricks").setOrigin(0, 1).refreshBody();

  this.mario = this.physics.add
    .sprite(100, 100, "mario")
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    .setGravityY(300);

  this.physics.add.collider(this.mario, this.tile);
  this.physics.add.collider(this.mario, this.floor);
  this.physics.add.collider(this.mario, this.pipe);
  //implementar physics y acciones
  this.physics.add.collider(this.mario, this.block, hitBlock, null, this);

  this.physics.world.setBounds(0, 0, 2000, config.height);
  this.cameras.main.setBounds(0, 0, 2000, config.height);
  this.cameras.main.startFollow(this.mario);
  animations(this);

  this.keys = this.input.keyboard.createCursorKeys();
}
function update() {
  if (this.keys.left.isDown) {
    this.mario.x -= 2;
    this.mario.flipX = true;
    this.mario.anims.play("mario-walk", true);
  } else if (this.keys.right.isDown) {
    this.mario.x += 2;
    this.mario.flipX = false;
    this.mario.anims.play("mario-walk", true);
  } else {
    this.mario.anims.play("mario-stop", true);
  }
  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-260);
    this.mario.anims.play("mario-jump", true);
  }
  if (this.mario.y >= config.height && !this.mario.isDead) {
    this.mario.isDead = true;
    this.mario.setCollideWorldBounds(false);
    if (!this.gameOverSound) {
      this.sound.add("game-over", { volume: 0.2 }).play();
      this.gameOverSound = true;
    }
    setTimeout(() => {
      this.mario.setVelocityY(-210);
      this.mario.anims.play("mario-dead", true);
      this.mario.setGravityY(500);
    }, 100);
    setTimeout(() => {
      this.scene.restart();
    }, 3000);
  }
  if (this.block.isHit) {
    this.block.anims.play("block-hit", true);
  } else {
    this.block.isHit = false;
    this.block.anims.play("block-shine", true);
  }
}
new Phaser.Game(config);
