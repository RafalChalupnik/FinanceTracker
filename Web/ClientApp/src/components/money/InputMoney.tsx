import React, {FC, ReactNode, useState} from "react";
import {InputNumber, Select, Space} from "antd";
import {TransactionOutlined} from "@ant-design/icons";
import {MoneyDto} from "../../api/value-history/DTOs/Money";

const { Option } = Select;

interface InputCurrencyProps {
    value?: number;
    currency?: string;
    currencyOptions?: string[];
    disableCurrencyPicker?: boolean;
    onValueChange: (value: number) => void;
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
                {props.currencyOptions?.map(c => (
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
                props.onValueChange(val ?? 0);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            addonAfter={buildAddOn()}
        />
    );
}

interface InputMoneyProps {
    value?: MoneyDto;
    onChange?: (value: MoneyDto | undefined) => void;
}

const InputMoney : FC<InputMoneyProps> = (props) => {
    const MAIN_CURRENCY = 'PLN';
    const AVAILABLE_CURRENCIES = ["PLN", "CAD", "USD", "EUR", "GBP"];
    
    let value = props.value ?? {
        amount: 0,
        currency: MAIN_CURRENCY,
        amountInMainCurrency: 0
    };
    
    const convertCurrency = async () => {
        if (props.value !== undefined) {
            const res = await fetch(`https://open.er-api.com/v6/latest/${props.value.currency}`);
            const converted = (await res.json()).rates[MAIN_CURRENCY] * props.value.amount;
            props.onChange?.({
                ...props.value,
                amountInMainCurrency: converted,
            });
        }
    }
    
    return (
        <Space direction='vertical'>
            <InputCurrency 
                value={value.amount}
                currency={value.currency}
                currencyOptions={AVAILABLE_CURRENCIES}
                disableCurrencyPicker={false}
                onValueChange={amount => props.onChange?.({
                    ...value,
                    amount: amount ?? 0
                })}
                onCurrencyChange={currency => props.onChange?.({
                    ...value,
                    currency: currency
                })}
            />
            {value.currency !== MAIN_CURRENCY && <InputCurrency
                value={value?.amountInMainCurrency}
                currency={MAIN_CURRENCY}
                disableCurrencyPicker={true}
                onValueChange={amount => props.onChange?.({
                    ...value,
                    amountInMainCurrency: amount ?? 0,
                })}
                extra={<TransactionOutlined onClick={convertCurrency}/>}
            />}
        </Space>
    );
}

export default InputMoney;