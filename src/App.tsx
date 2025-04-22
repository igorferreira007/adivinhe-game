import styles from "./app.module.css"
import { useState, useEffect, useRef } from "react"
import { Button } from "./components/Button"
import { Header } from "./components/Header"
import { Input } from "./components/Input"
import { Letter } from "./components/Letter"
import { LettersUsed, LetterUsedProps } from "./components/LettersUsed"
import { Tip } from "./components/Tip"
import { WORDS } from "./utils/words"
import { Challenge } from "./utils/words"

function App() {
  const [score, setScore] = useState(0)
  const [letter, setLetter] = useState("")
  const [lettersUsed, setLettersUsed] = useState<LetterUsedProps[]>([])
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [shake, setShake] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const ATTEMPTS_MARGIN: number = 5

  function handleRestartGame() {
    const isConfirmed = window.confirm("Você tem certeza que deseja reiniciar?")

    if (isConfirmed) {
      startGame()
    }
  }

  function startGame() {
    const index = Math.floor(Math.random() * WORDS.length)
    const randomWord = WORDS[index]

    setChallenge(randomWord)
    setScore(0)
    setLetter("")
    setLettersUsed([])
  }

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault()

    if (!challenge) {
      return
    }

    if (!letter.trim()) {
      return alert("Digite uma letra")
    }

    const value = letter.toUpperCase()
    const exists = lettersUsed.find(
      (used) => used.value.toUpperCase() === value
    )

    if (exists) {
      setLetter("")
      return alert("Você já tentou essa letra: " + value)
    }

    const hits = challenge.word
      .toUpperCase()
      .split("")
      .filter((char) => char === value).length

    const correct = hits > 0
    const currentScore = score + hits

    setLettersUsed((prevState) => [...prevState, { value, correct }])
    setScore(currentScore)
    setLetter("")

    if (!correct) {
      setShake(true)
      setTimeout(() => setShake(false), 300)
    }

    inputRef.current?.focus()
  }

  function endGame(message: string) {
    alert(message)
    startGame()
  }

  useEffect(() => {
    startGame()
  }, [])

  useEffect(() => {
    if (!challenge) {
      return
    }

    setTimeout(() => {
      if (score === challenge.word.length) {
        return endGame("Parabéns, você descobriu a palavra")
      }

      const attemptLimit = challenge.word.length + ATTEMPTS_MARGIN

      if (lettersUsed.length === attemptLimit) {
        return endGame("Que pena, você usou todas as tentativas!")
      }
    }, 200)
  }, [score, lettersUsed.length])

  if (!challenge) {
    return
  }

  return (
    <div className={styles.container}>
      <main>
        <Header
          current={lettersUsed.length}
          max={challenge.word.length + ATTEMPTS_MARGIN}
          onRestart={handleRestartGame}
        />
        <Tip tip={challenge.tip} />

        <div className={`${styles.word} ${shake && styles.shake}`}>
          {challenge &&
            challenge.word.split("").map((letter, index) => {
              const letterUsed = lettersUsed.find(
                (used) => used.value.toUpperCase() === letter.toUpperCase()
              )

              return (
                <Letter
                  key={index}
                  value={letterUsed?.value}
                  color={letterUsed?.correct ? "correct" : "default"}
                />
              )
            })}
        </div>

        <h4>Palpite</h4>

        <form onSubmit={handleConfirm} className={styles.guess}>
          <Input
            ref={inputRef}
            autoFocus
            maxLength={1}
            placeholder="?"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
          />
          <Button type="submit" title="Confirmar" />
        </form>

        <LettersUsed data={lettersUsed} />
      </main>
    </div>
  )
}

export default App
