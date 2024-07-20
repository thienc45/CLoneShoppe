import { AuthRespon } from "src/types/auth.type";
import http from "src/utils/http";

const authApi = {
  registerAccount: (body: { email: string; password: string }) => {
    return http.post<AuthRespon>('/register', body);
  },
  loginAccount: (body: { email: string; password: string }) => {
    return http.post<AuthRespon>('/login', body);
  },
  logout: () => {
    return http.post('/logout');
  }
};

export default authApi;
