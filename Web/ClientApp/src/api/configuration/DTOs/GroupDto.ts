import {OrderableEntityDto} from "./ConfigurationDto";

export type GroupDto = OrderableEntityDto & {
    groupTypeId: string
}

export type GroupTypeDto = OrderableEntityDto & {
    icon: string,
    showScore: boolean
}