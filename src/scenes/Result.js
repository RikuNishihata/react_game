const Result = ({ onClickChangeScene, score }) => {
  return (
    <div>
      <p className="count">score:{score}</p>
      <button className="result_buton" onClick={onClickChangeScene}>
        タイトルに戻る
      </button>
    </div>
  );
};

export default Result;
