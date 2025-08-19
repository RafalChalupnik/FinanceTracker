import React, { FC, useState } from "react";
import {Alert, Button, Input, InputNumber, Space} from "antd";
import {MoneyDto} from "../../api/value-history/DTOs/Money";
import {CloseOutlined, SaveOutlined} from "@ant-design/icons";
import {OrderableEntityDto} from "../../api/configuration/DTOs/ConfigurationDto";
import PhysicalAllocationPicker from "../PhysicalAllocationPicker";
import SaveCancelButtons from "../SaveCancelButtons";
import InputCurrency from "./InputCurrency";

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
    const [amountInMainCurrency, setAmountInMainCurrency] = useState<number | undefined>(currency !== MAIN_CURRENCY
        ? props?.initialValue?.amountInMainCurrency
        : undefined);
    const [physicalAllocationId, setPhysicalAllocationId] = useState<string | undefined>(undefined);
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