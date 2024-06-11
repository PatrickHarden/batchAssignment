import React from 'react';
import Table from './Table';
import { render, screen } from '@testing-library/react';
import { mockStudentData } from './TableComponents/MockTableData';
import TableDropdown from './TableComponents/TableDropdown';
import { Provider, Atom } from 'jotai';
import { openDialog } from '../../../atoms/atoms';
import userEvent from '@testing-library/user-event';
import { columnDefs } from '../../container/HomePage/Teacher/TableContainerColumnDefinitions';

describe('<Table />', () => {
  it('should render the table and expect its rendering', () => {
    render(
      <Table
        dataKey="studentId"
        data={mockStudentData}
        columnDefs={columnDefs}
        hideDuplicateNameCells={true}
      />
    );
    const inputEl = screen.getByRole('table');

    expect(inputEl).toBeInTheDocument();
  });

  it('should sort alphabetical ascending', () => {
    render(
      <Table
        dataKey="studentId"
        data={mockStudentData}
        columnDefs={columnDefs}
        hideDuplicateNameCells={true}
      />
    );
    const inputEl = screen.getByTestId('sortAscending');
    userEvent.click(inputEl);
    const firstName = screen.getByTestId('name-0-0');
    expect(firstName.innerHTML).toEqual(
      '<div class="truncateName" aria-label="Wade Adams">Wade Adams</div>'
    );
  });

  it('should sort alphabetical descending', () => {
    render(
      <Table
        dataKey="studentId"
        data={mockStudentData}
        columnDefs={columnDefs}
        hideDuplicateNameCells={true}
      />
    );
    const inputEl = screen.getByTestId('sortAscending');
    userEvent.click(inputEl);
    userEvent.click(inputEl);
    const firstName = screen.getByTestId('name-0-0');
    expect(firstName.innerHTML).toEqual(
      '<div class="truncateName" aria-label="Bri Archer">Bri Archer</div>'
    );
  });

  it('should check one checkbox', () => {
    render(
      <Table
        dataKey="studentId"
        data={mockStudentData}
        columnDefs={columnDefs}
        hideDuplicateNameCells={true}
        enableCheckbox={true}
        selectedStudents={[mockStudentData[1]]}
      />
    );
    const inputEl = screen.getByTestId('checkbox-0');
    userEvent.click(inputEl);
    expect(inputEl).toBeChecked();
  });

  it('should check the checkAll checkbox', () => {
    const spy = jest.fn();
    render(
      <Table
        dataKey="studentId"
        data={mockStudentData}
        columnDefs={columnDefs}
        hideDuplicateNameCells={true}
        enableCheckbox={true}
        onChange={spy}
      />
    );
    expect(spy).not.toBeCalled();
    const inputEl = screen.getByTestId('checkAll');
    userEvent.click(inputEl);
    expect(inputEl).toBeChecked();
    userEvent.click(inputEl);
    expect(inputEl).not.toBeChecked();
    expect(spy).toHaveBeenCalled();
  });

  it('should check all enabled checkboxes when the checkAll checkbox is selected', () => {
    const mockStudentDataExtra = mockStudentData.concat({
      studentId: '123',
      name: 'Test Tester',
      daysSinceLastAssessment: 43,
      status: 'COMPLETED',
      assessmentPeriod: 'BEGINNING',
      startDate: '34534534',
      endDate: '3453445345',
      result: '600L',
      proficiency: 'Proficient',
      timeSpent: 413222,
      assignedBy: 'Test, testington',
      initialTeacherAppraisal: 'ABOVE_LEVEL',
      action: true,
      assessmentId: 23,
      daysSinceLastAssessmentOriginal: 43,
      benchmark: 'BEGINNING',
      firstName: 'Test',
      lastName: 'Tester'
    });
    render(
      <Table
        dataKey="studentId"
        data={mockStudentDataExtra}
        columnDefs={columnDefs}
        hideDuplicateNameCells={true}
        enableCheckbox={true}
      />
    );
    const inputEl = screen.getByTestId('checkAll');
    userEvent.click(inputEl);
    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];

    const checkedCount = checkboxes.reduce((count, checkbox) => {
      if (checkbox.checked) {
        return count + 1;
      }
      return count;
    }, 0);

    expect(checkedCount).toBe(4);
  });

  it('should render the table dropdown, click Edit, and see that it was the edit dialog was launched', () => {
    const row = mockStudentData[1];
    render(
      <Provider initialValues={[[openDialog, mockStudentData[1]]] as unknown as [Atom<any>, any]}>
        <TableDropdown tableData={row} placeholder="Select" />
      </Provider>
    );
    const dropdown = screen.getByText('Select');
    expect(dropdown).toBeInTheDocument();
    const btn = screen.getByRole('button');
    userEvent.click(btn);

    expect(screen.getByRole('menu')).toBeInTheDocument();
    const edit = screen.getByText('Edit Test');
    expect(edit).toBeInTheDocument();

    userEvent.click(edit, {
      target: {
        innerText: 'Edit'
      }
    } as MouseEventInit);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should render the table dropdown, click Cancel, and see that it was the cancel dialog was launched', () => {
    render(
      <Provider initialValues={[[openDialog, mockStudentData[3]]] as unknown as [Atom<any>, any]}>
        <TableDropdown tableData={mockStudentData[3]} placeholder="Select" />
      </Provider>
    );
    const dropdown = screen.getByText('Select');
    userEvent.click(dropdown);

    const cancelOption = screen.getByText('Cancel Test');

    userEvent.click(cancelOption, {
      target: {
        innerText: 'Cancel'
      }
    } as MouseEventInit);
  });

  it('should render the table dropdown2', () => {
    const row = mockStudentData[1];
    render(<TableDropdown tableData={row} placeholder="Select" />);
    const dropdown = screen.getByText('Select');
    expect(dropdown).toBeInTheDocument();
    const btn = screen.getByRole('button');
    userEvent.click(btn);
  });

  it('should render the table dropdown3', () => {
    const row = mockStudentData[2];
    render(<TableDropdown tableData={row} placeholder="Select" />);
    const dropdown = screen.getByText('Select');
    expect(dropdown).toBeInTheDocument();
    const btn = screen.getByRole('button');
    userEvent.click(btn);
  });
});
