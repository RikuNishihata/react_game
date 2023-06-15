const HowToPlay = ({ backScene }) => {
  return (
    <div className="how-to-play">
      <div className="rule">移動:矢印キー</div>
      <div className="rule">球を発射:x</div>
      <button onClick={backScene}>戻る</button>
    </div>
  );
};

export default HowToPlay;
