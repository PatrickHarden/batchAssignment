import React, { useState } from 'react';
import { ComponentMeta } from '@storybook/react';
import Accordion, { AccordionItem, AccordionItemProps } from './Accordion';
import styles from './Accordion.stories.module.scss';
import DatePicker from '../DatePicker/DatePicker';

export default {
  title: 'Example/Accordion',
  component: Accordion
} as ComponentMeta<typeof Accordion>;

export const DefaultAccordion = () => {
  return (
    <Accordion>
      <AccordionItem title="title-0" subtitle="subtitle-0" helperInfo="helper-0">
        <div className={styles.textComponent}>Item 0</div>
      </AccordionItem>
      <AccordionItem title="title-1" subtitle="subtitle-1">
        <div className={styles.textComponent}>Item 1</div>
      </AccordionItem>
      <AccordionItem title="title-2" helperInfo="helper-2">
        <div className={styles.textComponent}>Item 2</div>
      </AccordionItem>
    </Accordion>
  );
};

export const OpenAll = () => {
  return (
    <Accordion values={['title-0', 'title-1', 'title-2']}>
      <AccordionItem title="title-0" subtitle="subtitle-0" helperInfo="helper-0">
        <div className={styles.textContext}>Item 0</div>
      </AccordionItem>
      <AccordionItem title="title-1" subtitle="subtitle-1">
        <div className={styles.textContext}>Item 1</div>
      </AccordionItem>
      <AccordionItem title="title-2" helperInfo="helper-2">
        <div className={styles.textContext}>Item 2</div>
      </AccordionItem>
    </Accordion>
  );
};

const title1 = 'Date Picker 1';
const title2 = 'Date Picker 2';

export const WithDatePickers = () => {
  const [values, setValues] = useState<string[]>([]);
  const [items, setItems] = useState<AccordionItemProps[]>([
    {
      title: title1,
      children: (
        <div className={styles.datePickerContainer}>
          <DatePicker
            label="Date Picker"
            onDateChange={(date) => onDateChangeHandler(date, title1)}
          />
        </div>
      )
    },
    {
      title: title2,
      children: (
        <div className={styles.datePickerContainer}>
          <DatePicker
            label="Date Picker"
            onDateChange={(date) => onDateChangeHandler(date, title2)}
          />
        </div>
      )
    }
  ]);

  function onDateChangeHandler(date: Date, title: string) {
    setItems((prevValue) => {
      const newValue = [...prevValue];
      const idx = newValue.findIndex((item) => item.title === title);
      const item = newValue[idx];

      item.subtitle = date.toISOString();
      item.helperInfo = date.toISOString();
      item.data = date.toISOString();

      return newValue;
    });
  }

  return (
    <Accordion values={values} onValuesChange={setValues}>
      {items.map((item) =>
        item.disabled ? null : (
          <AccordionItem
            key={item.title}
            title={item.title}
            subtitle={item.subtitle}
            helperInfo={item.helperInfo}
          >
            {item.children}
          </AccordionItem>
        )
      )}
    </Accordion>
  );
};
