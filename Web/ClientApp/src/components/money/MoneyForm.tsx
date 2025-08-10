import React, { FC, useState } from "react";
import {Alert, Button, Input, InputNumber, Space} from "antd";
import {MoneyDto} from "../../api/value-history/DTOs/Money";

interface MoneyFormProps {
    initialValue: MoneyDto | undefined;
    onSave: (value: MoneyDto) => (void | Promise<void>);
    onCancel: () => void;
}

const MoneyForm: FC<MoneyFormProps> = (props) => {
    const MAIN_CURRENCY = 'PLN';
    
    const [amount, setAmount] = useState(props?.initialValue?.amount);
    const [currency, setCurrency] = useState(props?.initialValue?.currency ?? 'PLN');
    const [amountInMainCurrency, setAmountInMainCurrency] = useState<number | undefined>(currency !== MAIN_CURRENCY
        ? props?.initialValue?.amountInMainCurrency
        : undefined);
    const [alertVisible, setAlertVisible] = useState(false);
    
    const save = () => {
        setAlertVisible(false);
        
        if (amount === undefined) {
            setAlertVisible(true);
            return;
        }
        
        let money = {
            amount: amount,
            currency: currency ?? MAIN_CURRENCY,
            amountInMainCurrency: currency != MAIN_CURRENCY
                ? amountInMainCurrency ?? amount
                : amount,
        }
        
        props.onSave(money);
    }
    
    return (
        <Space direction={"vertical"}>
            {alertVisible && <Alert message="Amount is required" type="error" />}
            <InputNumber
                value={amount}
                style={{ width: '100%' }}
                step={0.01}
                placeholder="0,00"
                onChange={(e) => {
                    setAmount(e?.valueOf());
                }}
            />
            <Input 
                value={currency}
                minLength={3} 
                maxLength={3}
                onChange={(e) => setCurrency(e.target.value)}
            />
            {currency != MAIN_CURRENCY && <InputNumber
                value={amountInMainCurrency}
                style={{ width: '100%' }}
                step={0.01}
                placeholder="0,00"
                onChange={(e) => setAmountInMainCurrency( e?.valueOf())}
            />}
            <Space direction={"horizontal"}>
                <Button onClick={save}>Save</Button>
                <Button onClick={props.onCancel}>Cancel</Button>
            </Space>
        </Space>
    );
}

export default MoneyForm;