import { RecordStatus } from "../enums/record-status.enum";

export class BaseModel {
    version: number;
    createdTime: Date;
    modifiedTime: Date;
    createdBy: string;
    modifiedBy: string;
    recordStatus: string = RecordStatus.Active;
    deskripsi: string;
    isSelected: boolean = false;
}