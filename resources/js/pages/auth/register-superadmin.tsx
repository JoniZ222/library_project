import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function RegisterSuperadmin() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register.superadmin'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <AuthLayout title='Crear superadministrador' description='Crea un superadministrador para tu sistema'>
            <Head title='Crear superadministrador' />
            <form className='flex flex-col gap-6' onSubmit={submit}>
                <div className='grid gap-6'>
                    <div className='grid gap-2'>
                        <Label htmlFor='name' className='text-green-800 font-semibold'>Nombre</Label>
                        <Input
                            id='name'
                            type='text'
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete='name'
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder='Nombre completo'
                        />
                        <InputError message={errors.name} className='mt-2' />
                    </div>

                    <div className='grid gap-2'>
                        <Label htmlFor='email' className='text-green-800 font-semibold'>Correo electrónico</Label>
                        <Input
                            id='email'
                            type='email'
                            required
                            autoFocus
                            tabIndex={2}
                            autoComplete='email'
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder='Correo electrónico'
                        />
                        <InputError message={errors.email} className='mt-2' />
                    </div>

                    <div className='grid gap-2'>
                        <Label htmlFor='password' className='text-green-800 font-semibold'>Contraseña</Label>
                        <Input
                            id='password'
                            type='password'
                            required
                            tabIndex={3}
                            autoComplete='new-password'
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder='Contraseña'
                        />
                        <InputError message={errors.password} className='mt-2' />
                    </div>

                    <div className='grid gap-2'>
                        <Label htmlFor='password_confirmation' className='text-green-800 font-semibold'>Confirmar contraseña</Label>
                        <Input
                            id='password_confirmation'
                            type='password'
                            required
                            tabIndex={4}
                            autoComplete='new-password'
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder='Confirmar contraseña'
                        />
                        <InputError message={errors.password_confirmation} className='mt-2' />
                    </div>

                    <Button type='submit' className='w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition-colors duration-200' disabled={processing}>
                        {processing && (
                            <LoaderCircle className='w-4 h-4 animate-spin' />
                        )}
                        Crear superadministrador
                    </Button>

                    <TextLink href={route('login')} className='text-center text-green-900 hover:text-green-900 font-medium'>
                        Ya tienes una cuenta? Inicia sesión
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}