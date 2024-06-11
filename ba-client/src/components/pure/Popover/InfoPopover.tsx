import React, { FunctionComponent, useState } from 'react';
import styles from './InfoPopover.module.scss';
import { Popover, PopoverBody } from '@scholastic/volume-react';
import { PopperPlacementType } from '@material-ui/core';
import { ReactComponent as InfoIcon } from '../../../assets/icons/popoverIcon.svg';

export interface PopperProps {
  placement?: PopperPlacementType;
  tipMessage: React.ReactNode | string;
  stringedTipMessage: string;
}

const InfoPopover: FunctionComponent<PopperProps> = ({
  placement,
  tipMessage,
  stringedTipMessage
}: PopperProps) => {
  const [toolTipOpen, setToolTipOpen] = useState(false);

  const togglePopover = () => {
    setToolTipOpen((prev) => !prev);
  };

  const handleBlur = () => {
    setToolTipOpen(false);
  };

  return (
    <>
      <button
        id="popoverTarget"
        className={styles.popoverButton}
        onBlur={handleBlur}
        aria-label={`Tooltip Content - ${stringedTipMessage}`}
      >
        <InfoIcon aria-label="status popover" />
      </button>
      <Popover
        target="popoverTarget"
        trigger="legacy"
        toggle={togglePopover}
        placement={placement}
        isOpen={toolTipOpen}
        arrowClassName={styles.toolTipArrow}
        popperClassName={styles.toolTipPopout}
      >
        <PopoverBody className={styles.body}>{tipMessage}</PopoverBody>
      </Popover>
    </>
  );
};
export default InfoPopover;
