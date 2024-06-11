import React from 'react';
import styles from './Footer.module.scss';
import scholasticLogo from '../../../assets/images/scholastic-logo.svg';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <span className={styles.logoContainer}>
        <a href="https://www.scholastic.com/aboutscholastic" target="_blank" rel="noreferrer">
          <img alt="Scholastic Logo" src={scholasticLogo} />
        </a>
      </span>
      <div className={styles.linksContainer}>
        <a
          href="https://educationsolutions.scholastic.com/privacypolicy.html"
          target="_blank"
          rel="noreferrer"
        >
          Privacy Policy
        </a>
        <a href="https://www.scholastic.com/terms.htm" target="_blank" rel="noreferrer">
          Terms of Use
        </a>
      </div>
      <small>TM ® & © {new Date().getFullYear()} Scholastic Inc. All Rights Reserved.</small>
    </footer>
  );
};

export default Footer;
