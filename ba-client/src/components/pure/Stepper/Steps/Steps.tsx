import React, { FunctionComponent, Suspense } from 'react';
import styles from './Steps.module.scss';

export interface StepsProps {
  header: string;
  subheader?: React.ReactNode;
  content: React.ReactNode;
}

const Steps: FunctionComponent<StepsProps> = ({ header, subheader, content }: StepsProps) => {
  return (
    <div className={styles.contentContainer}>
      <h2 className={styles.contentHeader}>{header}</h2>
      {subheader && (
        <div className={styles.subHeaderContainer}>
          <span className={styles.subHeaderText}>{subheader}</span>
        </div>
      )}
      <Suspense fallback={<></>}>{content}</Suspense>
    </div>
  );
};

export default Steps;
