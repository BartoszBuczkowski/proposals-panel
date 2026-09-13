import { LoanApplicationsPanel } from "@/features/loan-applications/loan-applications-panel"
import { readColumns } from "@/features/loan-applications/functions/read-columns"

export const revalidate = 3600

export default async function Home() {
  const columns = await readColumns()
  return <LoanApplicationsPanel columns={columns} />
}
