import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import GradeSelector, { GradeItem } from './GradeSelector';
import userEvent from '@testing-library/user-event';

interface GradeSelectorWrapperProps {
  selectedGrades?: string[];
  gradeList?: { grade: string; disabled?: boolean }[];
}

const GradeSelectorWrapper = ({
  selectedGrades = [],
  gradeList = [{ grade: 'k' }, { grade: '1', disabled: true }, { grade: '2' }]
}: GradeSelectorWrapperProps) => {
  const [grades, setGrades] = useState<string[]>(selectedGrades);

  return (
    <GradeSelector grades={grades} onGradeChange={setGrades}>
      {gradeList.map(({ grade, disabled }) => (
        <GradeItem key={grade} value={grade} disabled={disabled}>
          {grade}
        </GradeItem>
      ))}
    </GradeSelector>
  );
};

const ariaPressed = 'aria-pressed';

it('should render grade buttons', () => {
  render(<GradeSelectorWrapper />);

  expect(screen.getByRole('button', { name: 'k' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '1' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
});

it('should be able to disable a grade', () => {
  render(<GradeSelectorWrapper />);

  const grade1Button = screen.getByRole('button', { name: '1' });
  expect(grade1Button).toBeDisabled();

  userEvent.click(grade1Button, undefined, { skipPointerEventsCheck: true });
  expect(grade1Button).not.toHaveAttribute(ariaPressed, 'true');
});

it('should show tooltip when hovering on disabled grade', async () => {
  render(<GradeSelectorWrapper />);

  const disabledGradeWrapper = screen.getByTestId('tooltip-disabled-element-wrapper');
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  userEvent.hover(disabledGradeWrapper);
  expect(await screen.findByRole('tooltip')).toBeInTheDocument();
});

it('should be able to select a grade', () => {
  render(<GradeSelectorWrapper />);

  const gradeKButton = screen.getByRole('button', { name: 'k', pressed: false });

  userEvent.click(gradeKButton);
  expect(screen.getByRole('button', { name: 'k', pressed: true })).toHaveAttribute(
    ariaPressed,
    'true'
  );
});

it('should be able to unselect a grade', () => {
  render(<GradeSelectorWrapper selectedGrades={['k']} />);

  const gradeKButton = screen.getByRole('button', { name: 'k', pressed: true });

  userEvent.click(gradeKButton);
  expect(screen.getByRole('button', { name: 'k', pressed: false })).toHaveAttribute(
    ariaPressed,
    'false'
  );
});
