import { RefObject, useEffect, useRef, useState } from 'react'
import './App.css'
import 'animate.css'

function App() {
  const [steps, setSteps] = useState<string[]>([])
  const [currentSteps, setCurrentSteps] = useState<string[]>([])
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)

  const red = useRef<HTMLButtonElement>(null)
  const green = useRef<HTMLButtonElement>(null)
  const blue = useRef<HTMLButtonElement>(null)
  const yellow = useRef<HTMLButtonElement>(null)

  const handleClick = (ref: RefObject<HTMLButtonElement>) => {
    if (!ref.current) return

    ref.current.classList.toggle('animate__pulse');
    new Audio(`./sounds/${ref.current.id}.mp3`).play()

    if (ref.current.id !== steps[currentSteps.length]) {
      setGameOver(true)
      setGameStarted(false)
      addRandomStep(true)
      setCurrentSteps([])
      return
    }
    setCurrentSteps([...currentSteps, ref.current.id])

    if (currentSteps.length === steps.length - 1) {

      if (localStorage.getItem('highscore') ?? '0' < steps.length.toString()) {
        localStorage.setItem('highscore', steps.length.toString())
      }

      setTimeout(() => {
        addRandomStep(false)
        setCurrentSteps([])
      }, 1000)
    }

    setTimeout(() => {
      ref.current?.classList.toggle('animate__pulse')
    }, 800)

  }

  const addRandomStep = (gameOver: boolean) => {
    const stepValues = ['red', 'green', 'blue', 'yellow']
    const randomStep = stepValues[Math.floor(Math.random() * stepValues.length)]
    const newSteps = gameOver ? [randomStep] : [...steps, randomStep]
    setSteps(newSteps)

    if (newSteps.length > 0) {
      setDisabled(true)
      newSteps.forEach((step, index) => {
        setTimeout(() => {
          const ref = eval(step) as RefObject<HTMLButtonElement>;
          if (ref.current) {
            ref.current.classList.toggle('animate__pulse');
            new Audio(`./sounds/${ref.current.id}.mp3`).play();
            setTimeout(() => {
              if (ref.current) {
                ref.current.classList.toggle('animate__pulse');
              }
            }, 800);
          }
        }, index * 1000);

      });
      setTimeout(() => {
        setDisabled(false)
      }, newSteps.length * 1000)

    }
  }

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    if (steps.length > 0) {

      const ref = eval(steps[0]) as RefObject<HTMLButtonElement>;
      if (ref.current) {
        ref.current.classList.toggle('animate__pulse');
        new Audio(`./sounds/${ref.current.id}.mp3`).play()
        setTimeout(() => {
          if (ref.current) {
            ref.current.classList.toggle('animate__pulse');
          }
        }, 800);
      }
    }
  }

  useEffect(() => {
    addRandomStep(false);

  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center ">
      <h1 className="text-4xl font-bold">Simon Game</h1>
      <small className="text-gray-500 mb-5">by Deniz Erdem</small>
      <div className="grid grid-cols-2 gap-4">
        <button disabled={!gameStarted || disabled} className="bg-red-500 h-32 w-32 rounded-lg disabled:opacity-60 animate__animated" id="red" onClick={() => handleClick(red)} ref={red}></button>
        <button disabled={!gameStarted || disabled} className="bg-green-500 h-32 w-32 rounded-lg disabled:opacity-60 animate__animated" id="green" onClick={() => handleClick(green)} ref={green}></button>
        <button disabled={!gameStarted || disabled} className="bg-blue-500 h-32 w-32 rounded-lg disabled:opacity-60 animate__animated" id="blue" onClick={() => handleClick(blue)} ref={blue}></button>
        <button disabled={!gameStarted || disabled} className="bg-yellow-500 h-32 w-32 rounded-lg disabled:opacity-60 animate__animated" id="yellow" onClick={() => handleClick(yellow)} ref={yellow}></button>
      </div>
      {
        gameOver && <p className="text-xl font-bold text-red-700 mt-4">Game Over</p>
      }
      <button disabled={gameStarted} className='bg-blue-500 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-2 px-4 rounded mt-4' onClick={startGame}>Start</button>
      <div className="flex flex-row">
        <p className="font-bold text-gray-700 mt-4 mr-4">Highscore: {localStorage.getItem('highscore') ?? '0'}</p>
        <p className="font-bold text-gray-700 mt-4">Current round: {steps.length}</p>
      </div>
    </div>

  )
}

export default App
