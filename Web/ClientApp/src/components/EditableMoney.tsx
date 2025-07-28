import React, {FC, useState} from 'react';
import {Money} from "./Money";

interface EditableMoneyProps {
    value: number;
    onNewValue: (value: number) => void;
    initialEditMode?: boolean;
}

export const EditableMoney: FC<EditableMoneyProps> = (props) => {
    const [editMode, setEditMode] = useState(props.initialEditMode);
    const [currentValue, setCurrentValue] = useState(props.value);
    
    if (editMode) {
        return (
            <>
                <input 
                    type="number" 
                    value={currentValue} 
                    onChange={e => setCurrentValue(Number.parseFloat(e.target.value))} 
                />
                <button 
                    onClick={() => {
                        setEditMode(false);
                        props.onNewValue(currentValue);
                    }}>
                    Save
                </button>
            </>
        );
    } else {
        return (
            <div style={{float: 'right'}}>
            <Money 
                value={currentValue}
            />
            <button onClick={() => setEditMode(true)}>Edit</button>
            </div>
        );
    }
}
