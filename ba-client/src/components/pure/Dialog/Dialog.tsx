import React, { useState, FunctionComponent, useEffect } from 'react';
import * as Dialogue from '@radix-ui/react-dialog';
import styles from './Dialog.module.scss';
import { ReactComponent as XCloseIcon } from '../../../assets/icons/x-close-button.svg';

export interface DialogProps {
  title: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  openDialogButton?: React.ReactNode;
  isOpen?: boolean;
  onDialogChange?: (isChanged: boolean) => void;
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
  disableActionButton?: boolean;
}

const Dialog: FunctionComponent<DialogProps> = ({
  title,
  content,
  footer,
  openDialogButton,
  isOpen,
  onDialogChange,
  onAction,
  onCancel,
  disableActionButton = false
}: DialogProps) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialogue.Root open={open} onOpenChange={onDialogChange ?? setOpen}>
      {openDialogButton ? <Dialogue.Trigger>{openDialogButton}</Dialogue.Trigger> : null}
      <Dialogue.Portal>
        <Dialogue.Overlay className={styles.DialogOverlay} />
        <Dialogue.Content className={styles.DialogContent}>
          <Dialogue.Title className={styles.DialogTitle} data-testid="dialogTitle">
            {title}
          </Dialogue.Title>
          {content}
          {footer ? (
            <div data-testid="dialogFooter">{footer}</div>
          ) : (
            <div className={styles.CancelButtonContainer}>
              <div className={styles.DialogFooterButtons}>
                <Dialogue.Close asChild>
                  <button className="button--white-black" onClick={onCancel}>
                    Cancel
                  </button>
                </Dialogue.Close>
                <button
                  className="button--black"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    onAction?.(e);
                  }}
                  disabled={disableActionButton}
                >
                  Save
                </button>
              </div>
            </div>
          )}
          <Dialogue.Close asChild>
            <button className={styles.CloseIcon} onClick={onCancel} aria-label="Close">
              <XCloseIcon />
            </button>
          </Dialogue.Close>
        </Dialogue.Content>
      </Dialogue.Portal>
    </Dialogue.Root>
  );
};

export default Dialog;
