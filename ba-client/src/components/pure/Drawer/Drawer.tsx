import React, { FunctionComponent, ReactElement, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from './Drawer.module.scss';
import { ReactComponent as XCloseIcon } from '../../../assets/icons/x-close-button.svg';
import cx from 'classix';

type DrawerChildProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type DrawerChild = React.ReactElement<DrawerChildProps>;

export interface DrawerProps {
  /**
   * Header title
   */
  title: string;
  /**
   * Header icon
   */
  headerIcon?: ReactElement;
  /**
   * Trigger icon
   */
  triggerIcon?: ReactElement;
  /**
   * Trigger button title
   */
  triggerTitle: string;
  /**
   * Drawer content
   */
  children?: DrawerChild[] | DrawerChild;
  /**
   * Custom buttons with callbacks
   */
  footer?: ReactElement;
  /**
   * Styling for the trigger button (layout, button customization)
   */
  className?: string;
  /**
   * No-op for trigger button
   */
  disabled?: boolean;
  /**
   * Controlled drawer passes down setter (open/close) to child
   */
  controlled?: boolean;
}

const Drawer: FunctionComponent<DrawerProps> = ({
  title,
  headerIcon,
  triggerIcon,
  triggerTitle,
  children,
  footer,
  className,
  disabled,
  controlled
}) => {
  const [open, setOpen] = useState(false);
  const dialogProps = controlled ? { open, onOpenChange: setOpen } : {};

  return (
    <Dialog.Root {...dialogProps}>
      <Dialog.Trigger asChild disabled={disabled}>
        <button title={triggerTitle} className={cx(styles.triggerButton, className)}>
          {triggerIcon ? (
            <span className={styles.triggerIcon} data-testid="icon" aria-hidden>
              {triggerIcon}
            </span>
          ) : null}
          <span>{triggerTitle}</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content className={styles.content}>
          <div className={styles.titleRow}>
            {headerIcon ? (
              <div className={styles.iconBackground} data-testid="title-icon" aria-hidden>
                <span className={styles.titleTriggerIcon}>{headerIcon}</span>
              </div>
            ) : null}
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            <Dialog.Close className={styles.dialogTrigger} asChild>
              <button className={styles.buttonClose} aria-label="Close" title="Close the dialog">
                <XCloseIcon />
              </button>
            </Dialog.Close>
          </div>

          <div tabIndex={0} className={styles.childrenContainer}>
            {controlled
              ? React.Children.map(children, (child) => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(child, { setOpen });
                  } else {
                    return child;
                  }
                })
              : children}
          </div>

          {footer ? <div className={styles.footer}>{footer}</div> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Drawer;
