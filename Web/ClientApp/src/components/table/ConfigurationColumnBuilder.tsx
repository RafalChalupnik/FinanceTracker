import {Column} from "./ExtendableTable";
import {OrderableEntityDto, WalletComponentDataDto} from "../../api/configuration/DTOs/ConfigurationDto";
import React, {FC} from "react";
import PhysicalAllocationPicker from "../PhysicalAllocationPicker";
import {Space} from "antd";
import SaveCancelButtons from "../SaveCancelButtons";

interface PhysicalAllocationForm {
    physicalAllocations: OrderableEntityDto[];
    initialValue: string | undefined;
    onSave: (physicalAllocationId: string | undefined) => Promise<void>;
    onCancel: () => void;
}

const PhysicalAllocationForm: FC<PhysicalAllocationForm> = (props) => {
    let [currentValue, setCurrentValue] = React.useState<string | undefined>(props.initialValue);
    
    return (
        <Space direction='horizontal'>
            <PhysicalAllocationPicker
                physicalAllocations={props.physicalAllocations}
                initialValue={props.initialValue}
                onChange={setCurrentValue}
            />
            <SaveCancelButtons 
                onSave={async () => await props.onSave(currentValue)} 
                onCancel={props.onCancel}
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
        title: 'Default Physical Allocation',
        render: row => {
            return physicalAllocations
                .find(allocation => allocation.key === row.defaultPhysicalAllocationId)
                ?.name ?? '-';
        },
        editable: {
            renderEditable: ((row, closeCallback) => (
                <PhysicalAllocationForm 
                    physicalAllocations={physicalAllocations}
                    initialValue={row.defaultPhysicalAllocationId}
                    onSave={async (physicalAllocationId?: string) => {
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