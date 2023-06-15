import { useState, useEffect } from "react";

const Pie = (angle, count) => {
  var angleModified = angle % 360;
  return (
    <div className="countBoard">
      <div
        className="pie"
        style={{
          backgroundImage: `conic-gradient(black ${angleModified}deg, white ${angleModified}deg)`,
        }}
      ></div>
      <div
        className="small-pie"
        style={{ backgroundImage: `conic-gradient(white 0deg, white 180deg)` }}
      ></div>
      <div className="count-number">{count}</div>
    </div>
  );
};

const CountDown = ({ onCountOvered }) => {
  //countは繰り返し関数が何回実行されたか
  //displayは画面に表示される数字
  const [count, setCount] = useState(0);
  const [display, setDisplay] = useState(3);
  useEffect(() => {
    var localCount = 0;
    function step() {
      setCount((currentCount) => currentCount + 1);
      localCount += 1;
      if (localCount < 300) {
        setTimeout(step, 10);
      }
    }
    setTimeout(step, 10);
  }, []);
  useEffect(() => {
    //1000,2000msで表示される数字を変更
    if (count === 99 || count === 199) {
      setDisplay((currentDisplay) => currentDisplay - 1);
    }
  }, [count]);
  useEffect(() => {
    //3000msでカウントダウンを終了
    if (count === 299) {
      onCountOvered();
    }
  }, [count]);
  return <div className="count-board">{Pie((count + 1) * 3.6, display)}</div>;
};

export default CountDown;
