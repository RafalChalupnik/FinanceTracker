import React, {FC, ReactNode} from "react";
import {Space, Tooltip, Typography} from "antd";
import {ExclamationCircleOutlined, InfoCircleOutlined} from "@ant-design/icons";

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

    const wrapInDiv = (element: ReactNode, color: string, extra?: ReactNode) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div style={{ flexGrow: 1, textAlign: 'inherit' }}>
                {extra}
            </div>
            <div style={{ color, textAlign: 'right' }}>
                {element}
            </div>
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
    
    let extra = props.isInferred 
        ? (
            <Tooltip title='This value is inferred'>
                <InfoCircleOutlined style={{ fontSize: '16px' }}/>
            </Tooltip>
        )
        : undefined;
    
    return wrapInDiv(content, color, extra);
}

export default Money;