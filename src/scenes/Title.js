const Title = ({ onClickStart }) => {
    console.log(onClickStart)
    return (
      <div>
      <p className='intro_title'>
        タイトル未定
      </p>
      <button className='title_buton' onClick={onClickStart}>
          start
        </button>
        </div>
    )
}
  
export default Title