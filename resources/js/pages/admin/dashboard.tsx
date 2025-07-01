import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";
import AdminLayout from "@/layouts/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: "/admin/dashboard" }
];

export default function AdminDashboard() {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 px-4 py-6">
                {/* Header del Dashboard */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
                        <p className="text-muted-foreground mt-1">Panel de control y gestión del sistema de biblioteca</p>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                        Administrador
                    </Badge>
                </div>

                {/* Estadísticas Principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total de Usuarios */}
                    <Card className="bg-card/90 backdrop-blur-sm border border-border/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total de Usuarios
                            </CardTitle>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-full flex items-center justify-center border border-blue-200/50 dark:border-blue-800/30">
                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">1,234</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600 dark:text-green-400">+12%</span> desde el mes pasado
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total de Libros */}
                    <Card className="bg-card/90 backdrop-blur-sm border border-border/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total de Libros
                            </CardTitle>
                            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 rounded-full flex items-center justify-center border border-green-200/50 dark:border-green-800/30">
                                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">5,678</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600 dark:text-green-400">+8%</span> desde el mes pasado
                            </p>
                        </CardContent>
                    </Card>

                    {/* Préstamos Activos */}
                    <Card className="bg-card/90 backdrop-blur-sm border border-border/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Préstamos Activos
                            </CardTitle>
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-full flex items-center justify-center border border-purple-200/50 dark:border-purple-800/30">
                                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">234</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-orange-600 dark:text-orange-400">+5%</span> desde el mes pasado
                            </p>
                        </CardContent>
                    </Card>

                    {/* Reservas Pendientes */}
                    <Card className="bg-card/90 backdrop-blur-sm border border-border/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Reservas Pendientes
                            </CardTitle>
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 rounded-full flex items-center justify-center border border-orange-200/50 dark:border-orange-800/30">
                                <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">45</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-red-600 dark:text-red-400">-3%</span> desde el mes pasado
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sección de Acciones Rápidas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gestión de Usuarios */}
                    <Card className="bg-card/90 backdrop-blur-sm border border-border/60 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-full flex items-center justify-center border border-blue-200/50 dark:border-blue-800/30">
                                    <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                Gestión de Usuarios
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Administra usuarios, roles y permisos del sistema.
                            </p>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 border-border/60 hover:bg-accent/50 transition-all duration-200"
                                >
                                    Ver Usuarios
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="flex-1 border-border/60 hover:bg-accent/50 transition-all duration-200"
                                >
                                    Crear Usuario
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gestión de Biblioteca */}
                    <Card className="bg-card/90 backdrop-blur-sm border border-border/60 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 rounded-full flex items-center justify-center border border-green-200/50 dark:border-green-800/30">
                                    <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                Gestión de Biblioteca
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Gestiona libros, préstamos, devoluciones y reservas.
                            </p>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 border-border/60 hover:bg-accent/50 transition-all duration-200"
                                >
                                    Ver Libros
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="flex-1 border-border/60 hover:bg-accent/50 transition-all duration-200"
                                >
                                    Ver Préstamos
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Información del Sistema */}
                <Card className="bg-card/90 backdrop-blur-sm border border-border/60 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-full flex items-center justify-center border border-purple-200/50 dark:border-purple-800/30">
                                <svg className="w-3 h-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            Información del Sistema
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="p-3 bg-muted/40 rounded-lg border border-border/60">
                                <p className="font-medium text-foreground">Versión del Sistema</p>
                                <p className="text-muted-foreground">v2.1.0</p>
                            </div>
                            <div className="p-3 bg-muted/40 rounded-lg border border-border/60">
                                <p className="font-medium text-foreground">Última Actualización</p>
                                <p className="text-muted-foreground">Hace 2 días</p>
                            </div>
                            <div className="p-3 bg-muted/40 rounded-lg border border-border/60">
                                <p className="font-medium text-foreground">Estado del Sistema</p>
                                <p className="text-green-600 dark:text-green-400 font-medium">Operativo</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}