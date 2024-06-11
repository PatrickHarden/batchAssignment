import React, { FunctionComponent } from 'react';
import cx from 'classix';
import styles from '../Table.module.scss';
import type { Proficiency as ProficiencyType } from '../../../../hooks/apis/use-students-api';

interface ProficiencyProps {
  proficiency: ProficiencyType | null;
}

const proficiencyToClassName: { [proficiency in ProficiencyType]: string } = {
  Advanced: 'blueDot',
  Proficient: 'greenDot',
  Basic: 'purpleDot',
  'Below Basic': 'redDot'
};

const Proficiency: FunctionComponent<ProficiencyProps> = ({ proficiency }) => {
  return (
    <div className={styles.proficiency}>
      <div
        className={cx(proficiency !== null && styles[proficiencyToClassName[proficiency]])}
        data-testid="proficiency-icon"
      ></div>
      {proficiency}
    </div>
  );
};

export default Proficiency;
