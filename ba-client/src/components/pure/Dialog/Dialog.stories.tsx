import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Dialog from './Dialog';

const tempTitle = 'Edit SRM Assessment';
export default {
  title: 'Example/Dialog',
  component: Dialog,
  args: { title: tempTitle }
} as ComponentMeta<typeof Dialog>;

const Template: ComponentStory<typeof Dialog> = (args) => {
  return <Dialog {...args} />;
};

export const Default = Template.bind({});

export const WithRandomContent = Default.bind({});

WithRandomContent.args = {
  content: (
    <table>
      <tr>
        <th>Company</th>
        <th>Contact</th>
        <th>Country</th>
      </tr>
      <tr>
        <td>Alfreds Futterkiste</td>
        <td>Maria Anders</td>
        <td>Germany</td>
      </tr>
      <tr>
        <td>Centro comercial Moctezuma</td>
        <td>Francisco Chang</td>
        <td>Mexico</td>
      </tr>
    </table>
  )
};

export const OpenByDefault = Default.bind({});

OpenByDefault.args = {
  isOpen: true
};

export const EditAssessmentDialog = Default.bind({});

const dialogContent = (
  <div>
    <h5>Assessment Guidelines</h5>
    <p>
      Students must begin the SRM within four weeks of the start date. After that, the assignment
      will expire. Once students start the SRM, they must complete it within 2 weeks. After that,
      the SRM will be canceled and any work deleted.
    </p>
  </div>
);

const dialogHeader = (
  <div>
    <h3>Edit SRM Assessment</h3>
    <p>Student Name: Lauren Kelliher</p>
  </div>
);

EditAssessmentDialog.args = {
  content: dialogContent,
  title: dialogHeader
};
