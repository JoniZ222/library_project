import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import SettingsPublicLayout from '@/layouts/settings-public/layout-public';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AdminLayout from '@/layouts/admin-layout';
import LibrarianSidebarLayout from '@/layouts/librarian/librarian-sidebar-layout';
import PublicLayout from '@/layouts/public-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ajustes de contraseña',
        href: '/settings/password',
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    // Obtenemos el usuario autenticado desde la página
    const { auth } = usePage().props as any;

    // Determinamos el layout según el rol del usuario
    let ParentLayout: React.ComponentType<any> = AppLayout;
    let SettingsLayoutComponent: React.ComponentType<any> = SettingsLayout;

    if (auth?.user?.role === 'admin') {
        ParentLayout = AdminLayout;
        SettingsLayoutComponent = SettingsLayout;
    } else if (auth?.user?.role === 'librarian') {
        ParentLayout = LibrarianSidebarLayout;
        SettingsLayoutComponent = SettingsLayout;
    } else if (auth?.user?.role === 'reader_public') {
        ParentLayout = PublicLayout;
        SettingsLayoutComponent = SettingsPublicLayout;
    } else if (auth?.user?.role === 'reader_private') {
        ParentLayout = PublicLayout;
        SettingsLayoutComponent = SettingsPublicLayout;
    }

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <ParentLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajustes de contraseña" />

            <SettingsLayoutComponent>
                <div className="space-y-6">
                    <HeadingSmall title="Actualizar contraseña" description="Asegúrate de que tu cuenta use una contraseña larga y aleatoria para mantener la seguridad" />

                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="current_password">Contraseña actual</Label>

                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                placeholder="Contraseña actual"
                            />

                            <InputError message={errors.current_password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Nueva contraseña</Label>

                            <Input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder="Nueva contraseña"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirmar contraseña</Label>

                            <Input
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder="Confirmar contraseña"
                            />

                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Guardar contraseña</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Guardado</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayoutComponent>
        </ParentLayout>
    );
}
