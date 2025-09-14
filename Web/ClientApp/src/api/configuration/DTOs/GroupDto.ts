import {OrderableEntityDto} from "./ConfigurationDto";

export type GroupDto = OrderableEntityDto & {
    groupTypeId: string
}