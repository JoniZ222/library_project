import React, { useState } from 'react'
import { ExportDropdown, TableExportDropdown, ReportExportDropdown } from '@/components/ui/export-dropdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Ejemplo 1: Uso básico del ExportDropdown
export function BasicExportExample() {
  const [loading, setLoading] = useState(false)

  const handleExport = async (format: string) => {
    setLoading(true)
    console.log(`Exportando datos en formato: ${format}`)
    
    // Simular proceso de exportación
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoading(false)
    alert(`Datos exportados exitosamente en formato ${format}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportación Básica</CardTitle>
      </CardHeader>
      <CardContent>
        <ExportDropdown onExport={handleExport} loading={loading} />
      </CardContent>
    </Card>
  )
}

// Ejemplo 2: Exportación de tabla de datos
export function TableExportExample() {
  const [loading, setLoading] = useState(false)

  const handleTableExport = async (format: string) => {
    setLoading(true)
    
    // Aquí iría la lógica para exportar los datos de la tabla
    const tableData = [
      { id: 1, nombre: 'Libro 1', autor: 'Autor 1', categoria: 'Ficción' },
      { id: 2, nombre: 'Libro 2', autor: 'Autor 2', categoria: 'No Ficción' },
    ]   
    
    console.log(`Exportando tabla en formato: ${format}`, tableData)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setLoading(false)
    alert(`Tabla exportada en formato ${format}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportación de Tabla</CardTitle>
      </CardHeader>
      <CardContent>
        <TableExportDropdown onExport={handleTableExport} loading={loading} />
      </CardContent>
    </Card>
  )
}

// Ejemplo 3: Exportación de reportes
export function ReportExportExample() {
  const [loading, setLoading] = useState(false)

  const handleReportExport = async (format: string) => {
    setLoading(true)
    
    // Lógica para generar y exportar reportes
    const reportData = {
      titulo: 'Reporte de Préstamos',
      fecha: new Date().toLocaleDateString(),
      datos: { prestamos: 150, devoluciones: 120, pendientes: 30 }
    }
    
    console.log(`Exportando reporte en formato: ${format}`, reportData)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setLoading(false)
    alert(`Reporte exportado en formato ${format}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportación de Reportes</CardTitle>
      </CardHeader>
      <CardContent>
        <ReportExportDropdown onExport={handleReportExport} loading={loading} />
      </CardContent>
    </Card>
  )
}

// Ejemplo 4: ExportDropdown personalizado con opciones específicas
export function CustomExportExample() {
  const [loading, setLoading] = useState(false)

  const customOptions = [
    {
      label: "Exportar como XML",
      value: "xml",
      format: "xml" as const
    },
    {
      label: "Exportar como JSON",
      value: "json", 
      format: "json" as const
    },
    {
      label: "Exportar como CSV (solo datos)",
      value: "csv-simple",
      format: "csv" as const
    }
  ]

  const handleCustomExport = async (format: string) => {
    setLoading(true)
    console.log(`Exportación personalizada en formato: ${format}`)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportación Personalizada</CardTitle>
      </CardHeader>
      <CardContent>
        <ExportDropdown 
          onExport={handleCustomExport}
          options={customOptions}
          loading={loading}
          variant="secondary"
          children="Exportar Datos"
        />
      </CardContent>
    </Card>
  )
}

// Ejemplo 5: Múltiples botones de exportación en una página
export function MultipleExportExample() {
  const [loadingStates, setLoadingStates] = useState({
    books: false,
    loans: false,
    users: false
  })

  const handleExport = async (type: string, format: string) => {
    setLoadingStates(prev => ({ ...prev, [type]: true }))
    
    console.log(`Exportando ${type} en formato ${format}`)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setLoadingStates(prev => ({ ...prev, [type]: false }))
    alert(`${type} exportados en formato ${format}`)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Panel de Exportaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <ExportDropdown
              onExport={(format) => handleExport('libros', format)}
              loading={loadingStates.books}
              variant="outline"
              children="Exportar Libros"
            />
            
            <ExportDropdown
              onExport={(format) => handleExport('préstamos', format)}
              loading={loadingStates.loans}
              variant="secondary"
              children="Exportar Préstamos"
            />
            
            <ExportDropdown
              onExport={(format) => handleExport('usuarios', format)}
              loading={loadingStates.users}
              variant="default"
              children="Exportar Usuarios"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Ejemplo 6: Integración en una tabla de datos
export function TableWithExportExample() {
  const [loading, setLoading] = useState(false)

  const handleExport = async (format: string) => {
    setLoading(true)
    // Lógica para exportar los datos de la tabla actual
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lista de Libros</CardTitle>
        <TableExportDropdown onExport={handleExport} loading={loading} />
      </CardHeader>
      <CardContent>
        {/* Aquí iría tu tabla de datos */}
        <div className="text-muted-foreground">
          Contenido de la tabla aquí...
        </div>
      </CardContent>
    </Card>
  )
} 