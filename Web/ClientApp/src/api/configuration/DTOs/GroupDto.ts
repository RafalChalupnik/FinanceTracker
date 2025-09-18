import {OrderableEntityDto} from "./ConfigurationDto";

export type GroupDto = OrderableEntityDto & {
    groupTypeId: string
}

export type GroupTypeDto = {
    name: string,
    icon: string,
    groups: GroupDto2[]
};

export type GroupDto2 = {
    key: string,
    name: string
}