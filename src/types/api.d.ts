declare namespace API {
  export interface Response {
    data: ResponseData;
    errMsg: string;
    statusCode: number;
    header: any;
  }

  export interface ResponseData {
    success: boolean,
    msg: string,
    code: number;
    data: any;
  }
}

