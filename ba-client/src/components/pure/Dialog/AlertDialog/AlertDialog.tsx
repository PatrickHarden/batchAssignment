import React, { useState, FunctionComponent } from 'react';
import * as RadixAlertDialog from '@radix-ui/react-alert-dialog';
import styles from './AlertDialog.module.scss';
import { ReactComponent as WarningTip } from '../../../../assets/icons/warning-tip.svg';

export interface AlertDialogProps extends RadixAlertDialog.AlertDialogProps {
  TriggerButtonText?: string;
  triggerStyle?: string; // e.g. 'button--white-red' default is a transparent background with text button
  header: React.ReactNode;
  subHeader?: string;
  content: string;
  cancelButtonText: string;
  actionButtonText: string;
  isOpen?: boolean;
  disableActionButton?: boolean;
  onCancel?: React.MouseEventHandler<HTMLButtonElement>;
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
  onDialogChange?: (isChanged: boolean) => void;
}

const AlertDialog: FunctionComponent<AlertDialogProps> = ({
  TriggerButtonText,
  triggerStyle,
  header,
  subHeader,
  content,
  cancelButtonText,
  actionButtonText,
  isOpen,
  onAction,
  onCancel,
  onDialogChange,
  disableActionButton
}: AlertDialogProps) => {
  const [open, setOpen] = useState(isOpen);

  return (
    <RadixAlertDialog.Root open={open} onOpenChange={onDialogChange ?? setOpen}>
      {TriggerButtonText ? (
        <RadixAlertDialog.Trigger
          className={` ${triggerStyle ? triggerStyle : styles.TriggerButtonText}`}
        >
          {TriggerButtonText}
        </RadixAlertDialog.Trigger>
      ) : null}
      <RadixAlertDialog.Portal>
        <RadixAlertDialog.Overlay className={styles.AlertDialogOverlay} />
        <RadixAlertDialog.Content className={styles.AlertDialogContent}>
          <RadixAlertDialog.Title className={styles.AlertDialogTitle}>
            <WarningTip className={styles.warningIcon} />
            {header}
          </RadixAlertDialog.Title>
          {subHeader && <RadixAlertDialog.Description>{subHeader}</RadixAlertDialog.Description>}
          <p>{content}</p>
          <div className={styles.footerButtons}>
            <RadixAlertDialog.Cancel onClick={onCancel} className="button--white-red">
              {cancelButtonText}
            </RadixAlertDialog.Cancel>
            <RadixAlertDialog.Action
              onClick={onAction}
              disabled={disableActionButton}
              className="button--clifford-red"
            >
              {actionButtonText}
            </RadixAlertDialog.Action>
          </div>
        </RadixAlertDialog.Content>
      </RadixAlertDialog.Portal>
    </RadixAlertDialog.Root>
  );
};

export default AlertDialog;
