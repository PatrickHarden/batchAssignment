import React from 'react';
import type { Status as StatusType } from '../../../../hooks/apis/use-students-api';

interface StatusProps {
  status: StatusType | null;
}

const statusDisplayText: { [status in StatusType]: string } = {
  ASSIGNED: 'Assigned',
  CANCELED: 'Canceled',
  COMPLETED: 'Completed',
  DELETED: 'Deleted',
  IN_PROGRESS: 'In Progress',
  NO_TEST_SCHEDULED: 'No Test Scheduled',
  NOT_STARTED: 'Not Started',
  SCHEDULED: 'Scheduled'
};

export default function Status({ status }: StatusProps) {
  if (status === null) {
    throw new TypeError('Status must be valid');
  }
  return <>{statusDisplayText[status]}</>;
}
