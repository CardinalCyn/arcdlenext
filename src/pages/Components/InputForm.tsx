import { useState,useEffect } from 'react'
import { SpellType } from '@/types/SpellType';
type inputFormProps= {
    submitGuess:Function;
    spells:SpellType[];
}
const InputForm=({submitGuess, spells}:inputFormProps)=>{
    //text field usestate
    const [guessField,setGuessField]=useState("");
    //spells filtered by text in input field, displayed in div below input field
    const [filteredSpells,setFilteredSpells]=useState<SpellType[]>([]);
    //spells that haven't already been submitted
    const [uncheckedSpells,setUncheckedSpells]=useState<SpellType[]>(spells);

    //submit button is clicked, it'll send the first spell that's filtered
    const handleFormSubmission=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(filteredSpells.length&&filteredSpells[0]["name"]===guessField){
            submitSpell(filteredSpells[0]);
        }
    }
    //submits spell to app component, to be check if correct or not
    const submitSpell=(spell:SpellType)=>{
        submitGuess(spell);
        setUncheckedSpells(prevSpells => prevSpells.filter(prevSpell => prevSpell.name !== spell.name));
        setGuessField("");
    }
    //when u type, div appears below, showing all possible spells that you can use
    const filterRooms=()=>{
        if(guessField){
            setFilteredSpells(uncheckedSpells.filter(spell=>{
                return spell["name"].toLowerCase().includes(guessField.toLowerCase());
            }))
        }else{
            setFilteredSpells([]);
        }
    }
    useEffect(()=>{
        filterRooms();
    },[guessField])

    return (
        <div className="w-screen mt-10">
            <form onSubmit={handleFormSubmission} className='text-center flex mx-auto'>
                <input type="text" id="guessInputField" className="bg-gray-200 w-full text-black" autoComplete='off' value={guessField} onChange={e => setGuessField(e.target.value)} />
                <button type="submit" id="formSubmitButton"className=" text-black">Submit</button>
            </form>
            <div id="predictiveText" className="bg-purple-300 overflow-y-scroll w-1/4 text-black" style={{ zIndex: 1 }}>
            {filteredSpells.map(spell=>{
                return (
                <div className="flex hover:bg-blue-200" onClick={() => submitSpell(spell)} key={spell["name"]}>
                    <img style={{ height: "40px", width: "40px" }} src={spell["img"]} alt={`${spell["name"]} image`} />
                    <div>
                        {spell["name"]}
                    </div>
                </div>
                );
            })}
            </div>
        </div>
    )
}

export default InputForm