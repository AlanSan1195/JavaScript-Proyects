 export function marioWalk() {

    const { mario, keys, scene, sound } = this;   
    if (keys.left.isDown) {
      mario.setVelocityX(-100);
      mario.flipX = true;
      mario.body.touching.down && mario.anims.play("mario-walk", true);
    } else if (keys.right.isDown) {
      mario.setVelocityX(100);
      mario.flipX = false;
      mario.body.touching.down && mario.anims.play("mario-walk", true);
    } else if (mario.body.touching.down) {
      mario.setVelocityX(0);
      mario.anims.play("mario-stop", true);
    }
    if (keys.up.isDown && mario.body.touching.down) {
      mario.setVelocityY(-260);
      mario.anims.play("mario-jump");
    }
  
    if (mario.y >= altoVentana && !mario.isDead) {
      mario.isDead = true;
  
      mario.setCollideWorldBounds(false);
      if (!gameOverSound) {
        sound.add("game-over", { volume: 0.2 }).play();
        gameOverSound = true;
      }
      setTimeout(() => {
        mario.setVelocityY(-285);
        mario.anims.play("mario-dead", true);
        mario.setGravityY(500);
      }, 100);
      setTimeout(() => {
        scene.restart();
      }, 3000);
    }
  }
  
   export function caminarXL() {
    const { mario, keys, scene, sound } = this; 
    if (marioEstado == 1) {
      //ajueste estos valores para que todos los elemento se acomplen  a la escala de mario, ejemplo cuando crece a 2x mario ya no coliciona bien con una bloque
      mario.body.setSize(18, 32);
      mario.setDisplaySize(18, 32);
    }
    if (mario.body.touching.down && keys.down.isDown) {
      mario.anims.play("mario-xl-down", true);
      marioAgachado = true;
      mario.setVelocityX(0); // Detener el movimiento horizontal mientras está agachado
    } else {
      marioAgachado = false;
  
      if (keys.left.isDown) {
        mario.setVelocityX(-110);
        mario.body.touching.down && mario.anims.play("mario-xl-walk", true);
        mario.flipX = true;
      } else if (keys.right.isDown ) {
        mario.setVelocityX(+110);
        mario.flipX = false;
        mario.body.touching.down && mario.anims.play("mario-xl-walk", true);
      } else if (mario.body.touching.down) {
        mario.setVelocityX(0);
        mario.anims.play("mario-xl-stop", true);
      }
  
      if (keys.up.isDown && mario.body.touching.down) {
        mario.setVelocityY(-270);
        mario.flipX = false;
        mario.anims.play("mario-xl-jump");
      }
    }
  
    if (mario.y >= altoVentana && !mario.isDead) {
      mario.isDead = true;
      mario.setCollideWorldBounds(false);
      if (!gameOverSound) {
        sound.add("game-over", { volume: 0.2 }).play();
        gameOverSound = true;
      }
      setTimeout(() => {
        mario.setVelocityY(-275);
        mario.setGravityY(500);
      }, 100);
      setTimeout(() => {
        marioEstado = 0;
        scene.restart();
      }, 3000);
    }
  }