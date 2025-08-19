import {InputNumber, Select, Tooltip} from "antd";
import React, {FC, ReactNode, useState} from "react";
import {ExclamationCircleOutlined} from "@ant-design/icons";

const { Option } = Select;

interface InputCurrencyProps {
    onValueChange: (value: number | undefined) => void;
    onCurrencyChange?: (currency: string) => void;
    disableCurrencyPicker?: boolean;
    initialValue?: number;
    initialCurrency?: string;
    error?: string;
    extra?: ReactNode;
}

const InputCurrency: FC<InputCurrencyProps> = (props) => {
    const DEFAULT_CURRENCY = 'PLN';
    const AVAILABLE_CURRENCIES = ["PLN", "CAD", "USD", "EUR", "GBP"];

    const [focused, setFocused] = useState(false);
    const [currency, setCurrency] = useState(props.initialCurrency ?? DEFAULT_CURRENCY);

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
    
    const addOn = props.extra ?? (
        <Select
            disabled={props.disableCurrencyPicker}
            defaultValue={currency}
            style={{ width: "auto", minWidth: 80 }}
            onChange={value => {
                setCurrency(value);
                props.onCurrencyChange?.(value);
            }}
            showSearch
            optionFilterProp="children"
        >
            {AVAILABLE_CURRENCIES.map(c => (
                <Option key={c} value={c}>
                    {c}
                </Option>
            ))}
        </Select>
    );
    
    return (
            <Tooltip title={props.error}>
                <InputNumber
                    value={props.initialValue}
                    style={{ width: 'auto' }}
                    status={props.error !== undefined ? 'error' : undefined}
                    prefix={props.error !== undefined 
                        ? (<ExclamationCircleOutlined/>) 
                        : undefined
                    }
                    step={0.01}
                    formatter={formatter}
                    parser={parser}
                    onChange={(val) => {
                        props.onValueChange(val ?? undefined);
                    }}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    addonAfter={addOn}
                />
            </Tooltip>
    );
}

export default InputCurrency;