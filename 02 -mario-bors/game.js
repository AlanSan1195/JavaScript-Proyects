//  hasta est epunto aprendimos a configurar nuestro juego
import { animations } from "./animations.js";
const config = {
  type: Phaser.AUTO,
  height: 310,
  width: 380,
  backgroundColor: "#049cd8",
  parent: "game",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 310 },
      debug: false,
    },
  },
  scene: {
    preload, // cargaremos todos los recuros que necesitaremos
    create, // usamos todos los recursos que necesitemos apra
    update,
  },
};
function preload() {
  //1.
  // id y direccion 2 parametros en image
  this.load.image("cloud1", "assets/scenery/overworld/cloud1.png");
  this.load.image("floorbricks", "assets/scenery/overworld/floorbricks.png");
  this.load.spritesheet("mario", "assets/entities/mario.png", {
    frameWidth: 18,
    frameHeight: 16,
  });
  this.load.audio("game-over", "assets/sound/music/gameOver.mp3");
  this.load.image("pipe-1", "assets/scenery/pipe2.png");
}
function create() {
  //2.
  //1.1
  // la imagen se agrega en eje x, y id
  this.add.image(100, 50, "cloud1").setOrigin(0.5, 0.5).setScale(0.15);
  //1.2
  // lo que sigue es agregar a mario y el piso, despues de las fisicas indicamos que mario recibes estas physicas

  //tenemos varios pisos todos los guaradamos en un grupo
  this.floor = this.physics.add.staticGroup();

  this.floor // suelo 1
    .create(0, config.height - 16, "floorbricks")
    .setOrigin(0, 0.5)
    .refreshBody();

  this.floor // suelo 2
    .create(153, config.height - 16, "floorbricks")
    .setOrigin(0, 0.5)
    .refreshBody();
  this.pipe = this.physics.add.staticGroup();

  this.pipe.create(200, 262, "pipe-1").setOrigin(0, 0.5).refreshBody(); // pipe 1
  this.pipe.create(250, 262, "pipe-1").setOrigin(0, 0.5).refreshBody(); // pipe 2

  this.mario = this.physics.add
    .sprite(50, 100, "mario")
    .setCollideWorldBounds(true) //metodo para hacer que mario collisione con los border del mundo, se activa y se desactiva si cae por ejemplo
    .setOrigin(0, 1)
    .setGravityY(300); // la gravedad de mario
  //1.3
  // el piso se agrega como textura tilesprite
  // this.add
  //   .tileSprite(0, config.height, config.width, 32, "floorbricks") ------------>
  //   .setOrigin(0, 1);

  // 1.6 creamos la colicion del piso
  this.physics.add.collider(this.mario, this.floor);
  this.physics.add.collider(this.mario, this.pipe);
  this.colliderPipe = this.physics.add.collider(this.mario, this.pipe);
  // agregaremos la camara con el metodo setBounds ()
  this.physics.world.setBounds(0, 0, 2000, config.height);

  //agregamos una camara que le decimos donde empieza y hasata donde debe terminar
  this.cameras.main.setBounds(0, 0, 2000, config.height);
  //otra camara que nos siga
  this.cameras.main.startFollow(this.mario);

  animations(this);

  // 1.5
  // crear los movimentos de mario en este caso LOS PASOS esto ses solo cargar la animacion, se tiene que usar en el movimeinto de la tecla mas abajo
  this.keys = this.input.keyboard.createCursorKeys();
}

function update() {
  //3.
  // hagamos que mario camine
  // primero las teclas
  if (this.keys.left.isDown) {
    this.mario.x -= 2;
    this.mario.flipX = true;
    // la animacion que usara al caminar
    this.mario.anims.play("mario-walk", true);
  } else if (this.keys.right.isDown) {
    this.mario.x += 2;
    this.mario.anims.play("mario-walk", true);
    this.mario.flipX = false;
    //agregamos animacion para cuando mario no haga nada
  } else {
    this.mario.anims.play("mario-stop", true);
  }
  //brincamos y si mario esta tocando algo por debajo entonces teinee sentido impulsarme y saltar
  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-250); // esto es para que mario brinque con eje y y x
    this.mario.anims.play("mario-jump", true);
  }
  if (this.mario.y >= config.height) {
    this.mario.isDead = true;
    this.mario.anims.play("mario-dead", true);
    this.mario.setCollideWorldBounds(false);

    if (!this.gameOverSound) {
      this.sound.add("game-over", { volume: 0.2 }).play();
      this.gameOverSound = true; // se creo una variable que controla si el sonido ya ha sido repoducido
    }

    setTimeout(() => {
      this.mario.setVelocityY(-300);
      this.mario.setGravityY(800);
    }, 100);
    setTimeout(() => {
      this.scene.restart();
    }, 1000);
  }
}

new Phaser.Game(config);
