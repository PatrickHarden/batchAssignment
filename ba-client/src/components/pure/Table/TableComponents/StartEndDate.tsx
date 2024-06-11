import React, { FunctionComponent } from 'react';
import { type Status } from '../../../../hooks/apis/use-students-api';
interface StartEndDateProps {
  status: Status | null;
  time: string | null;
}
const StartEndDate: FunctionComponent<StartEndDateProps> = ({ status, time }) => {
  return time ? (
    <div
      style={
        status === 'CANCELED' || status === 'DELETED' ? { textDecoration: 'line-through' } : {}
      }
    >
      {time}
    </div>
  ) : null;
};
export default StartEndDate;
