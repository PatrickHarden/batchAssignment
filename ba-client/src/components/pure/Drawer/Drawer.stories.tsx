import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Drawer, { DrawerProps } from './Drawer';
import { ReactComponent as FilterIcon } from '../../../assets/icons/filter.svg';
import styles from './Drawer.stories.module.scss';
import Accordion, { AccordionItem } from '../Accordion/Accordion';

export default {
  title: 'Example/Drawer',
  component: Drawer
} as ComponentMeta<typeof Drawer>;

const Template: ComponentStory<typeof Drawer> = (args) => <Drawer {...args} />;

interface FooterProps {
  leftLabel: string;
  rightLabel: string;
}

const Footer = ({ leftLabel: applyLabel, rightLabel: cancelLabel }: FooterProps) => {
  return (
    <div className={styles.buttonRow}>
      <button className={styles.applyButton}>{applyLabel}</button>
      <button className={styles.cancelButton}>{cancelLabel}</button>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'Select Filters',
  triggerTitle: 'Trigger',
  children: (
    <div style={{ marginLeft: '40px' }}>
      {Array.from({ length: 10 }, (_, i) => (
        <p key={i}>{`${i + 1} line`}</p>
      ))}
    </div>
  )
} as ComponentMeta<typeof Drawer>;

export const WithOverflow = Template.bind({});
WithOverflow.args = {
  ...Default.args,
  footer: <Footer leftLabel="Apply" rightLabel="Cancel" />,
  triggerIcon: <FilterIcon />,
  headerIcon: <FilterIcon />,
  children: (
    <div style={{ marginLeft: '40px' }}>
      {Array.from({ length: 50 }, (_, i) => (
        <p key={i}>{`${i + 1} line`}</p>
      ))}
    </div>
  )
};

const DrawerInternal = Template.bind({});
DrawerInternal.args = {
  ...WithOverflow.args,
  triggerTitle: 'With Footer',
  className: styles.sbMargin
};

export const WithFooter = () => {
  return (
    <>
      <h1>Drawer Component with footer and styling</h1>
      <DrawerInternal {...(DrawerInternal.args as DrawerProps)} />
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, hic! Totam, a velit.
        Deserunt, iste explicabo vel repellat reiciendis eveniet nesciunt vitae totam aspernatur quo
        tempore amet similique, consequatur officia?
      </p>
    </>
  );
};

const makeItems = (length: number) => {
  return Array.from({ length }, (_, i) => ({
    title: `item-${i + 1}`,
    children: <p>{`content-${i + 1}`}</p>
  }));
};
const items = makeItems(10);

export const WithAccordion = Template.bind({});
WithAccordion.args = {
  ...Default.args,
  triggerTitle: 'Filters',
  triggerIcon: <FilterIcon />,
  headerIcon: <FilterIcon />,
  footer: <Footer leftLabel="Clear All" rightLabel="Apply Filters" />,
  children: (
    <Accordion>
      {items.map(({ title, children }) => (
        <AccordionItem key={title} title={title}>
          {children}
        </AccordionItem>
      ))}
    </Accordion>
  )
};
