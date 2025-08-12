import {OrderableEntityDto} from "../api/configuration/DTOs/ConfigurationDto";
import React, {FC} from "react";
import {Select, Space} from "antd";

interface PhysicalAllocationPickerProps {
    physicalAllocations: OrderableEntityDto[];
    initialValue: string | undefined;
    onChange: (value: string | undefined) => void;
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
    
    let defaultOption = options.find(option => option.value === props.initialValue) ?? options[0];

    const onChange = (selectedOption: PhysicalAllocationOption) => {
        let newId = selectedOption.value !== ''
            ? selectedOption.value
            : undefined;
        
        props.onChange(newId);
    }

    return (
        <Space direction='horizontal'>
            <Select
                labelInValue
                defaultValue={defaultOption}
                style={{ width: 200 }}
                options={options}
                onChange={onChange}
            />
        </Space>
    );
}

export default PhysicalAllocationPicker;