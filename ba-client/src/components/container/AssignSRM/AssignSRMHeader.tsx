import React from 'react';
import styles from './AssignSRM.module.scss';

interface AssignSRMHeaderProps {
  title: string;
  helperText: React.ReactNode;
}
const AssignSRMHeader = ({ title, helperText }: AssignSRMHeaderProps) => {
  return (
    <header className={styles.heading}>
      <h1 className={styles.header} id="main-header">
        {title}
      </h1>
      {helperText}
    </header>
  );
};

export default AssignSRMHeader;
