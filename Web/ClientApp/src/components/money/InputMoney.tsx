import React, {FC, useState} from "react";
import {Space} from "antd";
import InputCurrency from "./InputCurrency";
import {TransactionOutlined} from "@ant-design/icons";

interface InputMoneyProps {
    
}

const InputMoney : FC<InputMoneyProps> = (props) => {
    const MAIN_CURRENCY = 'PLN';

    const [amount, setAmount] = useState<number | undefined>(123);
    const [currency, setCurrency] = useState('PLN');
    const [amountInMainCurrency, setAmountInMainCurrency] = useState<number | undefined>(123);
    
    const convertCurrency = async () => {
        if (amount !== undefined) {
            const res = await fetch(`https://open.er-api.com/v6/latest/${currency}`);
            const converted = (await res.json()).rates[MAIN_CURRENCY] * amount;
            setAmountInMainCurrency(converted);
        }
    }
    
    return (
        <Space direction='vertical'>
            <InputCurrency 
                onValueChange={setAmount}
                initialValue={amount}
                currency={{
                    onChange: currency => {
                        setCurrency(currency);

                        if (currency !== MAIN_CURRENCY && amountInMainCurrency === undefined) {
                            setAmountInMainCurrency(0);
                        }
                    },
                    initialCurrency: currency
                }}
            />
            {currency !== MAIN_CURRENCY && <InputCurrency
                onValueChange={setAmountInMainCurrency}
                initialValue={amountInMainCurrency}
                currency={{
                    disableCurrencyPicker: true
                }}
                extra={<TransactionOutlined onClick={convertCurrency}/>}
            />}
        </Space>
    );
}

export default InputMoney;