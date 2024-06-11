import '!style-loader!css-loader!sass-loader!../src/index.scss';

const viewports = {
  mobile: {
    name: 'Mobile',
    styles: {
      width: '320px',
      height: '568px'
    },
    type: 'mobile'
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px'
    },
    type: 'tablet'
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1366px',
      height: '768px'
    },
    type: 'desktop'
  }
};

export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i
    }
  },
  viewport: {
    viewports
  }
};
