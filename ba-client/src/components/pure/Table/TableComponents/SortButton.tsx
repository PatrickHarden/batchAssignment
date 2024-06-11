import React from 'react';
import { ReactComponent as TriangleUp } from '../../../../assets/icons/Triangle.svg';
import { ReactComponent as TriangleDown } from '../../../../assets/icons/TriangleDown.svg';
import styles from '../Table.module.scss';

interface SortButtonProps<Key> {
  isAlphabetical: boolean;
  columnId: Key;
  onSortAlphabetically: (key: Key, alphabetical: boolean) => void;
}

export default function SortButton<Key>({
  isAlphabetical,
  onSortAlphabetically,
  columnId
}: SortButtonProps<Key>) {
  return (
    <button
      onClick={() => {
        onSortAlphabetically(columnId, !isAlphabetical);
      }}
      className={isAlphabetical ? styles.arrows : styles.invertedArrows}
    >
      <span className="sr-only">Sort</span>
      <TriangleUp data-testid="sortAscending" />
      <TriangleDown data-testid="sortDescending" />
    </button>
  );
}
