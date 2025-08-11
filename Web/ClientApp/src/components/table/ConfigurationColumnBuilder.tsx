import {Column} from "./ExtendableTable";
import {OrderableEntityDto, WalletComponentDataDto} from "../../api/configuration/DTOs/ConfigurationDto";
import {Button, Select, Space} from "antd";
import React, { FC } from "react";
import {CloseOutlined, SaveOutlined} from "@ant-design/icons";

interface PhysicalAllocationPickerProps {
    physicalAllocations: OrderableEntityDto[],
    onUpdate: (physicalAllocationId: string | undefined) => Promise<void>
    onCancel: () => void;
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
        options.find(option => option.value === props.physicalAllocations[0].key) ?? options[0]
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

export function buildPhysicalAllocationColumn(
    physicalAllocations: OrderableEntityDto[],
    onUpdate: (row: WalletComponentDataDto) => Promise<void>
): Column<WalletComponentDataDto> {
    return {
        key: 'defaultPhysicalAllocationId',
        title: 'Physical Allocation',
        render: row => {
            return physicalAllocations
                .find(allocation => allocation.key === row.defaultPhysicalAllocationId)
                ?.name ?? '-';
        },
        editable: {
            renderEditable: ((row, closeCallback) => (
                <PhysicalAllocationPicker 
                    physicalAllocations={physicalAllocations}
                    onUpdate={async physicalAllocationId => {
                        row.defaultPhysicalAllocationId = physicalAllocationId;
                        await onUpdate(row);
                        closeCallback();
                    }}
                    onCancel={closeCallback}
                />
            ))
        }
    }
}