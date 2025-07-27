import {useState} from "react";
import Money from "./Money";

export const EditableMoney = ({value, initialEditMode, onNewValue}) => {
    const [editMode, setEditMode] = useState(initialEditMode);
    const [currentValue, setCurrentValue] = useState(value);
    
    if (editMode) {
        return (
            <>
            <input 
                type="number" 
                value={currentValue} 
                onChange={e => setCurrentValue(e.target.value)} 
            />
            <button 
                onClick={() => {
                    setEditMode(false);
                    onNewValue(currentValue);
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
                amount={currentValue}
            />
            <button onClick={() => setEditMode(true)}>Edit</button>
            </div>
        );
    }
}
