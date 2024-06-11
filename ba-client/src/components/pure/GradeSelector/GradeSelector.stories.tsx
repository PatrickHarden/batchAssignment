import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import GradeSelector, { GradeItem } from './GradeSelector';

export default {
  title: 'Example/GradeSelector',
  component: GradeSelector
} as ComponentMeta<typeof GradeSelector>;

const availableGrades = [
  { code: 'pk', name: 'PK' },
  { code: 'tk', name: 'TK' },
  { code: 'k', name: 'K', disabled: true },
  { code: '1', name: '1' },
  { code: '2', name: '2', disabled: true },
  { code: '3', name: '3' },
  { code: '4', name: '4' },
  { code: '5', name: '5' },
  { code: '6', name: '6' },
  { code: '7', name: '7' },
  { code: '8', name: '8' },
  { code: '9', name: '9' },
  { code: '10', name: '10' },
  { code: '11', name: '11' },
  { code: '12', name: '12' },
  { code: 'ps', name: 'PS' },
  { code: 'pg', name: 'PG' },
  { code: 'other', name: 'Other' },
  { code: 'ungraded', name: 'Ungraded' }
];

const Template: ComponentStory<typeof GradeSelector> = () => {
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

  return (
    <GradeSelector grades={selectedGrades} onGradeChange={setSelectedGrades}>
      {availableGrades.map(({ code, name, disabled }) => (
        <GradeItem key={code} value={code} disabled={disabled}>
          {name}
        </GradeItem>
      ))}
    </GradeSelector>
  );
};

export const Default = Template.bind({});
