import React, { ReactNode } from 'react';
import { ReactComponent as XCloseIcon } from '../../../assets/icons/x-close-button.svg';
import { ReactComponent as WarningTip } from '../../../assets/icons/warning-tip.svg';
import { ReactComponent as LightBulbIcon } from '../../../assets/icons/light-bulb-tip.svg';
import { ReactComponent as CheckMarkEncircledIcon } from '../../../assets/icons/check-mark-encircled-tip.svg';
import useToggle from '../../../utils/use-toggle';
import './BannerMessage.scss';

export enum BannerMessageTheme {
  Warning = 'warning',
  Success = 'success',
  Info = 'info'
}

export interface BannerMessageProps {
  /**
   * Message
   */
  children: ReactNode;

  /**
   * Popup message theme
   *
   * @default BannerMessageTheme.Warning
   */
  theme?: BannerMessageTheme;

  /**
   * Whether the 'X' button should be shown or not
   */
  isDismissible?: boolean;

  /**
   * Class that is applied in addition to the component's current class
   */
  className?: string;
}

const BannerMessage = ({
  children,
  theme = BannerMessageTheme.Warning,
  isDismissible,
  className
}: BannerMessageProps) => {
  const { isOn: isShown, toggle } = useToggle(true);

  return isShown ? (
    <div className={`banner-message banner-message--${theme} className`}>
      <div className="banner-message__icon-wrapper">
        <WarningTip className="banner-message__icon banner-message__icon--warning" />
        <LightBulbIcon className="banner-message__icon banner-message__icon--info" />
        <CheckMarkEncircledIcon className="banner-message__icon banner-message__icon--success" />
      </div>

      <div className="banner-message__content">
        <div className="banner-message__content-inner">{children}</div>

        <button
          aria-label="Click or hit enter to hide this message"
          type="button"
          onClick={isDismissible ? toggle : undefined}
          className={`banner-message__close-button ${
            !isDismissible ? 'banner-message__close-button--hidden' : ''
          }
          `}
        >
          <XCloseIcon className="banner-message__close-button-icon" />
        </button>
      </div>
    </div>
  ) : null;
};

export default BannerMessage;
