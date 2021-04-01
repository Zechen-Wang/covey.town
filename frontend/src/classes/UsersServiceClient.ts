import axios, { AxiosInstance, AxiosResponse } from 'axios';
import assert from 'assert';

export interface UserSignInRequest {
  userName: string;
  password: string;
}

export interface UserSignUpRequest {
  userName: string;
  password: string;
  email: string,
  gender: string,
  age: string,
  city: string,
}

export interface ResponseEnvelope<T> {
  isOK: boolean;
  message?: string;
  response?: T;
}

export default class UsersServiceClient {
  private _axios: AxiosInstance;

  /**
   * Construct a new Users Service API client. Specify a serviceURL for testing, or otherwise
   * defaults to the URL at the environmental variable REACT_APP_ROOMS_SERVICE_URL
   * @param serviceURL
   */
  constructor(serviceURL?: string) {
    const baseURL = serviceURL || process.env.REACT_APP_TOWNS_SERVICE_URL;
    assert(baseURL);
    this._axios = axios.create({ baseURL });
  }

  async findUserByName(requestData: string): Promise<boolean> {
    const responseWrapper  = await this._axios.get<ResponseEnvelope<void>>(`/signup/${requestData}`);
    if (responseWrapper.data.isOK) {
      return true;
    }
    return false;
  }

  async findUserByNameAndPassword(requestData: UserSignInRequest): Promise<boolean> {
    const responseWrapper  = await this._axios.get<ResponseEnvelope<void>>(`/signin/${requestData.userName}/${requestData.password}`);
    if (responseWrapper.data.isOK) {
      return true;
    }
    return false;
  }

  async createUser(requestData: UserSignUpRequest): Promise<void> {
    await this._axios.post<ResponseEnvelope<void>>('/signup', requestData);
  }
}
