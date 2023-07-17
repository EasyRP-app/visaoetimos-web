import React from 'react'

import { useRouter } from 'next/router'

import FormProvider from '../../app/atomic/organisms/FormProvider'
import { LoginTemplate } from '../../app/atomic/templates/LoginTemplate'
import { useAuthHook } from '../../app/features/auth/hooks/useAuthHook'

const LoginScreen = () => {
  const { authenticate } = useAuthHook()
  const router = useRouter()

  return (
    <FormProvider
      initialValues={{
        email: '',
        password: null,
      }}
      onSubmit={async (values: any) => {
        const data = await authenticate({
          data: {
            email: values.email,
            password: values.password,
          },
        })
        if (data) {
          router.push('/admin/dashboard')
        }
      }}
    >
      <LoginTemplate />
    </FormProvider>
  )
}

export default LoginScreen
