import React, { FunctionComponent } from 'react';
import { formatDuration, intervalToDuration } from 'date-fns';

interface TimeSpentProps {
  time: number | null;
}

const TimeSpent: FunctionComponent<TimeSpentProps> = ({ time }: TimeSpentProps) => {
  let screenReaderLabel = 'No time elapsed';
  const zeroPad = (num: number | undefined) => String(num).padStart(2, '0');
  const timeSpent = time || 0;
  const duration = intervalToDuration({ start: 0, end: timeSpent * 1000 });
  if (timeSpent !== 0) {
    screenReaderLabel = formatDuration(duration);
  }

  return (
    <div>
      {screenReaderLabel && <span className="sr-only">{screenReaderLabel}</span>}
      <span aria-hidden="true">
        {time && time !== 0
          ? `${
              zeroPad(duration.hours) !== '00' ? zeroPad(duration.hours).concat(':') : ''
            }${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`
          : null}
      </span>
    </div>
  );
};

export default TimeSpent;
