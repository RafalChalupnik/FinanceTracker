import React, {FC, ReactNode, useState} from "react";
import {InputNumber, Select, Space} from "antd";
import {TransactionOutlined} from "@ant-design/icons";

const { Option } = Select;

interface InputCurrencyProps {
    value?: number;
    currency?: string;
    currencyOptions: string[];
    disableCurrencyPicker?: boolean;
    onValueChange: (value: number | undefined) => void;
    onCurrencyChange?: (currency: string) => void;
    extra?: ReactNode;
}

const InputCurrency: FC<InputCurrencyProps> = (props) => {
    const [focused, setFocused] = useState(false);
    const [currency, setCurrency] = useState(props?.currency);

    const formatter = (val?: number | string) => {
        if (val === undefined || val === null || val === "") return "";
        const number = typeof val === "number" ? val : parseFloat(val.replace(/[^\d.-]/g, ""));
        return focused
            ? number.toString()
            : new Intl.NumberFormat(navigator.language, {
                style: "currency",
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(number);
    };

    const parser = (val?: string): number => {
        if (!val) return 0;
        const numeric = val.replace(/[^\d.-]/g, "");
        return numeric ? parseFloat(numeric) : 0;
    };

    const buildAddOn = () => {
        if (props.extra) {
            return props.extra;
        }

        if (props?.currency === undefined)
        {
            return undefined;
        }

        return (
            <Select
                disabled={props.disableCurrencyPicker ?? false}
                defaultValue={currency}
                style={{ width: "auto", minWidth: 80 }}
                onChange={value => {
                    setCurrency(value);
                    props.onCurrencyChange?.(value);
                }}
                showSearch
                optionFilterProp="children"
            >
                {props.currencyOptions.map(c => (
                    <Option key={c} value={c}>
                        {c}
                    </Option>
                ))}
            </Select>
        );
    }
    
    return (
        <InputNumber
            value={props.value}
            style={{ width: 'auto' }}
            step={0.01}
            formatter={formatter}
            parser={parser}
            onChange={(val) => {
                props.onValueChange(val ?? undefined);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            addonAfter={buildAddOn()}
        />
    );
}

interface InputMoneyProps {
    
}

const InputMoney : FC<InputMoneyProps> = (props) => {
    const MAIN_CURRENCY = 'PLN';
    const AVAILABLE_CURRENCIES = ["PLN", "CAD", "USD", "EUR", "GBP"];

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
                value={amount}
                currency={currency}
                currencyOptions={AVAILABLE_CURRENCIES}
                disableCurrencyPicker={false}
                onValueChange={setAmount}
                onCurrencyChange={setCurrency}
            />
            {currency !== MAIN_CURRENCY && <InputCurrency
                value={amountInMainCurrency}
                currency={MAIN_CURRENCY}
                currencyOptions={[]}
                disableCurrencyPicker={true}
                onValueChange={setAmountInMainCurrency}
                onCurrencyChange={() => {}}
                extra={<TransactionOutlined onClick={convertCurrency}/>}
            />}
        </Space>
    );
}

export default InputMoney;