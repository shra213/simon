import { useState, useRef, useEffect } from 'react';
import './App.css'
import axios from "axios";
function App() {
  const red = useRef(null);
  const game = useRef(null);
  const blue = useRef(null);
  const yellow = useRef(null);
  const green = useRef(null);
  const [max, setmax] = useState(localStorage.getItem("best"));
  const [level, setlevel] = useState(0);
  const [succ, setSucc] = useState(false);
  const [generated, setgenerated] = useState([]);
  const [inpArr, setinpArr] = useState([]);
  const [gameOver, setgameOver] = useState(false);
  const [pressed, setpressed] = useState({
    red: false,
    blue: false,
    yellow: false,
    green: false,
  });
  const soundMap = {
    red,
    blue,
    green,
    yellow
  }

  const generate = () => {
    setSucc(false);
    const colors = ["red", "blue", "yellow", "green"];
    let random = Math.floor(Math.random() * 4);
    let randomColor = colors[random];
    setgenerated(generated => [...generated, randomColor]);
    const audioref = soundMap[randomColor]
    setpressed({ ...pressed, [randomColor]: true });
    if (audioref.current) {
      audioref.current.play();
    }
    setTimeout(() => {

      setpressed({ ...pressed, [randomColor]: false });
    }, 150);
  }


  useEffect(() => {
    if (succ) {
      generate();
    }
  }, [succ]);

  useEffect(() => {
    const checkSuccess = async () => {
      console.log(inpArr.length);
      console.log("await");
      console.log(level);
      console.log(generated, inpArr);
      try {
        const res = await axios.post("http://localhost:5000/check", {
          generated,
          inpArr
        })
        console.log(res.data);
        console.log("success");
        if (res.data.success) {
          setTimeout(() => {
            setSucc(true);
          }, 1000);
          setmax((max) => {
            const newmax = max > level ? max : level;
            localStorage.setItem("best", newmax);
            return newmax;
          });
          setlevel(level => level + 1);
          setinpArr([]);
        }
      } catch (error) {
        console.log("try again /Restart");
        setgenerated([]);
        setinpArr([]);
        game.current.play();
        setlevel(0);
        setgameOver(true);
      }

    }
    console.log(generated, inpArr);
    if (inpArr.length > 0 && inpArr.length === generated.length) {
      checkSuccess();
    }
  }, [inpArr, generated]);

  const handleClick = (e) => {
    e.preventDefault();
    setinpArr([...inpArr, e.target.id]);
    const audioref = soundMap[e.target.id];
    audioref.current.play();
  }

  return (
    <>
      <div className={`bg-gray-800 bg-gradient-to-br from-gray-800 via-slate-700 to-gray-700 flex flex-col items-center justify-center min-h-screen text-white px-4`}>
        <audio ref={game} src='wrong.mp3' />
        <h1 className={` absolute top-18 font-bold text-4xl sm:text-6xl text-center creepster-regular`}>
          Simon Game 🎉🎉
        </h1>
        {/* Game Over Message */}
        {gameOver && (
          <div className="mb-15 md:text-5xl text-3xl sm:text-5xl text-red-500 font-bold mb-6 animate-bounce drop-shadow-lg">
            💥 Game Over 💥
          </div>
        )}

        {/* Score & Level Display */}
        <div className="flex items-center justify-center gap-8 mb-15 text-2xl sm:text-3xl font-bold">
          <div className="bg-gradient-to-l from-yellow-400 to-red-500 text-black px-6 py-3 rounded-xl shadow-lg shadow-yellow-500/50 border-2 border-yellow-300">
            🏆 Best: <span className="text-white ml-2">{max}</span>
          </div>
          <div className="bg-gradient-to-r from-blue-400 to-green-500 text-black px-6 py-3 rounded-xl shadow-lg shadow-green-500/50 border-2 border-green-300">
            ⚡ Level: <span className="text-white ml-2">{level}</span>
          </div>
        </div>

        <div className={`${!gameOver ? 'grid grid-cols-2 gap-5 mb-8' : 'hidden'}`}>
          <button
            id='red'
            onClick={handleClick}
            className={`${pressed.red ? 'scale-95 bg-red-300 shadow-white' : 'bg-red-500'} text-lg text-shadow-2xs text-shadow-black font-semibold active:scale-95 active:bg-red-400 transition transform duration-150 flex items-center justify-center h-24 w-24 rounded-[2vw] shadow-md shadow-black hover:shadow-md hover:shadow-red-400`}>
            Red
            <audio ref={red} src='red.mp3' />
          </button>
          <button
            id='blue'
            onClick={handleClick}
            className={`${pressed.blue ? 'scale-95 bg-blue-300 shadow-white' : 'bg-blue-500'} text-lg text-shadow-2xs text-shadow-black active:scale-95 active:bg-blue-400 transition transform duration-150 flex items-center justify-center h-24 w-24 rounded-[2vw] shadow-md shadow-black hover:shadow-md hover:shadow-blue-400`}>
            Blue
            <audio ref={blue} src='blue.mp3' />
          </button>
          <button
            id='yellow'
            onClick={handleClick}
            className={`${pressed.yellow ? 'scale-95 bg-yellow-100 shadow-white' : 'bg-yellow-300'} text-lg text-shadow-2xs text-shadow-black active:scale-95 active:bg-yellow-200 transition transform duration-150 flex items-center justify-center h-24 w-24 rounded-[2vw] shadow-md shadow-black hover:shadow-md hover:shadow-yellow-400`}>
            Yellow
            <audio ref={yellow} src='yellow.mp3' />
          </button>
          <button
            id='green'
            onClick={handleClick}
            className={`${pressed.green ? 'scale-95 bg-green-300 shadow-white' : 'bg-green-500'} text-lg text-shadow-2xs text-shadow-black active:scale-95 active:bg-green-400 transition transform duration-150 flex items-center justify-center h-24 w-24 rounded-[2vw] shadow-md shadow-black hover:shadow-md hover:shadow-green-400`}>
            Green
            <audio ref={green} src='green.mp3' />
          </button>
        </div>

        <button onClick={() => {
          setlevel(0);
          setgenerated([]);
          setinpArr([]);
          setgameOver(false);
          generate();
        }} className="active:scale-95 transition transform duration-150 bg-purple-600 px-8 py-2 text-lg font-semibold rounded-lg hover:bg-purple-700 mt-3">
          {generated.length > 0 ? "Restart" : "Start"}
        </button>
      </div>
    </>
  )
}

export default App
