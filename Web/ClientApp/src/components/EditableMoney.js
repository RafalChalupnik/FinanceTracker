import {useState} from "react";
import Money from "./Money";

export const EditableMoney = ({amount, onNewAmount}) => {
    const [editMode, setEditMode] = useState(false);
    const [currentAmount, setCurrentAmount] = useState(amount);
    
    if (editMode) {
        return (
            <>
            <input 
                type="number" 
                value={currentAmount} 
                onChange={e => setCurrentAmount(e.target.value)} 
            />
            <button 
                onClick={() => {
                    setEditMode(false);
                    onNewAmount(currentAmount);
                }}
            >
                Save
            </button>
            </>
        );
    } else {
        return (
            <div style={{float: 'right'}}>
            <Money 
                amount={currentAmount}
            />
            <button onClick={() => setEditMode(true)}>Edit</button>
            </div>
        );
    }
}
