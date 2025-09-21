import {OrderableEntityDto} from "./ConfigurationDto";

export type GroupDto = OrderableEntityDto & {
    groupTypeId: string
}

export type GroupTypeDto = OrderableEntityDto & {
    icon: string
}

export type GroupTypeDtoWithGroups = GroupTypeDto & {
    groups: GroupDto[]
}