import { Suspense } from "react"
import { LoanApplicationsEmpty } from "./components/loan-applications-empty"
import { LoanApplicationsError } from "./components/loan-applications-error"
import { LoanApplicationsHeader } from "./components/loan-applications-header"
import { LoanApplicationsLoading } from "./components/loan-applications-loading"
import { LoanApplicationsProvider } from "./components/loan-applications-provider"
import { LoanApplicationsSkeleton } from "./components/loan-applications-skeleton"
import { LoanApplicationsSuccess } from "./components/loan-applications-success"
import { LoanApplicationsToolbar } from "./components/loan-applications-toolbar"
import type { ColumnMetadata } from "./types"

export function LoanApplicationsPanel({
  columns,
}: {
  columns: ColumnMetadata[]
}) {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
      <LoanApplicationsHeader />
      <Suspense fallback={<LoanApplicationsSkeleton />}>
        <LoanApplicationsProvider columns={columns}>
          <LoanApplicationsToolbar />
          <LoanApplicationsLoading />
          <LoanApplicationsError />
          <LoanApplicationsEmpty />
          <LoanApplicationsSuccess />
        </LoanApplicationsProvider>
      </Suspense>
    </section>
  )
}
