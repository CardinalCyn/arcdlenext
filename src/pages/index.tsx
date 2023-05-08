import InputForm from "./Components/InputForm"
import Attempts from "./Components/Attempts"

import { default as Spells } from './spells/spells.json'
import { useState,useEffect } from "react"
import { SpellType } from "@/types/SpellType"

const Home=()=>{
  //checks if the user has guessed the spell correctly or not, and displays the amt of tries if true
  const [guessedCorrectly,setGuessedCorrectly]=useState(false);
  //correct spell to guess, randomly generated based on day
  const [correctSpell,setCorrectSpell]=useState<SpellType>(Spells[0]);
  
//seeds based on day, generates a random number based on the day, multiplies by spells.length to get the value of the index
  const generateRandomSpell=(date:Date)=>{
    const seed = Math.floor((date.setHours(0, 0, 0, 0) - new Date(date.getFullYear(), 0, 0).setHours(0, 0, 0, 0)) / 86400000);
    const randomIndex= Math.floor(Math.abs(Math.sin(seed)) * Spells.length);
    return Spells[randomIndex];
  }
  //on app start, generates random spell based on day
  useEffect(() => {
    const today= new Date();
    const randomSpell=generateRandomSpell(today);
    setCorrectSpell(randomSpell);
  }, []);
//array of spells that the user has guessed in the input form
  const [submissions,setSubmissions]=useState<SpellType[]>([]);

  const submitGuess=(guessValue:SpellType)=>{
    setSubmissions([guessValue,...submissions]);
    console.log(correctSpell);
    let guessedCorrect=true;
    for(const key in guessValue){
      if(guessValue[key as keyof SpellType]!==correctSpell[key as keyof SpellType]){
        guessedCorrect=false;
      }
    }
    setGuessedCorrectly(guessedCorrect);
  }

  return (
    <main className="">
      <h1 className='text-center text-9xl my-20'>Arcdle</h1>
      <h2 className='text-center text-6xl'>Guess a spell!</h2>
      {!guessedCorrectly&&<InputForm submitGuess={submitGuess} spells={Spells} />}
      {guessedCorrectly&&<div className='text-center'>You solved it in {submissions.length} {submissions.length === 1 ? 'try' : 'tries'}!</div>}
      {submissions.length>0&&<Attempts submissions={submissions} correctSpell={correctSpell}/>}
    </main>
  )
}

export default Home
