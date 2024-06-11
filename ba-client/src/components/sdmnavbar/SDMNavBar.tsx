import React, { FunctionComponent } from 'react';
import styles from './SDMNavBar.module.scss';
import logo from '../../assets/images/srm-logo.svg';
import home from '../../assets/images/home.svg';
import { useAtomValue } from 'jotai';
import { sdmInfoAtom } from '../../atoms/sdmInfoAtom';

const srmUrl = {
  stage: 'https://srm.dev.micro.scholastic.com/',
  qa: 'https://srm.qa.micro.scholastic.com/',
  perf: 'https://srm.perf.micro.scholastic.com/',
  prod: 'https://srm.prod.micro.scholastic.com/'
};

const SDMNavBar: FunctionComponent = () => {
  const sdmInfo = useAtomValue(sdmInfoAtom);
  const env = sdmInfo.env || 'prod';

  return (
    <div className={styles.navbar}>
      <a className={styles.homeIcon} href={srmUrl[env]}>
        <img src={home} data-testid="navbar-home" alt="SRM home" />
      </a>
      <h1 className={styles.srmLogo}>
        <img src={logo} data-testid="navbar-srm-logo" alt="Scholastic Reading Measure" />
      </h1>
      <div className={styles.navBarAuth}>
        <div id="sdm-nav" className={styles.navBarAuthMain}></div>
      </div>
    </div>
  );
};

export default SDMNavBar;
