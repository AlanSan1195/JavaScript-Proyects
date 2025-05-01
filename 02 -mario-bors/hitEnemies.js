import { matarMario } from "./game.js";


export function hitGoomba(mario, goomba) {
  if (mario.body.touching.down && goomba.body.touching.up) {
    // Mario colisiona con Goomba desde arriba
    goomba.anims.play("goomba-hit", true); // Animación específica para el salto sobre Goomba

    mario.setVelocityY(-140); // Rebote de Mario
    // Bloqueamos la colisión de Mario desde arriba
    this.sound.play("goomba-sound", { volume: 5.8 });
    setTimeout(() => {
      mario.anims.play("mario-jump", true);
    }, 50);
    setTimeout(() => {
      goomba.destroy();
    }, 200);
  } else {
    goomba.setVelocityX(0);
    matarMario.call(this, mario);
    // Mario no colisiona desde arriba -> muere
  }
}

export function hitKoopa(mario, koopa) {
  if (mario.body.touching.down && koopa.body.touching.up) {
    // Mario aplasta a Koopa normal
    let x = koopa.x;
    let y = koopa.y;

    koopa.destroy(); // Eliminamos al koopa normal

    // Creamos el caparazón
    const koopaHidden = this.physics.add.sprite(x, y, "koopa-hidden");
    koopaHidden.setOrigin(0, 1);
    koopaHidden.body.allowGravity = true;
    koopaHidden.setCollideWorldBounds(true);
    koopaHidden.setVelocityX(0);
    koopaHidden.anims.play("koopa-hit", true);

    // Rebote inicial de Mario
    mario.setVelocityY(-140);
    this.sound.play("goomba-sound", { volume: 0.2 });

    setTimeout(() => {
      mario.anims.play("mario-jump", true);
    }, 50);

    this.physics.add.collider(koopaHidden, this.tile1);
    this.physics.add.collider(koopaHidden, this.tile2);
    this.physics.add.collider(koopaHidden, this.floorBricks);
    this.physics.add.collider(koopaHidden, this.mario, (koopaHidden, mario) => {
      const caeEncima =
        mario.body.touching.down && koopaHidden.body.touching.up;
      const tocaLado = mario.body.touching.left || mario.body.touching.right;
      let random = Phaser.Math.Between(0, 10);
      if (random > 5) {
        random = 140;
      } else {
        random = -140;
      }
      console.log(random);

      // Inicializa la propiedad si no existe TOP JAVASCRIP
      if (typeof koopaHidden.isMoving === "undefined") {
        koopaHidden.isMoving = false;
      }

      if (caeEncima) {
        if (!koopaHidden.isMoving) {
          // Estaba quieto, lo impulsamos
          koopaHidden.setVelocityX(random);
          koopaHidden.isMoving = true;
        } else {
          // Ya se movía, lo detenemos
          koopaHidden.setVelocityX(0);
          koopaHidden.isMoving = false;
        }

        mario.setVelocityY(-140);
        this.sound.play("goomba-sound", { volume: 3.2 });
        return;
      }

      // Si lo toca de lado
      if (tocaLado) {
        const marioTocaDesdeIzquierda = mario.x < koopaHidden.x;

        if (!koopaHidden.isMoving) {
          // Estaba quieto, lo impulsa hacia la dirección opuesta a Mario
          const direccion = marioTocaDesdeIzquierda ? 140 : -140;
          koopaHidden.setVelocityX(direccion);
          koopaHidden.isMoving = true;
          this.sound.play("goomba-sound", { volume: 3.2 });
        } else {
          // y si se mueve y me toca
          const seMueveHaciaMario =
            (koopaHidden.body.velocity.x > 0 && mario.x > koopaHidden.x) ||
            (koopaHidden.body.velocity.x < 0 && mario.x < koopaHidden.x);

          if (seMueveHaciaMario) {
            matarMario.call(this, mario);
          }
        }
      }
    });

    // Rebotar al tocar los tubos
    this.physics.add.collider(koopaHidden, this.pipe, (koopaHidden, pipe) => {
      if (koopaHidden.body.blocked.right) {
        koopaHidden.setVelocityX(-140);
        koopaHidden.flipX = false;
      }
      if (koopaHidden.body.blocked.left) {
        koopaHidden.setVelocityX(140);
        koopaHidden.flipX = true;
      }
    });
  } else {
    // Mario no cayó encima -> muere
    koopa.setVelocityX(0);
    matarMario.call(this, mario);
  }
}
