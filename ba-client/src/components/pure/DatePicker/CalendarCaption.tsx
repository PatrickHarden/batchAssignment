import React from 'react';
import {
  CaptionProps,
  useDayPicker,
  useNavigation,
  CaptionLabel,
  IconLeft,
  IconRight
} from 'react-day-picker';
import styles from './CalendarCaption.module.scss';
import cx from 'classix';

const CalendarCaption = (props: CaptionProps) => {
  const {
    locale,
    classNames,
    styles: dayPickerStyles,
    labels: { labelPrevious, labelNext }
  } = useDayPicker();
  const { previousMonth, nextMonth, goToMonth } = useNavigation();

  const handlePreviousMonthClick = () => {
    goToMonth(previousMonth as Date);
  };

  const handleNextMonthClick = () => {
    goToMonth(nextMonth as Date);
  };

  return (
    <div className={styles.container}>
      <button
        type="button"
        aria-label={labelPrevious(previousMonth, { locale })}
        className={cx(classNames.nav_button, classNames.nav_button_previous, styles.navButton)}
        style={dayPickerStyles.nav_button_previous}
        disabled={!previousMonth}
        onClick={handlePreviousMonthClick}
      >
        <IconLeft />
      </button>
      <CaptionLabel {...props} />
      <button
        type="button"
        aria-label={labelNext(nextMonth, { locale })}
        className={cx(classNames.nav_button, classNames.nav_button_next, styles.navButton)}
        style={dayPickerStyles.nav_button_next}
        disabled={!nextMonth}
        onClick={handleNextMonthClick}
      >
        <IconRight />
      </button>
    </div>
  );
};

export default CalendarCaption;
