import {ConfigurationDto, OrderableEntityDto, WalletComponentDataDto} from "./DTOs/ConfigurationDto";

export async function getConfiguration() : Promise<ConfigurationDto> {
    return await sendGet('api/configuration');
}

export async function getGroups() : Promise<Record<string, OrderableEntityDto[]>> {
    return await sendGet('api/configuration/groups2');
}

export async function getWallets() : Promise<OrderableEntityDto[]> {
    return await sendGet('api/configuration/wallets');
}

export async function getPhysicalAllocations() : Promise<OrderableEntityDto[]> {
    return await sendGet('api/configuration/physical-allocations');
}

export async function upsertAsset(asset: OrderableEntityDto) : Promise<void> {
    await sendPost('api/configuration/assets', asset);
}

export async function deleteAsset(assetId: string) : Promise<void> {
    await sendDelete(`api/configuration/assets/${assetId}`);
}

export async function upsertDebt(debt: OrderableEntityDto) : Promise<void> {
    await sendPost('api/configuration/debts', debt);
}

export async function deleteDebt(debtId: string) : Promise<void> {
    await sendDelete(`api/configuration/debts/${debtId}`);
}

export async function upsertPhysicalAllocation(physicalAllocation: OrderableEntityDto) : Promise<void> {
    await sendPost('api/configuration/physical-allocations', physicalAllocation);
}

export async function deletePhysicalAllocation(physicalAllocationId: string) : Promise<void> {
    await sendDelete(`api/configuration/physical-allocations/${physicalAllocationId}`);
}

export async function upsertWallet(wallet: OrderableEntityDto) : Promise<void> {
    await sendPost('api/configuration/wallets', wallet);
}

export async function deleteWallet(walletId: string) : Promise<void> {
    await sendDelete(`api/configuration/wallets/${walletId}`);
}

export async function upsertWalletComponent(walletId: string, component: WalletComponentDataDto) : Promise<void> {
    await sendPost(
        `api/configuration/wallets/${walletId}/components`,
        component
    );
}

export async function deleteWalletComponent(componentId: string) : Promise<void> {
    await sendDelete(`api/configuration/wallets/components/${componentId}`);
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