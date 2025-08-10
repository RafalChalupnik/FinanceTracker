import React, {FC, ReactNode} from "react";
import {Space, Typography} from "antd";

const { Text } = Typography;

interface MoneyProps {
    value: Value | undefined,
    colorCoding: boolean,
    isInferred: boolean
}

interface Value {
    amount: number,
    currency: string,
    amountInMainCurrency: number
}

const Money: FC<MoneyProps> = (props) => {
    const MAIN_CURRENCY = 'PLN';
    
    const formatAmount = (amount: number, currency: string) => 
        new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: currency,
        }).format(amount)
    
    const buildFormattedAmountInMainCurrency = (amount: number, amountInMainCurrency: number) =>
        amountInMainCurrency !== amount
            ? (<Text style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{formatAmount(amountInMainCurrency, MAIN_CURRENCY)}</Text>)
            : (<></>)

    const wrapInDiv = (element: ReactNode, color: string) => (
        <div style={{ color, textAlign: 'right' }}>
            {element}
        </div>
    );
    
    if (props.value === undefined) {
        return wrapInDiv('-', 'black');
    }

    const {amount, currency, amountInMainCurrency} = props.value

    let content = (
        <Space direction={"vertical"}>
            {formatAmount(amount, currency)}
            {buildFormattedAmountInMainCurrency(amount, amountInMainCurrency)}
        </Space>
    );

    const color = amountInMainCurrency !== 0 && props.colorCoding
        ? (amountInMainCurrency > 0 ? 'green' : 'red')
        : (props.isInferred ? 'rgba(0, 0, 0, 0.25)' : 'black')
    
    return wrapInDiv(content, color);
}

export default Money;