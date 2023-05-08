import { SpellType } from "@/types/SpellType";
import Image from "next/image";
type attemptProps= {
    submissions:SpellType[];
    correctSpell:SpellType;
}
const Attempts=({submissions,correctSpell}:attemptProps)=>{
    //headers for table
    const tableHeaders=["Spell","Name","Book","Targeting","Charges","Turn Ready","Cooldown","Tier","Damage"];
    //properties of spells, iterated through into table
    const tableElements=["img","name","bookType","targetingType","charges","initialTurnAvailable","cooldown","tier","damage"];
    return(
        <table className="mt-20 mx-auto table-fixed">
            <tbody className="">
                <tr>
                    {tableHeaders&&tableHeaders.map(header=>{
                        return <th key={header} className="">{header}</th>
                    })}
                </tr>
                {/* maps over each submission, checks if the property is img, itll return a stylized img, otherwise, itll check if key of property is equal to table elements'. green, yellow orange */}
                {submissions&&submissions.map(spellSubmitted=>{
                    return(<tr key={spellSubmitted["name"]}>
                        {tableElements&&tableElements.map((tableElement:string) => {
                            if(tableElement==="img"){
                                return <td key={tableElement} className="square-td"><Image alt={spellSubmitted["name"]} className="square-img" src={spellSubmitted[tableElement]} width={"120"} height={"120"}/></td>
                            }
                            return (
                                <td
                                    key={tableElement}
                                    className={`text-center text- square-td border-2 ${
                                        spellSubmitted[tableElement as keyof SpellType] === correctSpell[tableElement as keyof SpellType]
                                        ? 'bg-green-500'
                                        : typeof correctSpell[tableElement as keyof SpellType] === 'string' &&
                                            typeof spellSubmitted[tableElement as keyof SpellType] === 'string' &&
                                            ((correctSpell[tableElement as keyof SpellType] as string).includes(
                                            spellSubmitted[tableElement as keyof SpellType] as string
                                            ) ||
                                            (spellSubmitted[tableElement as keyof SpellType] as string).includes(
                                                correctSpell[tableElement as keyof SpellType] as string
                                            ))
                                        ? 'bg-yellow-500'
                                        : 'bg-red-600'
                                    }`}
                                    >
                                    {spellSubmitted[tableElement as keyof SpellType]}
                                </td>
                            );
                        })}
                    </tr>)
                })}
            </tbody>
        </table>
    )
}

export default Attempts;