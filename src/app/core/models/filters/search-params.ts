import { RecordStatus } from "../../enums/record-status.enum";
import { SortDirection } from "../../enums/sort-direction.enum";

export class SearchParams {
    recordStatus = RecordStatus.Active;
    search = '';
    sortBy = 'nama';
    sortDir: string = SortDirection.Asc;
    pageIndex = 0;
    pageSize = 10;
    isCount = true;
    isValueDisplay = false;
}