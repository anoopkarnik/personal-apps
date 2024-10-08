import  { useState } from 'react'
import {z} from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../molecules/shadcn/Card';
import { useTransition } from 'react';
import { Button } from '../../atoms/shadcn/Button';
import {  ResetPasswordSettingsSchema } from '@repo/zod/index'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../molecules/shadcn/Form"
import { Input } from '../../atoms/shadcn/Input';
import { FormResult } from '../auth/FormResult';

interface ResetPasswordSettingsCardProps {
    errorMessage?:string;  
    successMessage?:string;
    email?:string;
    resetFunction?:any;
}

const ResetPasswordSettingsCard = ({email,resetFunction}
  :ResetPasswordSettingsCardProps
) => {
  const form = useForm<z.infer<typeof ResetPasswordSettingsSchema>>({
    resolver: zodResolver(ResetPasswordSettingsSchema),
    defaultValues:{
      currentPassword: '',
      newPassword: '',
    },
  })
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const [isPending, startTransition] = useTransition()

  function handleSubmit(data: z.infer<typeof ResetPasswordSettingsSchema>) {
    setError("")
    setSuccess("")
    startTransition(()=>{
      resetFunction(email,data.currentPassword,data.newPassword)
      .then((data:any)=>{
            setError(data?.error);
            setSuccess(data?.success);
      })
    })
  }
  return (
    <Card className=''>
        <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter New Password</CardDescription>
        </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
            <div className='space-y-4 mb-4'>
              <FormField control={form.control} name="currentPassword" render={({field})=>(
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} className='' type="password" placeholder='******' {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>
            <FormField control={form.control} name="newPassword" render={({field})=>(
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} className='' type="password" placeholder='******' {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>
            </div>
            <FormResult type="error" message={error }/>
            <FormResult type="success" message={success}/>
            <Button  disabled={isPending} className='bg-black text-white w-full ' variant="default" type="submit">Change Password</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ResetPasswordSettingsCard;