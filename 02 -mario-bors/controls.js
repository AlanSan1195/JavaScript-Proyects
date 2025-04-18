export function marioWalk() {
  const { mario, keys, scene, sound, scale } = this; // también saco scale de this

  if (keys.left.isDown) {
    mario.setVelocityX(-110); // velocidad de caminar izquierda
    mario.flipX = true;
    if (mario.body.touching.down) {
      mario.anims.play("mario-walk", true);
    }
  } else if (keys.right.isDown) {
    mario.setVelocityX(110); // velocidad de caminar derecha
    mario.flipX = false;
    if (mario.body.touching.down) {
      mario.anims.play("mario-walk", true);
    }
  } else {
    mario.setVelocityX(0); // detenerse si no se presiona nada
    if (mario.body.touching.down) {
      mario.anims.play("mario-stop", true);
    }
  }

  // Saltar
  if (keys.up.isDown && mario.body.touching.down) {
    mario.setVelocityY(-270); // un salto más potente
    mario.anims.play("mario-jump", true);
    sound.play("mario-jumping", { volume: 0.2 });
  }

  // Si Mario cae fuera del mundo
  if (mario.y >= scale.height && !mario.isDead) {
    mario.isDead = true;
    mario.setCollideWorldBounds(false);

    if (!this.gameOverSound) {
      sound.add("game-over", { volume: 0.2 }).play();
      this.gameOverSound = true;
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
  const { mario, keys, scene, sound, scale } = this; 
 // Mario grande


  if (this.marioEstado == 1) {
    // Ajuste de tamaño para el Mario grande
    mario.body.setSize(18, 32);
    mario.setDisplaySize(18, 32);
  }

  if (mario.body.touching.down && keys.down.isDown) {
    mario.anims.play("mario-xl-down", true);
    this.marioAgachado = true;
    mario.setVelocityX(0); // agachado, sin moverse
  } else {
    this.marioAgachado = false;

    if (keys.left.isDown) {
      mario.setVelocityX(-110);
      mario.flipX = true;
      if (mario.body.touching.down) {
        mario.anims.play("mario-xl-walk", true);
      }
    } else if (keys.right.isDown) {
      mario.setVelocityX(110);
      mario.flipX = false;
      if (mario.body.touching.down) {
        mario.anims.play("mario-xl-walk", true);
      }
    } else {
      mario.setVelocityX(0);
      if (mario.body.touching.down) {
        mario.anims.play("mario-xl-stop", true);
      }
    }

    if (keys.up.isDown && mario.body.touching.down) {
      mario.setVelocityY(-270);
      mario.anims.play("mario-xl-jump", true);
      sound.play("mario-jumping", { volume: 0.2 });
    }
  }

  // Si cae fuera del mundo
  if (mario.y >= scale.height && !mario.isDead) {
    mario.isDead = true;
    mario.setCollideWorldBounds(false);

    if (!this.gameOverSound) {
      sound.add("game-over", { volume: 0.2 }).play();
      this.gameOverSound = true;
    }

    setTimeout(() => {
      mario.setVelocityY(-275);
      mario.setGravityY(500);
    }, 100);

    setTimeout(() => {
      this.marioEstado = 0;
      scene.restart();
    }, 3000);
  }
}
