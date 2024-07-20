// import axios, { AxiosError, type AxiosInstance } from 'axios'
// import { toast } from 'react-toastify'
// import HttpStatusCode from 'src/constants/httpStatusCode.enum'
// import { AuthRespon } from 'src/types/auth.type'
// import { clearLs, getAccessTokenFromLs, getProfileFromLs, setAccesTokenLs } from './auth'

// class Http {
//   instance: AxiosInstance
//   private accesToken: string
//   constructor() {
//     ;(this.accesToken = getAccessTokenFromLs()),
//       (this.instance = axios.create({
//         baseURL: 'https://api-ecom.duthanhduoc.com/',
//         timeout: 10000,
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }))
//     // Add a request interceptor
//     this.instance.interceptors.response.use(
//       (config) => {
//         if (this.accesToken && this.accesToken) {
//           config.headers.authorization = this.accesToken
//           return config
//         }
//         return config
//       },
//       (error) => {
//         return Promise.reject(error)
//       }
//     )
//     this.instance.interceptors.response.use(
//       (response) => {
//         const { url } = response.config
//         console.log('================' + url)

//         if (url === '/login' || url === '/register') {
//           this.accesToken = (response.data as AuthRespon).data?.access_token
//           setAccesTokenLs(this.accesToken)

//         } else if (url === '/logout') {
//           this.accesToken = ''
//           console.log(this.accesToken)
//           clearLs()
//         }

//         return response
//       },
//       function (error: AxiosError) {
//         // Any status codes that falls outside the range of 2xx cause this function to trigger
//         console.log(error)
//         if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
//           const data: any | undefined = error.response?.data
//           const message = data.message || error.message

//           toast.error(message)
//         }
//         // Do something with response error
//         return Promise.reject(error)
//       }
//     )
//   }
// }

// const http = new Http().instance

// export default http

import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { AuthRespon } from 'src/types/auth.type'
import { clearLs, getAccessTokenFromLs, setAccesTokenLs ,setProfile} from './auth'

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

    // Add a request interceptor
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

    // Add a response interceptor
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
