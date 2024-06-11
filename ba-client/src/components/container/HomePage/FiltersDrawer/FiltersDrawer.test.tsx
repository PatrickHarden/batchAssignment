import React from 'react';
import { render, screen, within } from '@testing-library/react';
import FiltersDrawer from './FiltersDrawer';
import userEvent from '@testing-library/user-event';
import { Atom, Provider } from 'jotai';
import { currentSchoolYearAtom, gradesAtom, sitesAtom } from '../../../../atoms/atoms';
import { DrawerAccordionProps } from './FiltersDrawer';

const gradesMock: DrawerAccordionProps['mappedGrades'] = [
  { title: 'Kindergarten', id: 'k' },
  { title: 'Grade 1', id: '1' },
  { title: 'Grade 2', id: '2' },
  { title: 'Grade 3', id: '3' }
];

type SiteNames = {
  serverna: 'Severna Park High School';
  crofton: 'Crofton Elementary School';
  woodside: 'Woodside Elementary School';
};

const sitesNames: Readonly<SiteNames> = {
  serverna: 'Severna Park High School',
  crofton: 'Crofton Elementary School',
  woodside: 'Woodside Elementary School'
};

const sitesMock: DrawerAccordionProps['siteListContent'] = [
  { title: sitesNames.crofton, id: sitesNames.crofton },
  { title: sitesNames.serverna, id: sitesNames.serverna },
  { title: sitesNames.woodside, id: sitesNames.woodside }
];

const schoolYearLabels: DrawerAccordionProps['schoolYearsLabels'] = [
  {
    label: '2022-23',
    value: '2023',
    startDate: '2023-01-01 00:00:00.0',
    endDate: '2023-12-31 00:00:00.0'
  },
  {
    label: '2021-22',
    value: '2022',
    startDate: '2022-01-01 00:00:00.0',
    endDate: '2022-12-31 00:00:00.0'
  }
];

const gradesInfo: DrawerAccordionProps['gradesInfo'] = [
  { id: 8013, name: sitesNames.serverna, grades: ['k'] },
  { id: 8013, name: sitesNames.crofton, grades: ['1', '2'] },
  { id: 8013, name: sitesNames.woodside, grades: ['k', '3'] }
];

const FiltersAccordionWrapper = ({ setOpen }: { setOpen?: any }) => {
  const filterProps = setOpen ? { setOpen } : {};
  return (
    <FiltersDrawer
      gradesInfo={gradesInfo}
      setHomePageSchoolYear={jest.fn()}
      schoolYearsLabels={schoolYearLabels}
      mappedGrades={gradesMock}
      siteListContent={sitesMock}
      {...filterProps}
    />
  );
};

describe('FiltersDrawer', () => {
  it('renders school year accordion', async () => {
    const setOpen = jest.fn();
    const setYear = jest.fn();

    render(
      <Provider initialValues={[[currentSchoolYearAtom, '2023']] as unknown as [Atom<any>, any]}>
        <FiltersDrawer
          gradesInfo={gradesInfo}
          setHomePageSchoolYear={setYear}
          schoolYearsLabels={schoolYearLabels}
          mappedGrades={gradesMock}
          siteListContent={sitesMock}
          setOpen={setOpen}
        />
      </Provider>
    );

    expect(screen.getByText(/school year/i)).toBeInTheDocument();

    const firstCheckbox = screen.getByRole('radio', { name: '2022-23' });
    const secondCheckbox = screen.getByRole('radio', { name: '2021-22' });
    userEvent.click(secondCheckbox);
    expect(secondCheckbox).toBeChecked();
    userEvent.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();
    expect(setYear).toHaveBeenCalled();

    const filterButton = screen.getByText(/apply filters/i);
    userEvent.click(filterButton);
    expect(setOpen).toHaveBeenCalled();
  });

  it('should render the filters drawer', async () => {
    render(<FiltersAccordionWrapper />);

    // Open Sites Accordion
    const sitesButton = screen.getByRole('button', { name: /sites/i });
    expect(screen.getByText(/all sites/i)).toBeInTheDocument();

    within(sitesButton).getByText(/2 more/i);
    const allCheckBox = screen.getByRole('checkbox', { name: /all sites/i });
    const croftonCheckBox = screen.getByRole('checkbox', { name: /crofton elementary school/i });
    const servernaCheckBox = screen.getByRole('checkbox', { name: /severna park high school/i });
    const woodsideCheckBox = screen.getByRole('checkbox', { name: /woodside elementary school/i });

    // Initial load, all should be selected
    expect(allCheckBox).toBeChecked();
    expect(croftonCheckBox).toBeChecked();
    expect(servernaCheckBox).toBeChecked();
    expect(woodsideCheckBox).toBeChecked();

    userEvent.click(croftonCheckBox);
    expect(croftonCheckBox).not.toBeChecked();
    expect(allCheckBox).not.toBeChecked();
    within(sitesButton).getByText(/1 more/i);

    userEvent.click(allCheckBox);
    expect(allCheckBox).toBeChecked();
    expect(croftonCheckBox).toBeChecked();
    expect(servernaCheckBox).toBeChecked();
    expect(woodsideCheckBox).toBeChecked();
    within(sitesButton).getByText(/2 more/i);

    userEvent.click(croftonCheckBox);
    userEvent.click(croftonCheckBox);
    expect(allCheckBox).toBeChecked();
  });

  it('renders sites accordion', async () => {
    const cb = jest.fn();
    render(
      <Provider initialValues={[[sitesAtom, [sitesNames.serverna]]] as unknown as [Atom<any>, any]}>
        <FiltersAccordionWrapper setOpen={cb} />
      </Provider>
    );

    const sitesButton = screen.getByRole('button', { name: /sites/i });

    const allCheckBox = screen.getByRole('checkbox', { name: /all sites/i });
    const croftonCheckBox = screen.getByRole('checkbox', { name: /crofton elementary school/i });
    const severnaCheckbox = screen.getByRole('checkbox', { name: /severna park high school/i });
    const woodsideCheckBox = screen.getByRole('checkbox', { name: /woodside elementary school/i });

    expect(allCheckBox).not.toBeChecked();
    expect(croftonCheckBox).not.toBeChecked();
    expect(severnaCheckbox).toBeChecked();
    expect(woodsideCheckBox).not.toBeChecked();

    // test local state persists
    userEvent.click(croftonCheckBox);
    userEvent.click(sitesButton);
    userEvent.click(sitesButton);
    expect(croftonCheckBox).toBeChecked();

    const applyButton = screen.getByText(/apply filters/i);
    const clearButton = screen.getByText(/clear all/i);
    userEvent.click(applyButton);
    userEvent.click(clearButton);
    expect(cb).toHaveBeenCalled();
  });

  it('works with grades', async () => {
    render(
      <Provider initialValues={[[gradesAtom, ['1', '2']]] as unknown as [Atom<any>, any]}>
        <FiltersAccordionWrapper />
      </Provider>
    );

    // Open site
    const gradeButton = screen.getByText(/^grades$/i);

    // Given all grades are saved in atom, all should be checked
    const allCheckBox = screen.getByRole('checkbox', { name: /all grades/i });
    const g1CheckBox = screen.getByRole('checkbox', { name: /grade 1/i });
    const g2CheckBox = screen.getByRole('checkbox', { name: /grade 2/i });
    expect(allCheckBox).not.toBeChecked();
    expect(g1CheckBox).toBeChecked();
    expect(g2CheckBox).toBeChecked();

    // Uncheck G1, AG should be unchecked
    userEvent.click(g1CheckBox);
    expect(allCheckBox).not.toBeChecked();
    expect(g1CheckBox).not.toBeChecked();
    expect(g2CheckBox).toBeChecked();

    // Uncheck G2
    userEvent.click(g2CheckBox);
    expect(g2CheckBox).not.toBeChecked();
    expect(allCheckBox).not.toBeChecked();

    // AG should check all
    userEvent.click(allCheckBox);
    expect(allCheckBox).toBeChecked();
    expect(g1CheckBox).toBeChecked();
    expect(g2CheckBox).toBeChecked();

    // Uncheck AG, G1, reopen drawer, only G2 is checked
    userEvent.click(allCheckBox);
    userEvent.click(gradeButton);
    userEvent.click(gradeButton);
    expect(allCheckBox).not.toBeChecked();
    expect(g1CheckBox).not.toBeChecked();
    expect(g2CheckBox).not.toBeChecked();
  });

  it('works with dates', async () => {
    render(
      <Provider initialValues={[[currentSchoolYearAtom, '2023']] as unknown as [Atom<any>, any]}>
        <FiltersAccordionWrapper />
      </Provider>
    );

    const dateFiltersButton = screen.getByText(/^start date between$/i);
    userEvent.click(dateFiltersButton);
    expect(screen.getByText(/^start date:$/i)).toBeInTheDocument();
    expect(screen.getByText(/^end date:$/i)).toBeInTheDocument();
    expect(screen.getByText(/01\/01\/2023/i)).toBeInTheDocument();
    expect(screen.getByText(/12\/31\/2023/i)).toBeInTheDocument();

    const [startDateInput, endDateInput] = screen.getAllByPlaceholderText('MM/DD/YYYY');
    userEvent.clear(startDateInput);
    userEvent.type(startDateInput, '02/01/2023');

    userEvent.clear(endDateInput);
    userEvent.type(endDateInput, '11/30/2023');

    userEvent.click(dateFiltersButton);
    expect(screen.getByText(/02\/01\/2023/i)).toBeInTheDocument();
    expect(screen.getByText(/11\/30\/2023/i)).toBeInTheDocument();
  });

  it('works with status', async () => {
    render(<FiltersAccordionWrapper />);

    const statusFiltersButton = screen.getByText(/^status$/i);
    userEvent.click(statusFiltersButton);
    const statuses = ['Completed', 'In Progress', 'Scheduled', 'No Test Scheduled', 'Canceled'];
    statuses.forEach((s) => expect(screen.getAllByText(s).length).toBeGreaterThan(0));
  });

  it('should work with assessment', () => {
    render(<FiltersAccordionWrapper />);

    const assessmentButton = screen.getByText(/^assessment period$/i);
    userEvent.click(assessmentButton);
    const beginning = screen.getByRole('checkbox', { name: /beginning of year/i });
    const middle = screen.getByRole('checkbox', { name: /middle of year/i });
    const end = screen.getByRole('checkbox', { name: /end of year/i });
    expect(screen.getByText(/middle of year/i)).toBeInTheDocument();
    expect(screen.getByText(/end of year/i)).toBeInTheDocument();
    expect(screen.getAllByText(/show all/i)).toHaveLength(3);

    // uncheck all
    userEvent.click(beginning);
    expect(beginning).not.toBeChecked();
    userEvent.click(middle);
    userEvent.click(end);

    userEvent.click(middle);
    userEvent.click(end);

    const showAllRadioArr = screen.getAllByRole('radio', { name: /show all/i });
    const mostRecentRadioArr = screen.getAllByRole('radio', { name: /most recent/i });
    expect(showAllRadioArr[0]).toBeDisabled();

    userEvent.click(middle);
    userEvent.click(end);
    expect(middle).toBeChecked();
    expect(end).toBeChecked();
    const midMostRecent = mostRecentRadioArr[1];
    userEvent.click(midMostRecent);
    expect(midMostRecent).toBeChecked();
  });

  it('has no valid orgs', async () => {
    render(
      <FiltersDrawer
        gradesInfo={[]}
        setHomePageSchoolYear={jest.fn()}
        schoolYearsLabels={schoolYearLabels}
        mappedGrades={gradesMock}
        siteListContent={[]}
      />
    );

    expect(screen.queryByText(/sites/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/grade/i)).not.toBeInTheDocument();
  });
});
