import { AuthRespon } from "src/types/auth.type";
import http from "src/utils/http";

export const registerAccount = (body:{email:string;password:string}) => http.post<AuthRespon>('/register',body)

export const loginAccount = (body:{email:string;password:string}) => http.post<AuthRespon>('/login',body)


export const logout = () => http.post('/logout')