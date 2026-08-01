import { useQuery } from "@tanstack/react-query"
import { employerApplicantsService } from "../services/employerApplicants.service"

export function useEmployerApplicantDetail(applicationId?: string | number) {
  return useQuery({
    queryKey: ["employer", "applicants", "detail", String(applicationId ?? "")],
    queryFn: () => employerApplicantsService.getById(applicationId!),
    enabled: Boolean(applicationId),
  })
}

export function useDownloadCv() {
  return async (applicationId: string | number) => {
    const blob = await employerApplicantsService.downloadSelectedCv(applicationId)
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cv-${applicationId}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
