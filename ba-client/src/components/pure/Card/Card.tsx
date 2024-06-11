import React, { ReactNode } from 'react';
import styles from './Card.module.scss';
import { cx } from 'classix';

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
}
const Card = ({ children, className, ...rest }: CardProps) => {
  return (
    <section className={cx(styles.card, className)} {...rest}>
      {children}
    </section>
  );
};

export default Card;
