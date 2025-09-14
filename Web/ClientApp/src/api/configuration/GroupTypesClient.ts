import {OrderableEntityDto} from "./DTOs/ConfigurationDto";
import {sendDelete, sendGet, sendPost} from "../shared/HttpClient";

export async function getGroupTypes() : Promise<OrderableEntityDto[]> {
    return sendGet('api/configuration/group-types');
}

export async function upsertGroupType(groupType: OrderableEntityDto) : Promise<void> {
    await sendPost('api/configuration/group-types', groupType);
}

export async function deleteGroupType(id: string) : Promise<void> {
    await sendDelete(`api/configuration/group-types/${id}`);
}