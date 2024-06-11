import React from 'react';
import { render, screen } from '@testing-library/react';
import AccordionTable from './AccordionTable';
import {
  accordionColumnDefs,
  AccordionTableData,
  type AdminAssessmentData
} from '../../container/HomePage/Admin/TableColumnDefinitions';
import AdminTableDropdown from './TableComponents/AdminTableDropdown';

const noTestScheduled = 'NO_TEST_SCHEDULED';
const southGateElem = 'Southgate Elementary School';
const croftonElem = 'Crofton Elementary School';
const croftonMiddle = 'Crofton Middle School';

const kindergarten = 'Kindergarten';
const grade1 = 'Grade 1';
const grade2 = 'Grade 2';
const grade5 = 'Grade 5';
const grade6 = 'Grade 6';

const beginning = 'BEGINNING';
const middle = 'MIDDLE';
const end = 'END';

const accordionTableData: AccordionTableData[] = [
  {
    organizationName: southGateElem,
    assessments: [
      {
        grade: kindergarten,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: kindergarten
      },
      {
        grade: kindergarten,
        status: noTestScheduled,
        completed: null,
        period: middle,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: kindergarten
      },
      {
        grade: kindergarten,
        status: noTestScheduled,
        completed: null,
        period: end,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: kindergarten
      },
      {
        grade: grade1,
        status: noTestScheduled,
        completed: null,
        period: end,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: grade1
      },
      {
        grade: grade2,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: grade2
      },
      {
        grade: grade2,
        status: noTestScheduled,
        completed: null,
        period: middle,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: grade2
      },
      {
        grade: grade2,
        status: noTestScheduled,
        completed: null,
        period: end,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: grade2
      },
      {
        grade: grade5,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: grade5
      },
      {
        grade: grade5,
        status: noTestScheduled,
        completed: null,
        period: middle,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: grade5
      },
      {
        grade: grade5,
        status: noTestScheduled,
        completed: null,
        period: end,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: grade5
      },
      {
        grade: grade6,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: grade6
      },
      {
        grade: grade6,
        status: noTestScheduled,
        completed: null,
        period: middle,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: grade6
      },
      {
        grade: grade6,
        status: noTestScheduled,
        completed: null,
        period: end,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: grade6
      }
    ]
  },
  {
    organizationName: croftonElem,
    assessments: [
      {
        grade: 'Kindergarten',
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonElem,
        rowGrade: kindergarten
      },
      {
        grade: 'Grade 1',
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonElem,
        rowGrade: grade1
      },
      {
        grade: grade1,
        status: noTestScheduled,
        completed: null,
        period: middle,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonElem,
        rowGrade: grade1
      },
      {
        grade: grade1,
        status: noTestScheduled,
        completed: null,
        period: end,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonElem,
        rowGrade: grade1
      },
      {
        grade: grade2,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonElem,
        rowGrade: grade2
      },
      {
        grade: grade2,
        status: noTestScheduled,
        completed: null,
        period: middle,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonElem,
        rowGrade: grade2
      },
      {
        grade: grade2,
        status: noTestScheduled,
        completed: null,
        period: end,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonElem,
        rowGrade: grade2
      },
      {
        grade: grade5,
        status: noTestScheduled,
        completed: null,
        period: end,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonElem,
        rowGrade: grade5
      },
      {
        grade: grade6,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonElem,
        rowGrade: grade6
      }
    ]
  },
  {
    organizationName: croftonMiddle,
    assessments: [
      {
        grade: kindergarten,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonMiddle,
        rowGrade: kindergarten
      },
      {
        grade: grade1,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonMiddle,
        rowGrade: grade1
      },
      {
        grade: grade2,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonMiddle,
        rowGrade: grade2
      },
      {
        grade: grade2,
        status: noTestScheduled,
        completed: null,
        period: middle,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonMiddle,
        rowGrade: grade2
      },
      {
        grade: grade2,
        status: noTestScheduled,
        completed: null,
        period: end,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonMiddle,
        rowGrade: grade2
      },
      {
        grade: grade5,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonMiddle,
        rowGrade: grade5
      },
      {
        grade: grade6,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: croftonMiddle,
        rowGrade: grade6
      }
    ]
  },
  {
    organizationName: southGateElem,
    assessments: [
      {
        grade: kindergarten,
        status: 'ASSIGNED',
        completed: '0%',
        period: beginning,
        startDate: '03/25/2023 at 09:00 PM',
        endDate: '04/22/2023 at 09:00 PM',
        assignedBy: 'Vuppu, Sirisha',
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: kindergarten
      },
      {
        grade: kindergarten,
        status: noTestScheduled,
        completed: null,
        period: middle,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: kindergarten
      },
      {
        grade: kindergarten,
        status: noTestScheduled,
        completed: null,
        period: end,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: kindergarten
      },
      {
        grade: grade1,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: grade1
      },
      {
        grade: grade2,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: grade2
      },
      {
        grade: grade5,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: grade5
      },
      {
        grade: grade6,
        status: noTestScheduled,
        completed: null,
        period: beginning,
        startDate: null,
        endDate: null,
        assignedBy: null,
        action: true,
        assessmentId: null,
        site: southGateElem,
        rowGrade: grade6
      }
    ]
  }
];

describe('<AccordionTable>', () => {
  it('should render the table and expect its rendering', () => {
    render(<AccordionTable data={accordionTableData} columnDefs={accordionColumnDefs} />);
    const tableEl = screen.queryAllByRole('table')[0];

    expect(tableEl).toBeInTheDocument();
  });

  it('should render a message on empty data', () => {
    render(<AccordionTable data={[]} columnDefs={[]} />);

    expect(screen.getByText(/^no matches found/i)).toBeInTheDocument();
  });
});

describe('<AdminTableDropdown>', () => {
  it('should return null as the tableData does not include the status to make admin edits to', () => {
    render(
      <div>
        <AdminTableDropdown tableData={accordionTableData[0].assessments[0]} />
      </div>
    );
    expect(screen.queryByRole('div')).toBeNull();
  });

  it('should render the dropdown when the proper status is passed in', () => {
    const mockTableData: AdminAssessmentData = {
      grade: kindergarten,
      status: 'SCHEDULED',
      completed: '0%',
      period: beginning,
      startDate: '03/25/2023 at 09:00 PM',
      endDate: '04/22/2023 at 09:00 PM',
      assignedBy: 'Vuppu, Sirisha',
      action: true,
      assessmentId: 234,
      site: southGateElem,
      rowGrade: kindergarten
    };
    render(
      <div>
        <AdminTableDropdown tableData={mockTableData} />
      </div>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
