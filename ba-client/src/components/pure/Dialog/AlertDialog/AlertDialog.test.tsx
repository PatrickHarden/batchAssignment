import React from 'react';
import AlertDialog from './AlertDialog';
import { mockCancelData, mockDeleteData } from './mockAlertDialogData';
import { fireEvent, render, screen } from '@testing-library/react';

it('should render the AlertDialog component', () => {
  const { header, subHeader, content, cancelText, actionText } = mockDeleteData;

  render(
    <AlertDialog
      header={header}
      subHeader={subHeader}
      content={content}
      cancelButtonText={cancelText}
      actionButtonText={actionText}
      TriggerButtonText="trigger button"
    />
  );

  const TriggerButtonText = screen.getByText('trigger button');
  fireEvent.click(TriggerButtonText);

  expect(screen.getAllByText('Delete Score')).toHaveLength(2);
});

it('should close the AlertDialog on cancel and delete', () => {
  const { header, content, cancelText, actionText } = mockCancelData;

  render(
    <AlertDialog
      header={header}
      content={content}
      cancelButtonText={cancelText}
      actionButtonText={actionText}
      TriggerButtonText="trigger button"
      triggerStyle="button-clifford-red"
      onAction={(value: any) => console.log('action', value)}
      onCancel={(value: any) => console.log('cancel', value)}
    />
  );

  const TriggerButtonText = screen.getByText('trigger button');
  fireEvent.click(TriggerButtonText);

  const deleteButton = screen.getByText('Cancel Assessment', { selector: 'button' });
  fireEvent.click(deleteButton);

  expect(deleteButton).not.toBeInTheDocument();

  fireEvent.click(TriggerButtonText);
  const cancelButton = screen.getByText('Keep Assessment', { selector: 'button' });

  fireEvent.click(cancelButton);

  expect(cancelButton).not.toBeInTheDocument();
});
