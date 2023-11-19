import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export interface DBDocument {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IService<T = Record<string, any>> {
  model?: T & DBDocument;
  config?: AxiosRequestConfig<any>;
  resp?: AxiosResponse;
}

export interface IErrData {
  message?: string;
  status?: string;
  stack?: string;
}

export type IResponse = (Record<string, any> &
  Error &
  AxiosResponse<IErrData> &
  AxiosError<IErrData> &
  unknown) & {
  role?: "Message_ERR";
};