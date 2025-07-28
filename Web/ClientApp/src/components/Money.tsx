import React, { FC } from 'react';

interface MoneyProps {
    value: number;
    colorCoding?: boolean
}

export const Money: FC<MoneyProps> = (props) => {
    const formattedValue = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
    }).format(props.value);
    
    const color = props.value !== 0 && props.colorCoding
        ? (props.value > 0 ? 'green' : 'red')
        : 'black'
    
    return (
        <span style={{ color, textAlign: 'right' }}>
            {formattedValue}
        </span>
    );
}