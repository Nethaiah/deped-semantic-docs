"use client"

import { CalendarIcon } from "lucide-react"
import {
  Button,
  DatePicker,
  Dialog,
  Group,
  Label,
  Popover,
} from "react-aria-components"

import { Calendar } from "@/components/ui/calendar-rac"
import { DateInput } from "@/components/ui/datefield-rac"
import type { DateValue } from "@internationalized/date"

export default function DatePickerComponent({
  value,
  onChange,
  label = "Date picker",
}: {
  value?: DateValue | null
  onChange?: (value: DateValue | null) => void
  label?: React.ReactNode
}) {
  return (
    <DatePicker className="*:not-first:mt-2" value={value ?? undefined} onChange={onChange}>
      {label ? (
        <Label className="text-sm font-medium text-foreground">{label}</Label>
      ) : null}
      <div className="flex">
        <Group className="w-full">
          <DateInput className="pe-9" />
        </Group>
        <Button className="z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50">
          <CalendarIcon size={16} />
        </Button>
      </div>
      <Popover
        className="z-50 rounded-lg border bg-background text-popover-foreground shadow-lg outline-hidden data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
        offset={4}
      >
        <Dialog className="max-h-[inherit] overflow-auto p-2">
          <Calendar />
        </Dialog>
      </Popover>
    </DatePicker>
  )
}
