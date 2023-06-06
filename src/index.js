import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Title from "./scenes/Title"
import Result from './scenes/Result';
import CountDown from './scenes/CountDown';
import Stage from "./scenes/Stage"
  
  // ========================================

  window.isKeyDown = {}
window.addEventListener('keydown', (e) => {
  window.isKeyDown[`key_${e.key}`] = true
})
window.addEventListener('keyup', (e) => {
  window.isKeyDown[`key_${e.key}`] = false
})

const Scene = () => {
  const [scene, setScene] = useState("title")
  const [score, setScore] = useState(0)
  return (
    <div className='container'>
      <div className='box'>
        {scene === "title" && <Title onClickStart={() => setScene("countDown")} />}
        {scene === "countDown" && <CountDown onCountOvered={() => setScene("stage")} />}
        {scene === "stage" && <Stage onGameOvered={() => setScene("result")} setScore={(finalScore)=>setScore(finalScore)} />}
        {scene === "result" && <Result onClickChangeScene={() => setScene("title")} score={score} />}
      </div>
    </div>
  )
  }
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Scene />);