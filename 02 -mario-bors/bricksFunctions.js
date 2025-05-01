var emptyBlocksList = [];
import { consumeCoin, sumaScore } from "./coinsAndScore.js";

export function createBricks() {
  let randomX = Phaser.Math.Between(670, 674);
  let randomY = Phaser.Math.Between(205, 205);
  this.bricks = this.physics.add.staticGroup({
    key: "brick-image",
    repeat: 1,
    setXY: { x: randomX, y: randomY, stepX: 400 },
  });
}
export function hitBricks(mario, bricks) {
  if (mario.body.touching.up && bricks.body.touching.down) {
    console.log("colision con bricks");
    this.tweens.add({
      targets: bricks,
      y: bricks.y - 10,
      ease: "Power1",
      duration: 100,
      yoyo: true,
    });
  }
}

export function hitMisteryBlocks(mario, misteryBlocks) {
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

    const consumeHongo = (mario, hongo) => {
      if (this.marioEstado == 1) {
        hongo.destroy();
        return;
      }

      this.sound.play("power-up", { volume: 0.2 });
      mario.anims.play("mario-xl-stop", true);
      hongo.destroy();
      this.marioEstado += 1;
      if (this.marioEstado > 0) {
        //importante para cuando un sprite cambia se tienen que manejar sus alturas para que coincidan con el resto del mapa: explicacion:mira, si mario va a crecer y cambiar de sprite a un tamaño mas grande le decimos con setOffset que mario se desplaza nada en el eje x pero en el eje y se desplazar su altura y lo dividimos 2 para que vuelva a tocar el suelo visualmente si no flotara por que su altura se desplazara solo hacia arriba y despues lo IMPORTANTE:
        mario.body.setOffset(0, mario.height / 2);
        mario.body.setSize(mario.width, mario.height, true);
      }

      console.log(this.marioEstado);
    };
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
export function createMisteryBlocks() {
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
          this.mario,
          newBlock,
          hitMisteryBlocks,
          null,
          this
        );
      }, this);
    }
  }, this);
}
