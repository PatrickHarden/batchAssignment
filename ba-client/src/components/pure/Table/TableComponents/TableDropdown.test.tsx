import React from 'react';
import TableDropdown from './TableDropdown';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStudentData } from './MockTableData';
import { Atom, Provider } from 'jotai';
import { openDialog } from '../../../../atoms/atoms';

describe('<TableDropdown />', () => {
  it("should render the dropdown and set openDialog atom when 'edit' is selected", async () => {
    render(
      <Provider initialValues={[[openDialog, null]] as unknown as [Atom<any>, any]}>
        <TableDropdown tableData={mockStudentData[1]} placeholder="Select" />
      </Provider>
    );

    const dropdownButton = screen.getByRole('button', { name: 'Select' });
    userEvent.click(dropdownButton);

    const editOption = screen.getByRole('menuitem', { name: 'Edit Test' });
    expect(editOption).toBeInTheDocument();
    userEvent.click(editOption, {
      target: {
        innerText: 'Edit Test'
      }
    } as MouseEventInit);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it("should render the dropdown and set openDialog atom when 'cancel' is selected", async () => {
    render(
      <Provider initialValues={[[openDialog, null]] as unknown as [Atom<any>, any]}>
        <TableDropdown tableData={mockStudentData[3]} placeholder="Select" />
      </Provider>
    );

    const dropdownButton = screen.getByRole('button', { name: 'Select' });
    userEvent.click(dropdownButton);

    const editOption = screen.getByRole('menuitem', { name: 'Cancel Test' });
    expect(editOption).toBeInTheDocument();
    userEvent.click(editOption, {
      target: {
        innerText: 'Cancel Test'
      }
    } as MouseEventInit);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
