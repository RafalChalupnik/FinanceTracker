import {sendDelete, sendGet, sendPost} from "../shared/HttpClient";
import {GroupDto} from "./DTOs/GroupDto";

export async function getGroups() : Promise<GroupDto[]> {
    return sendGet('api/configuration/groups');
}

export async function upsertGroup(group: GroupDto) : Promise<void> {
    await sendPost('api/configuration/groups', group);
}

export async function deleteGroup(id: string) : Promise<void> {
    await sendDelete(`api/configuration/groups/${id}`);
}