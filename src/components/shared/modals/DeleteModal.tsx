import { useTranslation } from 'react-i18next'
import { X, Trash2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CancelButton, SubmitButton } from '@/components/shared/buttons'

interface DeleteModalProps {
  open: boolean
  onConfirm: () => void
  onClose: () => void
  loading?: boolean
  name: string
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onConfirm,
  onClose,
  loading,
  name,
}) => {
  const { t } = useTranslation('common')

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-red-500/10">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            
            <DialogTitle className="text-xl">
              {t('modals.delete.title')}
            </DialogTitle>
            
            <DialogDescription>
              {t('modals.delete.description', { name })}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2 mt-6 w-fit mx-auto">
          <CancelButton
            onClick={onClose}
            disabled={loading}
            text={t('modals.cancel')}
            icon={<X className="h-4 w-4" />}
            className="flex-1"
          />
          <SubmitButton
            onClick={onConfirm}
            isLoading={loading}
            text={t('modals.delete.confirm')}
            loadingText={t('modals.processing')}
            icon={<Trash2 className="h-4 w-4" />}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500 flex-1"
          />
        </DialogFooter>

        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5 text-red-400" />
            <span>{t('modals.delete.hint')}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteModal
