export interface Login {

    email: string,
    password: string
}

//response format
export interface DataResponse {
    Status: string;
    Msg: string;
    Data: Array<any>;
    TwoAuth: boolean;
    Timeout?: string;
}