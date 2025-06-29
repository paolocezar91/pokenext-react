import MenuXs from '@/components/layout/navbar/menu-xs';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

jest.mock('@/components/layout/navbar/search', () => jest.fn(() => <div>Search</div>));
jest.mock('@/components/layout/navbar/nav-link', () => jest.fn(({ href, children }) => <a href={href}>{children}</a>));
jest.mock('@/components/layout/navbar/nav-user-auth/nav-user-auth', () => jest.fn(() => <div>NavSearch</div>));
jest.mock('@/context/UserContext', () => ({
  useUser: () => ({
    settings: { }
  })
}));

describe('MenuXs', () => {
  it('renders children inside the menu', () => {
    render(
      <MenuXs></MenuXs>
    );
  });
});
