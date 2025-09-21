import React, {FC} from "react";
import {Select, Space} from "antd";

interface DropdownItem {
    key: string,
    name: string
}

interface SimpleDropdownProps {
    availableValues: DropdownItem[];
    value: string | undefined;
    isRequired: boolean;
    onChange: (value: string | undefined) => void;
}

interface SimpleDropdownOption {
    value: string,
    label: string
}

const SimpleDropdown: FC<SimpleDropdownProps> = (props) => {
    let options = props.availableValues.map(value => {
        return {
            value: value.key,
            label: value.name
        }
    })
    
    if (!props.isRequired) {
        options = [
            {
                value: '',
                label: '-'
            },
            ...options
        ]
    }
    
    let defaultOption = options.find(option => option.value === props.value) ?? options[0];

    const onChange = (selectedOption: SimpleDropdownOption) => {
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

export default SimpleDropdown;