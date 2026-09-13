import { LoanApplicationsEmpty } from "./components/loan-applications-empty"
import { LoanApplicationsError } from "./components/loan-applications-error"
import { LoanApplicationsHeader } from "./components/loan-applications-header"
import { LoanApplicationsLoading } from "./components/loan-applications-loading"
import { LoanApplicationsProvider } from "./components/loan-applications-provider"
import { LoanApplicationsSuccess } from "./components/loan-applications-success"
import { LoanApplicationsToolbar } from "./components/loan-applications-toolbar"

export function LoanApplicationsPanel() {
  return (
    <LoanApplicationsProvider>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
        <LoanApplicationsHeader />
        <LoanApplicationsToolbar />
        <LoanApplicationsLoading />
        <LoanApplicationsError />
        <LoanApplicationsEmpty />
        <LoanApplicationsSuccess />
      </section>
    </LoanApplicationsProvider>
  )
}
