"use client"

import { useEffect, useRef, useState } from "react"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { getStatusOptions } from "../functions/filter-loan-applications"
import { useLoanApplications } from "./loan-applications-provider"

const SEARCH_DEBOUNCE_MS = 400

export function LoanApplicationsToolbar() {
  const { state, actions } = useLoanApplications()
  const statusOptions = getStatusOptions(state.columns)
  const [initialSearch] = useState(state.filters.search)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  const statusItems = [
    { label: "All statuses", value: null },
    ...statusOptions.map((option) => ({
      label: option,
      value: option,
    })),
  ]

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <FieldGroup className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <Field className="min-w-56">
          <FieldLabel htmlFor="loan-search">Search</FieldLabel>
          <Input
            id="loan-search"
            defaultValue={initialSearch}
            onChange={(event) => {
              const value = event.target.value
              if (debounceTimer.current) {
                clearTimeout(debounceTimer.current)
              }
              debounceTimer.current = setTimeout(() => {
                actions.setSearch(value)
              }, SEARCH_DEBOUNCE_MS)
            }}
            placeholder="Customer or loan ID"
          />
        </Field>
        <Field className="min-w-48">
          <FieldLabel>Status</FieldLabel>
          <Select
            items={statusItems}
            value={state.filters.status}
            onValueChange={(value) =>
              actions.setStatusFilter(
                typeof value === "string" ? value : null
              )
            }
          >
            <SelectTrigger className="w-full min-w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusItems.map((item) => (
                  <SelectItem key={String(item.value)} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={actions.reload}>
          Reload
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={actions.simulateError}
        >
          Simulate error
        </Button>
      </div>
    </div>
  )
}
