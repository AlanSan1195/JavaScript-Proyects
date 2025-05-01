import { anchoVentana } from "./game.js";
var score = 0;

export function consumeCoin(mario, coin) {
  this.sound.play("coin-sound", { volume: 0.2 });
  const scoreText = this.add.text(coin.x, coin.y, "100", {
    fontFamily: "pixel",
    fontSize: anchoVentana / 90,
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

// Asegúrate de exportar la función sumaScore
export function sumaScore() {
  // vamos a agarrar el div con el id score y le ponemos de froma dinamica el score
  const scoreElement = document.getElementById("score");
  scoreElement.innerText = score;
}
