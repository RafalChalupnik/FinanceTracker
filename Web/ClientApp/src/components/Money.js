import React from 'react';

const Money = ({ amount, colorCoding = false}) => {
    const formattedAmount = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
    }).format(amount);

    const color = amount !== 0 && colorCoding
        ? (amount > 0 ? 'green' : 'red')
        : 'black'

    return (
        <span style={{ color, textAlign: 'right' }}>
      {formattedAmount}
    </span>
    );
};

export default Money;