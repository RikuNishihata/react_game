import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Title from "./scenes/Title";
import HowToPlay from "./scenes/HowToPlay";
import Result from "./scenes/Result";
import CountDown from "./scenes/CountDown";
import Stage from "./scenes/Stage";
import { setTokenSourceMapRange } from "typescript";

const Scene = () => {
  const [scene, setScene] = useState("title");
  const [score, setScore] = useState(0);
  return (
    <div className="scene">
      {scene === "title" && (
        <Title
          onClickStart={() => setScene("countDown")}
          jumpToHowToPlay={() => setScene("howToPlay")}
        />
      )}
      {scene === "howToPlay" && (
        <HowToPlay backScene={() => setScene("title")} />
      )}
      {scene === "countDown" && (
        <CountDown onCountOvered={() => setScene("stage")} />
      )}
      {scene === "stage" && (
        <Stage
          onGameOvered={() => setScene("result")}
          setScore={(finalScore) => setScore(finalScore)}
        />
      )}
      {scene === "result" && (
        <Result onClickChangeScene={() => setScene("title")} score={score} />
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Scene />);
