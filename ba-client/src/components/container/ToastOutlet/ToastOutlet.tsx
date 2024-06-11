import React, { useCallback, useMemo, useState } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { ReactComponent as SuccessIcon } from '../../../assets/icons/success-notification.svg';
import { ReactComponent as ErrorIcon } from '../../../assets/icons/error-notification.svg';
import { ReactComponent as WarningIcon } from '../../../assets/icons/warning-notification.svg';
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-notification.svg';
import { ReactComponent as XCloseIcon } from '../../../assets/icons/x-close-button.svg';
import { uniqueId } from 'lodash-es';
import { NonNegativeInteger } from 'type-fest';
import { useAtom, useSetAtom } from 'jotai';
import { toastsAtom } from '../../../atoms/atoms';
import { useTimeout } from '../../../hooks/useTimeout/useTimeout';
import styles from './ToastOutlet.module.scss';

interface ToastOutletProps<T extends number> {
  /**
   * Number of milliseconds to wait before toast expires
   *
   * @default 5000
   */
  duration?: NonNegativeInteger<T>;
}

interface UseToastReturn {
  /** Show success toast notification */
  success: (content: string) => string;
  /** Show error toast notification */
  error: (content: string) => string;
  /** Show warning toast notification */
  warning: (content: string) => string;
  /** Show info toast notification */
  info: (content: string) => string;
}

export interface ToastItem {
  /** Unique Id of toast */
  id: string;
  /** Message to display */
  message: string;
  /** Status of toast */
  status: Status;
}

export type Status = 'success' | 'error' | 'warning' | 'info';

interface ToastProps<T extends number> {
  /**
   * Callback to be called when the toast closes
   */
  onClose?: () => void;
  /**
   * Toast status type
   */
  status?: Status;
  /**
   * Duration in ms to show the toast before hiding
   */
  duration?: NonNegativeInteger<T>;
  /**
   * Content to display on toast
   */
  children: React.ReactNode;
}

export const useToast = (): UseToastReturn => {
  const setToasts = useSetAtom(toastsAtom);

  const showToast = useCallback(
    (message: string, status: Status) => {
      const id = uniqueId('toast-');
      // remove below comment to allow for multiple toasts at the same time
      setToasts((prev) => [/*...prev,*/ { id, message, status }]);
      return id;
    },
    [setToasts]
  );

  return useMemo(
    () => ({
      success: (content: string) => showToast(content, 'success'),
      error: (content: string) => showToast(content, 'error'),
      warning: (content: string) => showToast(content, 'warning'),
      info: (content: string) => showToast(content, 'info')
    }),
    [showToast]
  );
};

const ToastOutlet = <T extends number>({
  duration = 5000 as NonNegativeInteger<T>
}: ToastOutletProps<T>) => {
  const [toasts, setToasts] = useAtom(toastsAtom);

  return (
    <ToastPrimitive.Provider swipeDirection="down" swipeThreshold={30}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          status={toast.status}
          duration={duration}
          onClose={() => {
            setToasts((prev) => prev.filter((t) => t.id !== toast.id));
          }}
        >
          {toast.message}
        </Toast>
      ))}
      <ToastPrimitive.Viewport className={styles.toastViewport} role="status" aria-live="polite" />
    </ToastPrimitive.Provider>
  );
};

const toastStatusToIcon = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon
} as const;

export const Toast = <T extends number>({
  onClose,
  duration = 5000 as NonNegativeInteger<T>,
  children,
  status = 'info'
}: ToastProps<T>) => {
  const Icon = toastStatusToIcon[status];
  const [delay, setDelay] = useState<number | undefined>(duration);
  const [open, setOpen] = useState(true);

  const closeToast = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      // wait for exit animation to finish before notifying close callback
      onClose?.();
    }, parseInt(styles.exitAnimationTime));
  }, [onClose]);

  useTimeout(closeToast, delay);

  return (
    <ToastPrimitive.Root
      className={styles.toastRoot}
      data-status={status}
      aria-live="polite"
      onMouseEnter={() => setDelay(undefined)}
      onMouseLeave={() => setDelay(duration)}
      onEscapeKeyDown={closeToast}
      onSwipeEnd={closeToast}
      open={open}
    >
      <Icon className={styles.icon} />
      <ToastPrimitive.Description className={styles.toastDescription}>
        {children}
      </ToastPrimitive.Description>
      <ToastPrimitive.Close className={styles.closeButton} aria-label="close" onClick={closeToast}>
        <XCloseIcon />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
};

export default ToastOutlet;
