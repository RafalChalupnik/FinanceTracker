import {OrderableEntityDto} from "../api/configuration/DTOs/ConfigurationDto";
import React, {FC} from "react";
import {Button, Select, Space} from "antd";
import {CloseOutlined, SaveOutlined} from "@ant-design/icons";

interface PhysicalAllocationPickerProps {
    physicalAllocations: OrderableEntityDto[],
    onUpdate: (physicalAllocationId: string | undefined) => void | Promise<void>
    onCancel?: () => void;
    defaultValue?: string,
}

interface PhysicalAllocationOption {
    value: string,
    label: string
}

const PhysicalAllocationPicker: FC<PhysicalAllocationPickerProps> = (props) => {
    let options = [
        {
            value: '',
            label: '-'
        },
        ...(props.physicalAllocations.map(allocation => {
            return {
                value: allocation.key,
                label: allocation.name
            }
        }))
    ]

    let [currentValue, setCurrentValue] = React.useState<PhysicalAllocationOption>(
        options.find(option => option.value === props.defaultValue) ?? options[0]
    );

    const save = async () => {
        let newId = currentValue.value !== ''
            ? currentValue.value
            : undefined;

        await props.onUpdate(newId);
    }

    return (
        <Space direction='horizontal'>
            <Select
                labelInValue
                defaultValue={currentValue}
                style={{ width: 200 }}
                options={options}
                onChange={setCurrentValue}
            />
            <Button
                icon={<SaveOutlined />}
                // onClick={() => props.onSave(currentValue)}
                onClick={save}
            />
            <Button
                icon={<CloseOutlined />}
                onClick={props.onCancel}
            />
        </Space>
    );
}

export default PhysicalAllocationPicker;