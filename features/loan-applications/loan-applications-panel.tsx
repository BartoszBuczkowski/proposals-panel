"use client"

import { LoanApplicationsEmpty } from "./components/loan-applications-empty"
import { LoanApplicationsError } from "./components/loan-applications-error"
import { LoanApplicationsLoading } from "./components/loan-applications-loading"
import { LoanApplicationsProvider } from "./components/loan-applications-provider"
import { LoanApplicationsSuccess } from "./components/loan-applications-success"
import { LoanApplicationsToolbar } from "./components/loan-applications-toolbar"

export function LoanApplicationsPanel() {
  return (
    <LoanApplicationsProvider>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Loan applications
          </h1>
          <p className="text-sm text-muted-foreground">
            Columns, labels, and row actions come from backend metadata.
          </p>
        </header>
        <LoanApplicationsToolbar />
        <LoanApplicationsLoading />
        <LoanApplicationsError />
        <LoanApplicationsEmpty />
        <LoanApplicationsSuccess />
      </section>
    </LoanApplicationsProvider>
  )
}
