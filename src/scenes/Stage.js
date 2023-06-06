import {useState, useEffect} from "react"
const Enemy = (x, y) => {
    return <div className='enemy' style={{ top: y, left: x }} />
}
  
const Bullet = (x, y) => {
    return <div className='bullet' style={{ top: y, left: x }} />
}

const Stage = ({ onGameOvered, setScore }) => {
    const [objects, setObjects] = useState({
        player: { x: 0, y: 240, life: 3 },
        bullets: [],
      enemies: [],
      score: 0
    })
    useEffect(() => {
      const { isKeyDown } = window
      let req;
      let startTime = Date.now()
        let score = 0;
        let playerSpeed = 2
        let coolTime = 200
        let coolTimeStart = 0
        let invisibleTime = 1000
      let invisibleStart = 0
      let isGameOver = false
      function step() {
          let randomNum = Math.random();
        if (randomNum > 0.99) {
          setObjects((currentObjects) => {
            let newObjects = Object.assign({}, currentObjects);
            newObjects.enemies.push({x: 480, y: Math.floor(Math.random() * 480) , life:3})
            return newObjects
          })
        }
  
        setObjects((currentObjects) => {
          let newObjects = Object.assign({}, currentObjects);
          let newEnemies = newObjects.enemies.map((enemy) => {
            let x = enemy.x - 2
            if (x <= 0) {
              return null
            } else {
              return {x: x, y:enemy.y , life:enemy.life}
            }
          })
            newEnemies = newEnemies.filter(e => e)
            
          let newBullets = newObjects.bullets.map((bullet) => {
            let x = bullet.x + 4
            if (x >= 480) {
              return null
            } else {
              return {x: x, y:bullet.y }
            }
          })
          newBullets = newBullets.filter(e => e)
  
          newEnemies = newEnemies.map((enemy) => {
            let enemyX = enemy.x + 10;
            let enemyY = enemy.y + 10;
            let playerX = newObjects.player.x + 10;
            let playerY = newObjects.player.y + 10;
            for (var i = 0; i < newBullets.length; ++i){
              let bulletX = newBullets[i].x + 2;
              let bulletY = newBullets[i].y + 2;
              if (((enemyX - bulletX) * (enemyX - bulletX) + (enemyY - bulletY) * (enemyY - bulletY)) < 144) {
                newBullets[i] = null
                newBullets = newBullets.filter(e => e)
                if (enemy.life === 1) {  
                  score += 1
                  newObjects.score += 1
                  return null
                } else {
                  return {x:enemy.x,y:enemy.y,life:enemy.life-1}
                }
              }
            }

            if (((enemyX - playerX) * (enemyX - playerX) + (enemyY - playerY) * (enemyY - playerY)) < 400 && (Date.now()-invisibleStart) > invisibleTime) {
              invisibleStart = Date.now()
              newObjects.player.life -= 1
              if (newObjects.player.life == 0) {
                isGameOver = true
              }
              return null;
            } else {
              return { x:enemy.x, y:enemy.y ,life:enemy.life};
            }
          })
  
          newEnemies = newEnemies.filter(e => e)
          newObjects.enemies = newEnemies;
          newObjects.bullets = newBullets;
  
          return newObjects
        })
  
        if (isKeyDown.key_Up || isKeyDown.key_ArrowUp || isKeyDown.key_w) {
          setObjects((currentObjects) => {
            let newObjects = Object.assign({}, currentObjects);
            newObjects.player.y -= playerSpeed
            return newObjects;
          })
        }
  
        if (isKeyDown.key_Right || isKeyDown.key_ArrowRight || isKeyDown.key_d) {
          setObjects((currentObjects) => {
            let newObjects = Object.assign({}, currentObjects);
            newObjects.player.x += playerSpeed
            return newObjects;
          })
        }
  
        if (isKeyDown.key_Down || isKeyDown.key_ArrowDown || isKeyDown.key_s) {
          setObjects((currentObjects) => {
            let newObjects = Object.assign({}, currentObjects);
            newObjects.player.y += playerSpeed
            return newObjects;
          })
        }
  
        if (isKeyDown.key_Left || isKeyDown.key_ArrowLeft || isKeyDown.key_a) {
          setObjects((currentObjects) => {
            let newObjects = Object.assign({}, currentObjects);
            newObjects.player.x -= playerSpeed
            return newObjects;
          })
        }
          
          if (isKeyDown.key_x && ((Date.now() - coolTimeStart) > coolTime)) {
              coolTimeStart = Date.now()
            setObjects((currentObjects) => {
                let newObjects = Object.assign({}, currentObjects);
                let playerX = newObjects.player.x
                let playerY = newObjects.player.y
                newObjects.bullets.push({x:playerX+20,y:playerY+10})
                return newObjects;
              })
          }
        if ((Date.now() - startTime) > 60000 || isGameOver) {
          setScore(score)
          onGameOvered()
        } else {
          req = requestAnimationFrame(step) 
        }
      }
      req = requestAnimationFrame(step)
      return () => {
        cancelAnimationFrame(req)
      }
    }, [])
    return (
      <div className='stage'>
        <div className='player' style={{ top: objects.player.y, left: objects.player.x }} />
        {objects.enemies.map((enemy) => 
          Enemy(enemy.x,enemy.y)
        )}
        {objects.bullets.map((bullet) => 
          Bullet(bullet.x,bullet.y)
        )}
        <div className='scoreboard'>Score: {objects.score} Life: {objects.player.life}</div>
      </div>
    )
}
  
export default Stage