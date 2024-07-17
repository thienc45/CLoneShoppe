import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginAccount } from "src/apis/auth.api";
import Button from "src/components/Button";
import Input from "src/components/Input";
import { AppContext } from "src/contexts/app.context";
import { SuccesRessponse } from "src/types/ultils.type";
import { schema, Schema } from "src/utils/rules";
import { isAxiosUnprocessableEntityError } from "src/utils/ultils";


type FormData = Omit<Schema, 'confirm_password'>

const loginSchema = schema.omit(['confirm_password'])
export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const logintMutatuin = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {

    logintMutatuin.mutate(data, {
      onSuccess: (data) => {
        console.log(data)
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError<SuccesRessponse<FormData>>(error)) {
          const formError = error.response?.data.data

          if (formError) {
            Object.keys(formError).forEach(key => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })




  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py:32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form action='' className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Login</div>
              <Input
                name='email'
                register={register}
                type='email'
                className='mt-8'
                errorMessage={errors.email?.message}
              // rules={rules.email}
              />
              <Input
                name='password'
                register={register}
                type='password'
                className='mt-8'
                errorMessage={errors.password?.message}
                // rules={rules.password}
                placeholder='Password'
                autoComplte='on'
              />
              <div className='mt-3'>
                <Button type="submit" className='w-full text-center py-4 uppercase bg-red-500 text-white text-sm flex justify-center items-center' isLoading={logintMutatuin.isPending}

                  disabled={logintMutatuin.isPending}>Đăng Nhập</Button>
              </div>
              <div className='mt-8 '>
                <div className='flex items-center text-center justify-center'>
                  <span className='text-slate-400'>Bạn chưa có tài khoản</span>
                  <Link className='text-red-400 ml-1' to={'/register'}>
                    Đăng kí
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
