import { useState, useEffect } from "react";

//キー操作を受け付けるための変数
let rightIsPressed = false;
let leftIsPressed = false;
let upIsPressed = false;
let downIsPressed = false;
let xIsPressed = false;

//上のキーが押されている間は*IsPressedがtrueになる
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "Right") {
    rightIsPressed = true;
  }
  if (e.key === "ArrowLeft" || e.key === "Left") {
    leftIsPressed = true;
  }
  if (e.key === "ArrowUp" || e.key === "Up") {
    upIsPressed = true;
  }
  if (e.key === "ArrowDown" || e.key === "Down") {
    downIsPressed = true;
  }
  if (e.key === "x") {
    xIsPressed = true;
  }
});
window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight" || e.key === "Right") {
    rightIsPressed = false;
  }
  if (e.key === "ArrowLeft" || e.key === "Left") {
    leftIsPressed = false;
  }
  if (e.key === "ArrowUp" || e.key === "Up") {
    upIsPressed = false;
  }
  if (e.key === "ArrowDown" || e.key === "Down") {
    downIsPressed = false;
  }
  if (e.key === "x") {
    xIsPressed = false;
  }
});

//敵を描画するコンポーネント
const Enemy = (x, y) => {
  return <div className="enemy" style={{ top: y, left: x }} />;
};

//弾丸を描画するコンポーネント
const Bullet = (x, y) => {
  return <div className="bullet" style={{ top: y, left: x }} />;
};

const Stage = ({ onGameOvered, setScore }) => {
  //playerのx,yは座標、lifeは残機
  const [objects, setObjects] = useState({
    player: { x: 0, y: 240, life: 3 },
    bullets: [],
    enemies: [],
    score: 0,
  });
  useEffect(() => {
    let startTime = Date.now();
    let score = 0;
    let playerSpeed = 2;

    //coolTimeは弾丸の発射間隔(これがないとキーを押しっぱで大量の玉が出る)
    let coolTime = 200;
    let coolTimeStart = 0;
    //invisibleTimeはプレイヤーがダメージを受けた時の無敵時間
    let invisibleTime = 1000;
    let invisibleStart = 0;
    let isGameOver = false;
    function step() {
      let randomNum = Math.random();
      //1%で新たな敵が出現
      if (randomNum > 0.99) {
        setObjects((currentObjects) => {
          let newObjects = Object.assign({}, currentObjects);
          newObjects.enemies.push({
            x: 480,
            y: Math.floor(Math.random() * 480),
            life: 3,
          });
          return newObjects;
        });
      }

      setObjects((currentObjects) => {
        let newObjects = Object.assign({}, currentObjects);
        //画面外に消えたenemyは削除
        let newEnemies = newObjects.enemies.map((enemy) => {
          let x = enemy.x - 2;
          if (x <= 0) {
            return null;
          } else {
            return { x: x, y: enemy.y, life: enemy.life };
          }
        });
        newEnemies = newEnemies.filter((e) => e);
        //弾丸を移動させる
        let newBullets = newObjects.bullets.map((bullet) => {
          let x = bullet.x + 4;
          if (x >= 480) {
            return null;
          } else {
            return { x: x, y: bullet.y };
          }
        });
        newBullets = newBullets.filter((e) => e);
        //敵を移動させる
        newEnemies = newEnemies.map((enemy) => {
          let enemyX = enemy.x + 10;
          let enemyY = enemy.y + 10;
          let playerX = newObjects.player.x + 10;
          let playerY = newObjects.player.y + 10;
          for (var i = 0; i < newBullets.length; ++i) {
            //弾丸と敵の接触判定を行う
            let bulletX = newBullets[i].x + 2;
            let bulletY = newBullets[i].y + 2;
            if (
              (enemyX - bulletX) * (enemyX - bulletX) +
                (enemyY - bulletY) * (enemyY - bulletY) <
              144
            ) {
              newBullets[i] = null;
              newBullets = newBullets.filter((e) => e);
              //敵のライフが0になればスコアを追加し、そうでなければライフを1減らす
              if (enemy.life === 1) {
                score += 1;
                newObjects.score += 1;
                return null;
              } else {
                return { x: enemy.x, y: enemy.y, life: enemy.life - 1 };
              }
            }
          }

          //敵と自機の接触判定
          if (
            (enemyX - playerX) * (enemyX - playerX) +
              (enemyY - playerY) * (enemyY - playerY) <
              400 &&
            Date.now() - invisibleStart > invisibleTime
          ) {
            invisibleStart = Date.now();
            newObjects.player.life -= 1;
            if (newObjects.player.life == 0) {
              isGameOver = true;
            }
            return null;
          } else {
            return { x: enemy.x, y: enemy.y, life: enemy.life };
          }
        });

        newEnemies = newEnemies.filter((e) => e);
        newObjects.enemies = newEnemies;
        newObjects.bullets = newBullets;

        return newObjects;
      });

      //自機の移動
      if (upIsPressed) {
        setObjects((currentObjects) => {
          let newObjects = Object.assign({}, currentObjects);
          newObjects.player.y -= playerSpeed;
          return newObjects;
        });
      }

      if (rightIsPressed) {
        setObjects((currentObjects) => {
          let newObjects = Object.assign({}, currentObjects);
          newObjects.player.x += playerSpeed;
          return newObjects;
        });
      }

      if (downIsPressed) {
        setObjects((currentObjects) => {
          let newObjects = Object.assign({}, currentObjects);
          newObjects.player.y += playerSpeed;
          return newObjects;
        });
      }

      if (leftIsPressed) {
        setObjects((currentObjects) => {
          let newObjects = Object.assign({}, currentObjects);
          newObjects.player.x -= playerSpeed;
          return newObjects;
        });
      }

      //前回からcoolTime(ms)時間が空いたら弾丸を発射できる
      if (xIsPressed && Date.now() - coolTimeStart > coolTime) {
        coolTimeStart = Date.now();
        setObjects((currentObjects) => {
          let newObjects = Object.assign({}, currentObjects);
          let playerX = newObjects.player.x;
          let playerY = newObjects.player.y;
          newObjects.bullets.push({ x: playerX + 20, y: playerY + 10 });
          return newObjects;
        });
      }
      //60秒経過またはライフが0になった時点でゲームを終了する
      if (Date.now() - startTime > 60000 || isGameOver) {
        setScore(score);
        onGameOvered();
      } else {
        requestAnimationFrame(step);
      }
    }
    step();
  }, []);
  return (
    <div className="stage">
      <div
        className="player"
        style={{ top: objects.player.y, left: objects.player.x }}
      />
      {objects.enemies.map((enemy) => Enemy(enemy.x, enemy.y))}
      {objects.bullets.map((bullet) => Bullet(bullet.x, bullet.y))}
      <div className="scoreboard">
        Score: {objects.score} Life: {objects.player.life}
      </div>
    </div>
  );
};

export default Stage;
