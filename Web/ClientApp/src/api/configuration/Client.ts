import {ConfigurationDto, OrderableEntityDto, WalletComponentDataDto} from "./DTOs/ConfigurationDto";
import {GroupDto, GroupTypeDto, GroupTypeDtoWithGroups} from "./DTOs/GroupDto";

export async function getConfiguration() : Promise<ConfigurationDto> {
    return await sendGet('api/configuration');
}

export async function upsertGroupType(groupType: GroupTypeDto) : Promise<void> {
    await sendPost('api/configuration/group-types', groupType);
}

export async function deleteGroupType(groupTypeId: string) : Promise<void> {
    await sendDelete(`api/configuration/group-types/${groupTypeId}`);
}

export async function upsertGroup(group: GroupDto) : Promise<void> {
    await sendPost('api/configuration/groups', group);
}

export async function deleteGroup(groupId: string) : Promise<void> {
    await sendDelete(`api/configuration/groups/${groupId}`);
}

export async function upsertComponent(component: WalletComponentDataDto) : Promise<void> {
    await sendPost(
        `api/configuration/components`,
        component
    );
}

export async function deleteComponent(componentId: string) : Promise<void> {
    await sendDelete(`api/configuration/components/${componentId}`);
}

export async function getPhysicalAllocations() : Promise<OrderableEntityDto[]> {
    return await sendGet('api/configuration/physical-allocations');
}

export async function upsertPhysicalAllocation(physicalAllocation: OrderableEntityDto) : Promise<void> {
    await sendPost('api/configuration/physical-allocations', physicalAllocation);
}

export async function deletePhysicalAllocation(physicalAllocationId: string) : Promise<void> {
    await sendDelete(`api/configuration/physical-allocations/${physicalAllocationId}`);
}

async function sendGet<T>(path: string) : Promise<T> {
    let response = await fetch(path);
    return await response.json();
}

async function sendPost(path: string, body: any) : Promise<void> {
    let response = await fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Failed to POST to ${path}`);
    }
}

async function sendDelete(path: string) : Promise<void> {
    let response = await fetch(path, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to DELETE ${path}`);
    }
}