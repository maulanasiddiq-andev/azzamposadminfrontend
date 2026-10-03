import { IBaseResponse } from './ibase-response';

export class BaseResponse<T> implements IBaseResponse<T> {
    succeeded: boolean
    messages: string[]
    data: T
}
