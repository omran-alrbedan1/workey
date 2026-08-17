import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Calendar, Clock, Edit2, FileText, Plus, XCircle, Download, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/shared/badges"
import { useInformationRequests, useDownloadAttachment } from "../hooks/useInformationRequests"
import InformationRequestDialog from "./InformationRequestDialog"
import { keyOf } from "@/lib/keyValue"
import { showErrorToast } from "@/lib/toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import type { InformationRequest } from "../types/employerApplicants.types"

export default function InformationRequests({ applicationId }: { applicationId: string | number }) {
  const { t } = useTranslation("employerApplicants")
  const {
    requests,
    isLoading,
    createRequest,
    updateRequest,
    cancelRequest,
    isCreating,
    isUpdating,
    isCancelling,
  } = useInformationRequests(applicationId)
  const { downloadAttachment } = useDownloadAttachment()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<InformationRequest | null>(null)
  const [cancelRequestId, setCancelRequestId] = useState<InformationRequest | null>(null)
  const [cancelReason, setCancelReason] = useState("")

  const handleCreate = () => {
    setEditingRequest(null)
    setDialogOpen(true)
  }

  const handleEdit = (request: InformationRequest) => {
    setEditingRequest(request)
    setDialogOpen(true)
  }

  const handleCancel = (request: InformationRequest) => {
    setCancelRequestId(request)
    setCancelReason("")
  }

  const handleSubmit = async (input: any) => {
    if (editingRequest) {
      await updateRequest({ requestId: editingRequest.id, input })
      setDialogOpen(false)
    } else {
      await createRequest(input)
      setDialogOpen(false)
    }
  }

  const handleConfirmCancel = async () => {
    if (cancelRequestId && cancelReason.trim()) {
      try {
        await cancelRequest({ requestId: cancelRequestId.id, input: { reason: cancelReason.trim() } })
        setCancelRequestId(null)
        setCancelReason("")
      } catch (error: any) {
        const code = error?.code ?? error?.response?.data?.code
        if (code === "APPLICATION_INFORMATION_REQUEST_NOT_PENDING") {
          showErrorToast("Cannot cancel - request is not pending")
        } else {
          showErrorToast(error?.message || "Failed to cancel information request")
        }
      }
    }
  }

  const canCreate = !requests.some((r) => keyOf(r.status) === "pending")

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            {t("informationRequests.title")}
          </CardTitle>
          <Button size="sm" className="text-white" onClick={handleCreate} disabled={isCreating || !canCreate}>
            <Plus className="h-4 w-4 mr-2" />
            {t("informationRequests.addRequest")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {requests.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">{t("informationRequests.empty")}</p>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="rounded-lg border border-border bg-background p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-text-primary">{String(request.message || "")}</p>
                    <div className="flex flex-wrap gap-2">
                      {request.requested_items?.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-xs"
                        >
                          {String(item.label || "")}
                          {item.is_required && <span className="text-red-500">*</span>}
                        </span>
                      ))}
                    </div>
                    {request.response && (
                      <div className="mt-3 rounded-lg border border-border bg-background/50 p-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                          <MessageCircle className="h-4 w-4 text-primary" />
                          {t("informationRequests.responseTitle")}
                        </div>
                        {request.response.message && (
                          <p className="text-sm text-text-secondary">{request.response.message}</p>
                        )}
                            {request.response.attachments && request.response.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {request.response.attachments.map((attachment) => (
                                  <Button
                                    key={attachment.id}
                                    size="sm"
                                    variant="outline"
                                    onClick={() => downloadAttachment(attachment.id, attachment.original_name)}
                                    disabled={attachment.download_available === false}
                                    className="gap-1"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    {attachment.original_name}
                                  </Button>
                                ))}
                              </div>
                            )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {keyOf(request.status) === "pending" && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleEdit(request)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-red-600 hover:text-red-700"
                          onClick={() => handleCancel(request)}
                          disabled={isCancelling}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <StatusBadge status={request.status || "pending"} variant="soft" />
                  {request.due_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(request.due_at).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {request.created_at
                        ? new Date(request.created_at).toLocaleString()
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <InformationRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        request={editingRequest}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
      <Dialog
        open={cancelRequestId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCancelRequestId(null)
            setCancelReason("")
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("informationRequests.cancelTitle")}</DialogTitle>
            <DialogDescription>
              {t("informationRequests.cancelDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder={t("informationRequests.cancelReasonPlaceholder")}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelRequestId(null)
                setCancelReason("")
              }}
              disabled={isCancelling}
            >
              {t("actions.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isCancelling || !cancelReason.trim()}
            >
              {isCancelling ? t("actions.processing") : t("actions.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
