import { useEffect, useRef } from 'react';
import Icon from '@/components/ui/Icon';

interface Props {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styles the confirm button as destructive. */
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * A confirmation step in front of anything that removes something.
 *
 * Built on <dialog> so the browser handles the modal semantics: focus is
 * trapped, the rest of the page is inert, and Escape closes it. Focus lands on
 * Cancel rather than Confirm, so a stray Enter keypress never deletes anything.
 */
export function ConfirmDialog({
  open, title, body, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  destructive = true, onConfirm, onCancel,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Escape and the backdrop both mean "no".
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClose = () => { if (open) onCancel(); };
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, [open, onCancel]);

  return (
    <dialog ref={ref} className="confirm" aria-labelledby="confirm-title">
      <div className="confirm__inner">
        <span className="confirm__icon" aria-hidden="true">
          <Icon name="alert" size={22} />
        </span>
        <h2 id="confirm-title">{title}</h2>
        {body && <p>{body}</p>}
        <div className="confirm__actions">
          <button type="button" className="btn btn--secondary" ref={cancelRef} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${destructive ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
