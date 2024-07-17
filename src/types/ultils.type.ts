export interface ErrorRessponse<Data> {
  message: string
  data?: Data
}

export interface SuccesRessponse<Data> {
  message: string
  data: Data
}
