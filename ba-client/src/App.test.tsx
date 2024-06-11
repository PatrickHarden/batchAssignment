import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { getSDMNavCTXCookie } from './utils/cookie-util';
import { Atom, Provider } from 'jotai';
import { sdmInfoAtom } from './atoms/sdmInfoAtom';

jest.mock('@scholastic/volume-react', () => ({
  Button: () => <></>,
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Dropdown: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownCheckbox: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('./utils/cookie-util', () => ({ getSDMNavCTXCookie: jest.fn() }));

const AppProvider = ({ sdmJson }: { sdmJson: { [key: string]: any } }) => {
  return (
    <Provider initialValues={[[sdmInfoAtom, sdmJson]] as unknown as [Atom<any>, any]}>
      <App />
    </Provider>
  );
};

describe('<App />', () => {
  beforeAll(() => {
    const token =
      '{"user_id":"15856652","name":"John P","portalBaseUrl":"https://digital.scholastic.com","orgId":"2492","orgName":"EDUCATION DIGITAL ACCOUNT","orgType":"school","appCodes":["litpro","ooka","word"],"extSessionId":"ed783733-03d0-43d6-8159-4960452585fb","extSessionEndpoint":"https://tfphnn9jh6.execute-api.us-east-1.amazonaws.com/prod/extendedsession","appCode":"litpro","appId":"44","parentOrgId":"4","env":"prod","easyLogin":false,"role":"student","classIds":["3988819"],"primaryTeacherIds":["6682861"]}';

    (getSDMNavCTXCookie as jest.Mock).mockReturnValue({
      sdm_nav_ctx: token
    });
  });

  it('should find heading and paragraph elements', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      text: jest.fn(() => Promise.resolve('Hello, World!'))
    } as unknown as Promise<Response>);

    render(<AppProvider sdmJson={{ user_id: '1234', orgId: '123456', portalBaseUrl: 'url' }} />);

    const header = screen.getByTestId('header');
    const mainElement = screen.getByTestId('main');

    expect(header).toBeInTheDocument();
    expect(mainElement).toBeInTheDocument();
  });
});

it('renders on admin route', () => {
  const adminToken =
    '{"user_id":"15856652","name":"John P","portalBaseUrl":"https://digital.scholastic.com","orgId":"2492","orgName":"EDUCATION DIGITAL ACCOUNT","orgType":"school","appCodes":["litpro","ooka","word"],"extSessionId":"ed783733-03d0-43d6-8159-4960452585fb","extSessionEndpoint":"https://tfphnn9jh6.execute-api.us-east-1.amazonaws.com/prod/extendedsession","appCode":"litpro","appId":"44","parentOrgId":"4","env":"prod","easyLogin":false,"role":"student","classIds":["3988819"],"primaryTeacherIds":["6682861"], "admin": true}';

  (getSDMNavCTXCookie as jest.Mock).mockReturnValue({
    sdm_nav_ctx: adminToken
  });

  jest.spyOn(global, 'fetch').mockResolvedValue({
    text: jest.fn(() => Promise.resolve('Hello, World!'))
  } as unknown as Promise<Response>);

  render(
    <AppProvider
      sdmJson={{ user_id: '1234', orgId: '123456', portalBaseUrl: 'url', admin: true }}
    />
  );

  const windowHref = window.location.href;
  const url = windowHref.replace('http://localhost', '');
  expect(url).toBe('/admin');
});
