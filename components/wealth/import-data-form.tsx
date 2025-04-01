"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { X, Upload, FileText, Check, AlertCircle } from "lucide-react"
import { useData } from "./data-provider"

interface ImportDataFormProps {
  onClose: () => void
  className?: string
}

export default function ImportDataForm({ onClose, className }: ImportDataFormProps) {
  const { refreshData } = useData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [importType, setImportType] = useState<"accounts" | "transactions">("transactions")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      if (!file) {
        throw new Error("Please select a file to import")
      }

      // Check file type
      if (!file.name.endsWith(".csv") && !file.name.endsWith(".json")) {
        throw new Error("Only CSV and JSON files are supported")
      }

      // Read file content
      const fileContent = await readFileContent(file)

      // Parse file content based on file type
      let data
      try {
        if (file.name.endsWith(".json")) {
          data = JSON.parse(fileContent)
        } else {
          // Simple CSV parsing (in a real app, use a proper CSV parser)
          data = parseCSV(fileContent)
        }
      } catch (err) {
        throw new Error("Failed to parse file. Please check the file format.")
      }

      // Send data to API
      const response = await fetch(`/api/${importType}/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to import ${importType}`)
      }

      // Show success message
      setSuccess(`Successfully imported ${data.length || 0} ${importType}`)

      // Refresh dashboard data
      await refreshData()

      // Close form after 2 seconds
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to read file content
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = (e) => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  // Simple CSV parser
  const parseCSV = (content: string) => {
    const lines = content.split("\n")
    const headers = lines[0].split(",")

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",")
        const entry: Record<string, string> = {}

        headers.forEach((header, index) => {
          entry[header.trim()] = values[index]?.trim() || ""
        })

        return entry
      })
  }

  return (
    <div className={cn("bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Import Data</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-danger-50 dark:bg-danger-500/20 text-danger-500 dark:text-danger-500 text-sm rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-success-50 dark:bg-success-500/20 text-success-500 dark:text-success-500 text-sm rounded-md flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              What would you like to import?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setImportType("transactions")}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm",
                  importType === "transactions"
                    ? "border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                    : "border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800",
                )}
              >
                <span>Transactions</span>
              </button>
              <button
                type="button"
                onClick={() => setImportType("accounts")}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm",
                  importType === "accounts"
                    ? "border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                    : "border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800",
                )}
              >
                <span>Accounts</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload File (CSV or JSON)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".csv,.json"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">CSV or JSON up to 10MB</p>
              </div>
            </div>
            {file && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FileText className="w-4 h-4" />
                <span>{file.name}</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {importType === "transactions" ? (
                <>
                  For transactions, your CSV or JSON should include: <strong>title</strong>, <strong>amount</strong>,{" "}
                  <strong>type</strong> (incoming/outgoing), <strong>category</strong>, and <strong>accountId</strong>.
                </>
              ) : (
                <>
                  For accounts, your CSV or JSON should include: <strong>title</strong>, <strong>description</strong>,{" "}
                  <strong>balance</strong>, and <strong>type</strong> (savings/checking/investment/debt).
                </>
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || !file}
            className={cn(
              "flex-1 px-4 py-2 bg-brand-600 dark:bg-brand-600 text-white dark:text-white rounded-md text-sm font-medium",
              "hover:bg-brand-700 dark:hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500",
              (isSubmitting || !file) && "opacity-70 cursor-not-allowed",
            )}
          >
            {isSubmitting ? "Importing..." : "Import Data"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 
                    rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

