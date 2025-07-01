import * as React from "react"
import { Download, FileText, FileSpreadsheet, FileImage, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface ExportOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  format: 'csv' | 'excel' | 'pdf' | 'json' | 'xml' | 'image'
  disabled?: boolean
}

interface ExportDropdownProps {
  onExport: (format: string) => void
  options?: ExportOption[]
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  disabled?: boolean
  loading?: boolean
  children?: React.ReactNode
}

const defaultExportOptions: ExportOption[] = [
  {
    label: "Exportar como CSV",
    value: "csv",
    icon: FileText,
    format: "csv"
  },
  {
    label: "Exportar como Excel",
    value: "excel",
    icon: FileSpreadsheet,
    format: "excel"
  },
  {
    label: "Exportar como PDF",
    value: "pdf",
    icon: FileText,
    format: "pdf"
  },
  {
    label: "Exportar como JSON",
    value: "json",
    icon: FileText,
    format: "json"
  }
]

export function ExportDropdown({
  onExport,
  options = defaultExportOptions,
  variant = "outline",
  size = "default",
  className,
  disabled = false,
  loading = false,
  children
}: ExportDropdownProps) {
  const handleExport = (format: string) => {
    if (!loading && !disabled) {
      onExport(format)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("gap-2", className)}
          disabled={disabled || loading}
        >
          {loading ? (
            <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Download className="size-4" />
          )}
          {children || "Exportar"}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {options.map((option, index) => (
          <React.Fragment key={option.value}>
            <DropdownMenuItem
              onClick={() => handleExport(option.value)}
              disabled={option.disabled || disabled || loading}
              className="gap-2"
            >
              {option.icon && <option.icon className="size-4" />}
              {option.label}
            </DropdownMenuItem>
            {index < options.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Componente específico para exportación de datos de tabla
export function TableExportDropdown({
  onExport,
  className,
  disabled = false,
  loading = false
}: Omit<ExportDropdownProps, 'options' | 'children'>) {
  const tableExportOptions: ExportOption[] = [
    {
      label: "Exportar tabla como CSV",
      value: "csv",
      icon: FileText,
      format: "csv"
    },
    {
      label: "Exportar tabla como Excel",
      value: "excel",
      icon: FileSpreadsheet,
      format: "excel"
    },
    {
      label: "Exportar tabla como PDF",
      value: "pdf",
      icon: FileText,
      format: "pdf"
    }
  ]

  return (
    <ExportDropdown
      onExport={onExport}
      options={tableExportOptions}
      className={className}
      disabled={disabled}
      loading={loading}
    >
      Exportar tabla
    </ExportDropdown>
  )
}

// Componente específico para exportación de reportes
export function ReportExportDropdown({
  onExport,
  className,
  disabled = false,
  loading = false
}: Omit<ExportDropdownProps, 'options' | 'children'>) {
  const reportExportOptions: ExportOption[] = [
    {
      label: "Exportar reporte como PDF",
      value: "pdf",
      icon: FileText,
      format: "pdf"
    },
    {
      label: "Exportar reporte como Excel",
      value: "excel",
      icon: FileSpreadsheet,
      format: "excel"
    },
    {
      label: "Exportar reporte como imagen",
      value: "image",
      icon: FileImage,
      format: "image"
    }
  ]

  return (
    <ExportDropdown
      onExport={onExport}
      options={reportExportOptions}
      className={className}
      disabled={disabled}
      loading={loading}
    >
      Exportar reporte
    </ExportDropdown>
  )
} 