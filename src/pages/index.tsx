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
  
//array of spells that the user has guessed in the input form
  const [submissions,setSubmissions]=useState<SpellType[]>([]);

  const submitGuess=(guessValue:SpellType)=>{
    setSubmissions([guessValue,...submissions]);
    localStorage.setItem('submissions',JSON.stringify([guessValue,...submissions]));
    let guessedCorrect=true;
    for(const key in guessValue){
      if(guessValue[key as keyof SpellType]!==correctSpell[key as keyof SpellType]){
        guessedCorrect=false;
      }
    }
    if(guessedCorrect){
      setGuessedCorrectly(guessedCorrect);
      localStorage.setItem('guessedCorrectly',JSON.stringify(true));
    }
  }
  const [timeRemaining, setTimeRemaining] = useState("");
  useEffect(()=>{
    const intervalId = setInterval(() => {
      const now = new Date();
      const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const timeDiff = nextDay.getTime() - now.getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(intervalId);
  },[])
  //on app start, generates random spell based on day
  useEffect(() => {
    const today= new Date();
    const randomSpell=generateRandomSpell(today);
    setCorrectSpell(randomSpell);

    const storedDay = localStorage.getItem("storedDay");
    if (storedDay !== null) {
      const parsedStoredDay = new Date(storedDay);
      if (parsedStoredDay.getDate() !== today.getDate()) {
        localStorage.clear();
      }
    }

    const guessedCorrectlyStorage=localStorage.getItem("guessedCorrectly")||JSON.stringify(false);
    const parsedGuessedCorrectlyStorage=JSON.parse(guessedCorrectlyStorage)
    if(parsedGuessedCorrectlyStorage===true){
      setGuessedCorrectly(parsedGuessedCorrectlyStorage);
      const submissionsStorage=localStorage.getItem("submissions");
      if (submissionsStorage!== null) {
        const parsedSubmissionsStorage = JSON.parse(submissionsStorage);
        setSubmissions(parsedSubmissionsStorage);
      }
    }

    localStorage.setItem('storedDay',today.toDateString());
  }, []);
  //stores whether or not copy request was successful
  const [copyAttemptSuccess,setCopyAttemptSuccess]=useState(false);
  //shares a screenshot of your how many tries it took
  const shareImage = () => {
    const element = document.getElementById('triesContainer');
    if (element) {
      //makes rectangle of element
      const rect = element.getBoundingClientRect();
      const canvas = document.createElement('canvas');
      canvas.width = rect.width;
      canvas.height = rect.height;
      //makes 2d rendering
      const context = canvas.getContext('2d');
      if (context) {
        //gets image from body,
        const backgroundImage = new Image();
        backgroundImage.onload = () => {
          context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
          context.font = window.getComputedStyle(element).font;
          context.fillStyle = window.getComputedStyle(element).color;
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(element.innerText, canvas.width/2, canvas.height/2);
    
          canvas.toBlob(blob => {
            if (blob) {
              const item = new ClipboardItem({ [blob.type]: blob });
              navigator.clipboard.write([item]).then(() => {
                setCopyAttemptSuccess(true);
                setTimeout(()=>{
                  setCopyAttemptSuccess(false);
                },3000)
              });
            }
          }, 'image/png');
        };
        backgroundImage.src = window.getComputedStyle(document.body).backgroundImage.slice(5, -2);
      }
    }
  };

  return (
    <main>
      <h1 className='text-center text-9xl my-20'>Arcdle</h1>
      <h2 className='text-center text-6xl'>Guess a spell!</h2>
      {!guessedCorrectly&&<InputForm submitGuess={submitGuess} spells={Spells} />}
      {guessedCorrectly&&
      <div id="successfulSubmissionContainer">
        <div className='text-center' id="triesContainer">
          You solved it in {submissions.length} {submissions.length === 1 ? 'try' : 'tries'}!
        </div>
        <div className="text-center">
          <p>Time remaining until next day: {timeRemaining}</p>
        </div>
        <button className="block mx-auto share p-1 rounded-md mt-2 text-black" onClick={()=>shareImage()}>Share</button>
        {copyAttemptSuccess&&
        <div className="text-center">Copied to clipboard</div>}
      </div>}
      {submissions.length>0&&<Attempts submissions={submissions} correctSpell={correctSpell}/>}
      
    </main>
  )
}

export default Home
