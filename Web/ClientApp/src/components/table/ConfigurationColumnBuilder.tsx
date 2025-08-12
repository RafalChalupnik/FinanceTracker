import {Column} from "./ExtendableTable";
import {OrderableEntityDto, WalletComponentDataDto} from "../../api/configuration/DTOs/ConfigurationDto";
import React from "react";
import PhysicalAllocationPicker from "../PhysicalAllocationPicker";

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
                    defaultValue={row.defaultPhysicalAllocationId}
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