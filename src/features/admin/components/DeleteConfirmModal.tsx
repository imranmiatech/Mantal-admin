import { Button } from '../../../shared/ui/Button'

type DeleteConfirmModalProps = {
  title: string
  description: string
  busy?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteConfirmModal({
  title,
  description,
  busy = false,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={busy ? undefined : onCancel}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
      >
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 id="delete-confirm-title" className="text-lg font-extrabold tracking-tight text-slate-900">
              {title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={onCancel}
            className="w-full !min-h-10 !px-4 !py-2 text-xs sm:w-fit"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            busy={busy}
            onClick={onConfirm}
            className="w-full !min-h-10 !px-4 !py-2 text-xs sm:w-fit"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
