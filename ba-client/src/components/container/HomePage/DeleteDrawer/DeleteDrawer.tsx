import React from 'react';
import cx from 'classix';
import style from './DeleteDrawer.module.scss';

export interface DeleteDrawerProps {
  setOpen?: (open: boolean) => void;
}

export default function DeleteDrawer({ setOpen }: DeleteDrawerProps) {
  if (!setOpen) {
    throw new TypeError('DeleteDrawer requires setOpen to be passed');
  }
  return (
    <section className={style.deleteDrawerActionWrapper}>
      <button
        className={cx('button--white-black', style.deleteDrawerButton)}
        onClick={() => setOpen(false)}
      >
        Cancel
      </button>
      <button
        className={cx('button--clifford-red', style.deleteDrawerButton)}
        onClick={() => setOpen(false)}
      >
        Delete Score
      </button>
    </section>
  );
}
