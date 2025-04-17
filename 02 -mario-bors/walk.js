 export function marioWalk(mario) {
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
  
   export function caminarXL() {
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