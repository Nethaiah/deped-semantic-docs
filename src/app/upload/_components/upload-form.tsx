"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { uploadSchema, type UploadSchema } from "@/lib/zodSchema"
import FileUpload from "@/components/file-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DatePickerComponent from "@/components/date-picker"
import { parseDate } from "@internationalized/date"

export default function UploadForm() {
  const form = useForm<UploadSchema>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      docType: "",
      title: "",
      issuanceNumber: "",
      issuanceDate: "",
      audience: [],
    },
  })

  const onSubmit = (values: UploadSchema) => {
    form.clearErrors()
    console.log("Form submitted:", values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column - Metadata */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Document Metadata</h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Controller
                  control={form.control}
                  name="docType"
                  render={({ field }) => (
                    <>
                      <label htmlFor="docType" className="block text-sm font-medium text-gray-700">
                        Document Type <span className="text-red-500">*</span>
                      </label>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#333DAD]"
                          aria-invalid={!!form.formState.errors.docType}
                        >
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="memorandum">Memorandum</SelectItem>
                          <SelectItem value="order">Order</SelectItem>
                          <SelectItem value="advisory">Advisory</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.docType && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.docType.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  {...form.register("title")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#333DAD]"
                  placeholder="e.g., Guidance on the Use of LDM 2 Modules"
                />
                {form.formState.errors.title && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="issuanceNumber" className="block text-sm font-medium text-gray-700">
                  Issuance Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="issuanceNumber"
                  type="text"
                  {...form.register("issuanceNumber")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#333DAD]"
                  placeholder="e.g., DDO 231-246"
                />
                {form.formState.errors.issuanceNumber && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.issuanceNumber.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="issuanceDate" className="block text-sm font-medium text-gray-700">
                  Issuance Date <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={form.control}
                  name="issuanceDate"
                  render={({ field }) => (
                    <>
                      <DatePickerComponent
                        label={null}
                        value={field.value ? parseDate(field.value) : null}
                        onChange={(val) => field.onChange(val ? val.toString() : "")}
                      />
                      {form.formState.errors.issuanceDate && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.issuanceDate.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - File Upload & Target Audience */}
        <div className="space-y-6">
          {/* Document File Upload */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Document File (PDF Only)</h2>
            <FileUpload />
          </div>

          {/* Target Audience */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Target Audience</h3>
            <div className="space-y-2">
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  value="all"
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#333DAD] focus:ring-[#333DAD]"
                  {...form.register("audience")}
                />
                <span>Select All</span>
              </label>
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  value="schools"
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#333DAD] focus:ring-[#333DAD]"
                  {...form.register("audience")}
                />
                <span>All Schools Levels</span>
              </label>
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  value="internal"
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#333DAD] focus:ring-[#333DAD]"
                  {...form.register("audience")}
                />
                <span>Division Internal Staff Only</span>
              </label>
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  value="district"
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#333DAD] focus:ring-[#333DAD]"
                  {...form.register("audience")}
                />
                <span>Specific District Zones</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-[#333DAD] px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-[#2c3494] disabled:opacity-60"
        >
          Publish Document
        </button>
      </div>
    </form>
  )
}
