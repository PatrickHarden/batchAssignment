import React from 'react';
import { render } from '@testing-library/react';
import { AssessmentCheckbox } from './FilterCheckbox';
import { AssessmentItem } from './FiltersDrawer';

it('renders AssessmentCheckbox with empty value', async () => {
  render(
    <AssessmentCheckbox
      selectedAssessments={[]}
      onCheckboxChange={function (selectedIds: AssessmentItem[]): void {
        throw new Error('Function not implemented.');
      }}
    />
  );
});
