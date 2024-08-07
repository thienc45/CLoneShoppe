import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { AuthRespon } from 'src/types/auth.type'
import { clearLs, getAccessTokenFromLs, setAccesTokenLs, setProfile } from './auth'

class Http {
  instance: AxiosInstance
  private accesToken: string

  constructor() {
    this.accesToken = getAccessTokenFromLs()
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accesToken) {
          config.headers.authorization = this.accesToken
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        const data = response.data as AuthRespon
        if (url === '/login' || url === '/register') {
          this.accesToken = data.data?.access_token
          setAccesTokenLs(this.accesToken)
          setProfile(data.data.user)
        } else if (url === '/logout') {
          this.accesToken = ''
          clearLs()
        }

        return response
      },
      (error: AxiosError) => {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
