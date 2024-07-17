import React from 'react'
import Footer from 'src/components/Footer'
import RegisterHeader from '../../components/RegisterHeader/index'

interface Props {
  children?: React.ReactNode
}

export default function RegisterLayout({ children }: Props) {
  return (
    <div>
      <RegisterHeader />
      RegisterLayout
      {children}
      <Footer />
    </div>
  )
}
