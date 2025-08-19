import React, { FC, useState } from "react";
import {Alert, Space} from "antd";
import {MoneyDto} from "../../api/value-history/DTOs/Money";
import {OrderableEntityDto} from "../../api/configuration/DTOs/ConfigurationDto";
import PhysicalAllocationPicker from "../PhysicalAllocationPicker";
import SaveCancelButtons from "../SaveCancelButtons";
import InputCurrency from "./InputCurrency";
import {TransactionOutlined} from "@ant-design/icons";

interface MoneyFormProps {
    initialValue: MoneyDto | undefined;
    onSave: (value: MoneyDto, physicalAllocationId?: string) => (void | Promise<void>);
    onCancel: () => void;
    physicalAllocations?: OrderableEntityDto[],
    defaultPhysicalAllocation?: string
}

const MoneyForm: FC<MoneyFormProps> = (props) => {
    const MAIN_CURRENCY = 'PLN';
    
    const [amount, setAmount] = useState(props?.initialValue?.amount);
    const [currency, setCurrency] = useState(props?.initialValue?.currency ?? 'PLN');
    const [amountInMainCurrency, setAmountInMainCurrency] = useState<number | undefined>(props?.initialValue?.amountInMainCurrency);
    const [physicalAllocationId, setPhysicalAllocationId] = useState<string | undefined>(undefined);
    const [alertVisible, setAlertVisible] = useState(false);

    // TODO: Move
    async function convertCurrency(amount: number, currency: string): Promise<number> {
        const res = await fetch(`https://open.er-api.com/v6/latest/${currency}`);
        const data = await res.json();
        return data.rates[MAIN_CURRENCY] * amount;
    }
    
    const updateAmountInMainCurrency = async () => {
        console.log('#Request')
        
        if (amount !== undefined) {
            let converted = await convertCurrency(amount, currency);
            console.log('#Response', converted)
            setAmountInMainCurrency(converted);
        }
    }
    
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
        
        props.onSave(money, physicalAllocationId);
    }
    
    return (
        <Space direction={"vertical"}>
            {alertVisible && <Alert message="Amount is required" type="error" />}
            <InputCurrency 
                onValueChange={setAmount} 
                onCurrencyChange={setCurrency}
                initialValue={amount}
                initialCurrency={currency}
            />
            {currency != MAIN_CURRENCY && <InputCurrency
                onValueChange={setAmountInMainCurrency}
                initialValue={amountInMainCurrency}
                disableCurrencyPicker
                extra={<TransactionOutlined onClick={updateAmountInMainCurrency}/>}
            />}
            {props.physicalAllocations && (
                <PhysicalAllocationPicker 
                    physicalAllocations={props.physicalAllocations} 
                    initialValue={props.defaultPhysicalAllocation}
                    onChange={setPhysicalAllocationId}
                />
            )}
            <SaveCancelButtons 
                onSave={save} 
                onCancel={props.onCancel}
            />
        </Space>
    );
}

export default MoneyForm;