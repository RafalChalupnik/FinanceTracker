import {InputNumber, Select} from "antd";
import {FC, useState} from "react";

const { Option } = Select;

interface InputCurrencyProps {
    onValueChange: (value: number | undefined) => void;
    onCurrencyChange?: (currency: string) => void;
    disableCurrencyPicker?: boolean;
    initialValue?: number;
    initialCurrency?: string;
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
    
    return (
        <>
            <InputNumber
                value={props.initialValue}
                style={{ width: 'auto' }}
                step={0.01}
                formatter={formatter}
                parser={parser}
                onChange={(val) => {
                    props.onValueChange(val ?? undefined);
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
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
        </>
    );
}

export default InputCurrency;