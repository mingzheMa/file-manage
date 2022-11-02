export interface Response<Data> {
  cookies: any[];
  data: Data;
  errMsg: string;
  header: { [key: string]: any };
  statusCode: number;
}

export type promiseResponse<T> = Promise<Response<T>>
  
  