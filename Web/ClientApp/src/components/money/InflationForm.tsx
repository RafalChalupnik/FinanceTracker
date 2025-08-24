import {Alert, Checkbox, InputNumber, Space} from "antd";
import React, {FC, useState} from "react";
import {InflationDto} from "../../api/value-history/DTOs/EntityTableDto";
import SaveCancelButtons from "../SaveCancelButtons";

interface InflationFormProps {
    year: number,
    month: number,
    initialValue: InflationDto | undefined;
    onUpdate: (year: number, month: number, value: number, confirmed: boolean) => Promise<void>;
    closeCallback: () => void;
}

const InflationForm: FC<InflationFormProps> = (props) => {
    const [amount, setAmount] = useState(props?.initialValue?.value);
    const [confirmed, setConfirmed] = useState(props.initialValue?.confirmed ?? false);
    const [alertVisible, setAlertVisible] = useState(false);

    const save = async () => {
        setAlertVisible(false);

        if (amount === undefined || amount === null) {
            setAlertVisible(true);
            return;
        }

        await props.onUpdate(props.year, props.month, amount / 100, confirmed);
        props.closeCallback();
    }
    
    return (
        <Space direction='horizontal'>
            {alertVisible && <Alert message="Amount is required" type="error" />}
            <Space direction='vertical'>
                <InputNumber
                    value={amount}
                    style={{ width: '100%' }}
                    step={0.01}
                    placeholder="0,00"
                    onChange={(e) => {
                        setAmount(e?.valueOf());
                    }}
                />
                <Checkbox 
                    defaultChecked={confirmed}
                    onChange={e => setConfirmed(e.target.checked)}
                >
                    Is confirmed?
                </Checkbox>
            </Space>
            <SaveCancelButtons 
                onSave={save} 
                onCancel={props.closeCallback}
            />
        </Space>
    );
}

export default InflationForm;