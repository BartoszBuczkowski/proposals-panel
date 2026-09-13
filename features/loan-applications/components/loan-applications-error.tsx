"use client"

import { WarningCircleIcon } from "@phosphor-icons/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useLoanApplications } from "./loan-applications-provider"

export function LoanApplicationsError() {
  const { state, actions } = useLoanApplications()
  if (state.status !== "error") return null

  return (
    <Alert variant="destructive">
      <WarningCircleIcon />
      <AlertTitle>Could not load loan applications</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>{state.errorMessage ?? "Unexpected error"}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={actions.reload}
        >
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  )
}
