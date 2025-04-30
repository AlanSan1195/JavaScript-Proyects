
import { anchoVentana } from "./game.js";

export function createEnemigos(scene, anchoVentana) {
    const VELOCIDAD_INICIAL = 50;
  
    // Crear goombas
    scene.goombas = scene.physics.add.group({
      key: "goomba",
      repeat: 6, // número de goombas adicionales
      setXY: { x: anchoVentana / 3, y: 200, stepX: 190 },
    });
  
    // crear koopas
    scene.koopas = scene.physics.add.group({
      key: "koopa",
      repeat: 2, // número de koopas adicionales
      setXY: { x: anchoVentana / 3, y: 200, stepX: 300 },
    });
  
    // movimiento de los kopas y gombas
      scene.goombas.children.iterate(function (goomba) {
      goomba.setOrigin(0);
      goomba.setGravityY(300);
      goomba.anims.play("goomba-walk");
  
      let direction = Phaser.Math.Between(0, 10);
      goomba.setVelocityX(direction > 5 ? -VELOCIDAD_INICIAL : VELOCIDAD_INICIAL);
    });
  
    scene.koopas.children.iterate(function (koopa) {
      koopa.setOrigin(0, 1);
      // koopa.setGravityY(300);
      koopa.anims.play("koopa-walk");
      let directionKoopas = Phaser.Math.Between(0, 10);
      koopa.setVelocityX(
        directionKoopas > 5 ? -VELOCIDAD_INICIAL : VELOCIDAD_INICIAL
      );
    });
  
    //colicionas goombas y koopas
  
    scene.physics.add.collider(scene.goombas, scene.tile1);
    scene.physics.add.collider(scene.goombas, scene.tile2);
    scene.physics.add.collider(scene.goombas, scene.pipe, (goombas, pipe) => {
      scene.goombas = goombas;
      if (goombas.body.blocked.down && goombas.body.blocked.right) {
        goombas.setVelocityX(-VELOCIDAD_INICIAL);
        goombas.flipX = false;
      } else if (goombas.body.blocked.down && goombas.body.blocked.left) {
        goombas.setVelocityX(VELOCIDAD_INICIAL);
        goombas.flipX = true;
      }
    });
    scene.physics.add.collider(scene.goombas, scene.koopas, (goomba, koopa) => {
      const VELOCIDAD_INICIAL = 50;
  
      if (goomba.body.touching.right && koopa.body.touching.left) {
        goomba.setVelocityX(-VELOCIDAD_INICIAL);
        goomba.flipX = false;
        koopa.setVelocityX(VELOCIDAD_INICIAL);
        koopa.flipX = true;
      } else if (goomba.body.touching.left && koopa.body.touching.right) {
        goomba.setVelocityX(VELOCIDAD_INICIAL);
        goomba.flipX = true;
        koopa.setVelocityX(-VELOCIDAD_INICIAL);
        koopa.flipX = false;
      }
    });
  
    scene.physics.add.collider(scene.koopas, scene.tile1);
    scene.physics.add.collider(scene.koopas, scene.tile2);
    scene.physics.add.collider(scene.koopas, scene.pipe, (koopas, pipe) => {
      scene.koopas = koopas;
      if (koopas.body.blocked.down && koopas.body.blocked.right) {
        koopas.setVelocityX(-VELOCIDAD_INICIAL);
        koopas.flipX = false;
      } else if (koopas.body.blocked.down && koopas.body.blocked.left) {
        koopas.setVelocityX(VELOCIDAD_INICIAL);
        koopas.flipX = true;
      }
    });
      scene.physics.add.collider(scene.koopas, scene.goombas, (koopas, goombas) => {
      scene.koopas = koopas;
      scene.goombas = goombas;
      if (koopas.body.blocked.down && koopas.body.blocked.right) {
        koopas.setVelocityX(-VELOCIDAD_INICIAL);
        koopas.flipX = false;
      } else if (koopas.body.blocked.left && koopas.body.blocked.down) {
        koopas.setVelocityX(VELOCIDAD_INICIAL);
        koopas.flipX = true;
      }
    });
  }