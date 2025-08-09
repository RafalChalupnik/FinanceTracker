import {Alert, Button, InputNumber, Space} from "antd";
import React, {FC, useState} from "react";
import {CloseOutlined, SaveOutlined} from "@ant-design/icons";

interface InflationFormProps {
    year: number,
    month: number,
    initialValue: number | undefined;
    onUpdate: (year: number, month: number, value: number) => Promise<void>;
    closeCallback: () => void;
}

const InflationForm: FC<InflationFormProps> = (props) => {
    const [amount, setAmount] = useState(props?.initialValue);
    const [alertVisible, setAlertVisible] = useState(false);

    const save = async () => {
        setAlertVisible(false);

        if (amount === undefined || amount === null) {
            setAlertVisible(true);
            return;
        }

        await props.onUpdate(props.year, props.month, amount);
        props.closeCallback();
    }
    
    return (
        <Space direction='horizontal'>
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
            <Button icon={<SaveOutlined/>} onClick={save}/>
            <Button icon={<CloseOutlined/>} onClick={props.closeCallback}/>
        </Space>
    );
}

export default InflationForm;