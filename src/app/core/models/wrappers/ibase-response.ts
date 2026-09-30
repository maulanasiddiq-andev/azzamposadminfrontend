export interface IBaseResponse<T> {
  succeeded: boolean;
  messages: string[];
  data: T | T[];
}