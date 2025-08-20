import React, {FC, useState} from "react";
import InputCurrency from "./InputCurrency";
import {Space} from "antd";
import SaveCancelButtons from "../SaveCancelButtons";

interface TargetFormProps {
    onSave: (value: number) => Promise<void>;
    onCancel: () => void;
    initialValue?: number;
}

const TargetForm: FC<TargetFormProps> = (props) => {
    const [target, setTarget] = useState<number | undefined>(props.initialValue);
    const [alertVisible, setAlertVisible] = useState(false);

    const save = async () => {
        if (target === undefined) {
            setAlertVisible(true);
            return;
        }

        await props.onSave(target);
    }
    
    return (
        <Space direction='vertical'>
            <InputCurrency
                onValueChange={setTarget}
                initialValue={target}
                error={alertVisible ? 'Target is required' : undefined}
            />
            <SaveCancelButtons
                onSave={save}
                onCancel={props.onCancel}
            />
        </Space>
    );
}

export default TargetForm;