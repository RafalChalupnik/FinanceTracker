import {Column} from "./ExtendableTable";
import {OrderableEntityDto, WalletComponentDataDto} from "../../api/configuration/DTOs/ConfigurationDto";
import React, {FC} from "react";
import SimpleDropdown from "../SimpleDropdown";
import {Space} from "antd";
import SaveCancelButtons from "../SaveCancelButtons";
import {GroupDto} from "../../api/configuration/DTOs/GroupDto";

interface SimpleDropdownFormProps {
    values: OrderableEntityDto[];
    initialValue: string | undefined;
    isRequired: boolean;
    onSave: (entityId: string | undefined) => Promise<void>;
    onCancel: () => void;
}

const SimpleDropdownForm: FC<SimpleDropdownFormProps> = (props) => {
    let [currentValue, setCurrentValue] = React.useState<string | undefined>(props.initialValue);
    
    return (
        <Space direction='horizontal'>
            <SimpleDropdown
                values={props.values}
                initialValue={props.initialValue}
                isRequired={props.isRequired}
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
                <SimpleDropdownForm 
                    values={physicalAllocations}
                    initialValue={row.defaultPhysicalAllocationId}
                    isRequired={false}
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

export function buildGroupTypeColumn(
    groupTypes: OrderableEntityDto[],
    onUpdate: (row: GroupDto) => Promise<void>
): Column<GroupDto> {
    return {
        key: 'groupTypeId',
        title: 'Group Type',
        render: row => {
            return groupTypes
                .find(groupType => groupType.key === row.groupTypeId)
                ?.name ?? '-';
        },
        editable: {
            renderEditable: ((row, closeCallback) => (
                <SimpleDropdownForm
                    values={groupTypes}
                    initialValue={row.groupTypeId}
                    isRequired={true}
                    onSave={async (groupTypeId?: string) => {
                        row.groupTypeId = groupTypeId!;
                        await onUpdate(row);
                        closeCallback();
                    }}
                    onCancel={closeCallback}
                />
            ))
        }
    }
}