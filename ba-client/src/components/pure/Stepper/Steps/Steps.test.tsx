import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Steps, { StepsProps } from './Steps';

const subheader = 'I am an original subheading';

const mockStepsProps: StepsProps = {
  header: 'heading',
  subheader: subheader,
  content: 'Words'
};

const mockStepsPropsNoHeader: StepsProps = {
  header: 'heading',
  content: 'Words'
};

it('should render the steps header, subheader, and content', async () => {
  render(
    <MemoryRouter>
      <Steps {...mockStepsProps} />
    </MemoryRouter>
  );

  expect(screen.getByText('heading')).toBeInTheDocument();
  expect(screen.getByText(subheader)).toBeInTheDocument();
  expect(screen.getByText('Words')).toBeInTheDocument();
});

it("should not render the subheader if it doesn't exist", async () => {
  render(
    <MemoryRouter>
      <Steps {...mockStepsPropsNoHeader} />
    </MemoryRouter>
  );

  expect(screen.getByText('heading')).toBeInTheDocument();
  expect(screen.queryByText(subheader)).not.toBeInTheDocument();
  expect(screen.getByText('Words')).toBeInTheDocument();
});
