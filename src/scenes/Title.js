const Title = ({ onClickStart, jumpToHowToPlay }) => {
  return (
    <div>
      <p className="intro_title">タイトル未定</p>
      <button className="title-buton" onClick={onClickStart}>
        start
      </button>
      <button className="how-to-play-buton" onClick={jumpToHowToPlay}>
        遊び方
      </button>
    </div>
  );
};

export default Title;
