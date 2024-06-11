import React from 'react';
import Dialog, { DialogProps } from './Dialog';
import { render, screen } from '@testing-library/react';
import { EditAssessmentContent } from './EditAssessment/EditAssessmentContent';
import { mockStudentData } from '../Table/TableComponents/MockTableData';
import userEvent from '@testing-library/user-event';

const mockDialogProps: DialogProps = {
  title: 'Edit SRM Assessment',
  content: null,
  openDialogButton: 'Open'
};

it('should render the title passed in via props', async () => {
  render(<Dialog {...mockDialogProps} />);

  const openDialog = screen.getByRole('button');

  userEvent.click(openDialog);
  const title = screen.getByText('Edit SRM Assessment');

  expect(screen.getByTestId('dialogTitle')).toBeInTheDocument();
  expect(title).toBeInTheDocument();
});

it('should render the content passed in via props', async () => {
  render(<Dialog {...mockDialogProps} content={<>Mock content</>} />);
  const openDialog = screen.getByRole('button');

  userEvent.click(openDialog);
  const title = screen.getByText('Mock content');
  expect(title).toBeInTheDocument();
});

it('should render the footer passed in via props', async () => {
  render(<Dialog {...mockDialogProps} footer={<div>Close</div>} />);
  const openDialog = screen.getByText('Open');

  userEvent.click(openDialog);

  expect(screen.getByTestId('dialogFooter')).toBeInTheDocument();
});

it('should render the close icon passed in via props', async () => {
  render(<Dialog {...mockDialogProps} />);
  const openDialog = screen.getByText('Open');

  userEvent.click(openDialog);
  const closeButton = screen.getByRole('button', { name: 'Close' });

  expect(closeButton).toBeInTheDocument();
});

it('should render the custom open dialog button', async () => {
  render(<Dialog {...mockDialogProps} openDialogButton={<button>test open dialogue</button>} />);
  const openDialog = screen.getByText('test open dialogue');

  userEvent.click(openDialog);
  expect(openDialog).toBeInTheDocument();
});

it('should render the custom footer', async () => {
  render(<Dialog {...mockDialogProps} footer={null} openDialogButton="Open" />);
  const openDialog = screen.getByRole('button');

  userEvent.click(openDialog);
  const title = screen.getByText('Cancel');
  expect(title).toBeInTheDocument();
});

it('should render no trigger button', async () => {
  render(<Dialog {...mockDialogProps} isOpen={true} footer={null} openDialogButton={null} />);

  const title = screen.getByText('Cancel');
  expect(title).toBeInTheDocument();
});

it('should render the custom content for edit srm assessment', async () => {
  const mockData = mockStudentData[0];
  render(
    <Dialog
      {...mockDialogProps}
      content={
        <EditAssessmentContent editStudentData={mockData} disableActionButton={() => false} />
      }
      footer={null}
      openDialogButton="Open"
    />
  );
  const openDialog = screen.getByRole('button');

  userEvent.click(openDialog);
  const title = screen.getByText('Cancel');
  expect(title).toBeInTheDocument();
});

it('should call the onAction function when clicking Save', () => {
  const onActionSpy = jest.fn();
  render(<Dialog {...mockDialogProps} openDialogButton="Open" onAction={onActionSpy} />);
  expect(onActionSpy).not.toBeCalled();

  const openDialog = screen.getByRole('button');
  userEvent.click(openDialog);

  const saveButton = screen.getByRole('button', { name: 'Save' });
  expect(saveButton).toBeInTheDocument();
  userEvent.click(saveButton);
  expect(onActionSpy).toBeCalled();
});
