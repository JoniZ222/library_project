import React, { useState } from 'react'
import { ExportDropdown, TableExportDropdown, ReportExportDropdown } from '@/components/ui/export-dropdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// GUÍA DE USO DEL COMPONENTE EXPORTDROPDOWN

// 1. USO BÁSICO
export function UsoBasico() {
  const [loading, setLoading] = useState(false)

  const handleExport = async (format: string) => {
    setLoading(true)
    console.log(`Exportando en formato: ${format}`)
    
    // Simular proceso de exportación
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoading(false)
    alert(`Datos exportados en formato ${format}`)
  }

  return (
    <ExportDropdown 
      onExport={handleExport} 
      loading={loading}
    />
  )
}

// 2. USO CON OPCIONES PERSONALIZADAS
export function UsoPersonalizado() {
  const [loading, setLoading] = useState(false)

  const opcionesPersonalizadas = [
    {
      label: "Exportar como CSV",
      value: "csv",
      format: "csv" as const
    },
    {
      label: "Exportar como Excel",
      value: "excel",
      format: "excel" as const
    },
    {
      label: "Exportar como PDF",
      value: "pdf",
      format: "pdf" as const
    }
  ]

  const handleExport = async (format: string) => {
    setLoading(true)
    console.log(`Exportación personalizada: ${format}`)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
  }

  return (
    <ExportDropdown 
      onExport={handleExport}
      options={opcionesPersonalizadas}
      loading={loading}
      variant="secondary"
      children="Exportar Datos"
    />
  )
}

// 3. USO PARA TABLAS (COMPONENTE ESPECÍFICO)
export function UsoParaTablas() {
  const [loading, setLoading] = useState(false)

  const handleExport = async (format: string) => {
    setLoading(true)
    
    // Aquí procesarías los datos de la tabla
    const datosTabla = [
      { id: 1, nombre: 'Dato 1', valor: 100 },
      { id: 2, nombre: 'Dato 2', valor: 200 }
    ]
    
    console.log(`Exportando tabla en ${format}:`, datosTabla)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoading(false)
  }

  return (
    <TableExportDropdown 
      onExport={handleExport}
      loading={loading}
    />
  )
}

// 4. USO PARA REPORTES (COMPONENTE ESPECÍFICO)
export function UsoParaReportes() {
  const [loading, setLoading] = useState(false)

  const handleExport = async (format: string) => {
    setLoading(true)
    
    // Aquí generarías el reporte
    const reporte = {
      titulo: 'Reporte Mensual',
      fecha: new Date().toLocaleDateString(),
      datos: { total: 1000, promedio: 50 }
    }
    
    console.log(`Generando reporte en ${format}:`, reporte)
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    setLoading(false)
  }

  return (
    <ReportExportDropdown 
      onExport={handleExport}
      loading={loading}
    />
  )
}

// 5. EJEMPLO COMPLETO CON MÚLTIPLES BOTONES
export function EjemploCompleto() {
  const [loadingStates, setLoadingStates] = useState({
    usuarios: false,
    productos: false,
    ventas: false
  })

  const handleExport = async (tipo: string, format: string) => {
    setLoadingStates(prev => ({ ...prev, [tipo]: true }))
    
    console.log(`Exportando ${tipo} en formato ${format}`)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoadingStates(prev => ({ ...prev, [tipo]: false }))
    alert(`${tipo} exportados exitosamente`)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Panel de Exportaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <ExportDropdown
              onExport={(format) => handleExport('usuarios', format)}
              loading={loadingStates.usuarios}
              variant="outline"
              children="Exportar Usuarios"
            />
            
            <ExportDropdown
              onExport={(format) => handleExport('productos', format)}
              loading={loadingStates.productos}
              variant="secondary"
              children="Exportar Productos"
            />
            
            <ExportDropdown
              onExport={(format) => handleExport('ventas', format)}
              loading={loadingStates.ventas}
              variant="default"
              children="Exportar Ventas"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// PROPIEDADES DEL COMPONENTE:
/*
ExportDropdown Props:
- onExport: (format: string) => void - Función que se ejecuta al seleccionar un formato
- options?: ExportOption[] - Opciones personalizadas de exportación
- variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" - Estilo del botón
- size?: "default" | "sm" | "lg" | "icon" - Tamaño del botón
- className?: string - Clases CSS adicionales
- disabled?: boolean - Deshabilitar el botón
- loading?: boolean - Mostrar estado de carga
- children?: React.ReactNode - Texto personalizado del botón

ExportOption Interface:
- label: string - Texto de la opción
- value: string - Valor de la opción
- icon?: React.ComponentType - Icono opcional
- format: 'csv' | 'excel' | 'pdf' | 'json' | 'xml' | 'image' - Tipo de formato
- disabled?: boolean - Deshabilitar la opción
*/ 