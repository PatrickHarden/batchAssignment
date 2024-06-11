import React from 'react';
import styles from './HomePageStatusTip.module.scss';

const tip = (
  <div className={styles.statusTip}>
    <span className={styles.header}>Completed:</span> These assignments have been completed.
    <br />
    <br /> <span className={styles.header}>In Progress:</span> The student has started the
    assignment, but has not yet finished it. <br />
    <br />
    <span className={styles.header}>Not Started:</span> The assignment has been created and is
    available, but the student has not yet started it.
    <br />
    <br /> <span className={styles.header}>Scheduled:</span> The assignment is set to start on a
    future date. <br />
    <br />
    <span className={styles.header}>No Test Scheduled:</span> Nothing has been assigned to this
    student. <br />
    <br />
    <span className={styles.header}>Canceled:</span> The assignment has been canceled manually by a
    teacher or administrator, or the end date has been reached. <br />
    <br />
    <span className={styles.header}>Deleted:</span> The assignment has been deleted manually by an
    administrator. <br />
  </div>
);
export default tip;
