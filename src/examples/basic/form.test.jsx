import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import BasicForm from './components/basicForm';


describe('Intro to RTL with a Basic Form', () => {
  /*
    Why "createElement" and not JSX (<BasicForm />
    JSX is syntatical sugar, intended to make component trees easier to read
    However, there's a cost at compile time for JSX which is why unless
    I need to nest components, I usually just opt to use createElement
    This is just a bit of code style/preference and isn't a hard rule
  */
  const renderComponent = (props = {}) => render(React.createElement(BasicForm, props));

  // Testing strategies
  // Contract testing
  describe('Contract Tests', () => {
    // Data that is passed into a component either via props, redux connect() or useSelector
    // defines the contract of the component
    // internal state (component state/or data generated from utils in the component) are behavioral not contractual
    // state pulled off of redux via useSelector is
    // When data is expected to be passed into a component we need to define that contract and test for contract violations
    // You do not need to split out contract tests from behavioral tests
    // I'm splitting them out as an exercise
    // You can think of Component contract tests as looking for your 200, 400, and 500 cases

    // Food for thought: Is it okay to explicitly throw errors or allow errors to bubble up?
    // Should components just be written to handle all edge cases gracefully?
    // Answer: It depends, sometimes handling errors gracefully means failing silently
    // For non-essential components that's fine, but if the entire form were to fail to render
    // and an error wasn't logged or thrown, that results in a loss of observability in the client
    // sometimes throwing custom excepts makes it easier for devs to debug later

    // Honestly if we have a statically typed language this wouldn't even be a problem
    test('BasicForm renders a form with a header when the required header is passed in', () => {
      const props = {
        nonOptionalHeader: 'PB & J Anonymous',
      };
      const { container } = renderComponent(props);
      // This is essentially a renders without crashing test
      expect(container.firstChild).not.toBeEmpty();
    });
    test('BasicForm throws an error if nonOptionalHeader is falsy', () => {
      const props = {
        nonOptionalHeader: undefined,
      };
      // You can pass expect a callback function to help test for expected errors
      expect(() => renderComponent(props)).toThrowError('nonOptionalHeader is non-optional');
    });
    test('BasicForm throws an error if nonOptionalHeader isn\'t a string', () => {
      const props = {
        nonOptionalHeader: 21122,
      };
      // You can pass expect a callback function to help test for expected errors
      expect(() => renderComponent(props)).toThrow();
    });
  });

  // Behavior testing - the tests you're used to writing
  describe('Behavior Tests', () => {
    // Component behavior:
    // First render
    // Rerenders - UI interaction or prop changes (bulk of testing)
    // Unmount
    test('renders an interactive login form with empty values', () => {
      const props = {
        nonOptionalHeader: 'PB & J Anonymous',
      };
      const {
        getByText,
        getByPlaceholderText,
        getByLabelText,
      } = renderComponent(props);

      // Basic check that an element is visible
      const formTitle = getByText(props.nonOptionalHeader, { exact: false });
      expect(formTitle).toBeVisible();

      // Slightly better selector than getByText since we tend to hide
      // instructions in placeholders
      const userNameInput = getByPlaceholderText('Enter your username');

      // Assert expected initial state of this element
      expect(userNameInput).toBeVisible();
      expect(userNameInput).toHaveValue('');
      expect(userNameInput).toBeEnabled();

      // Even better selector
      const passwordInput = getByLabelText('Password');

      // Assert expected initial state of this element
      expect(passwordInput).toBeVisible();
      expect(passwordInput).toHaveValue('');
      expect(passwordInput).toBeEnabled();

      const submitButton = getByText('Login');
      expect(submitButton).toBeVisible();
      expect(submitButton).toBeEnabled();
    });
    // Test edge cases
    test('renders an optional header if provided', () => {
      const props = {
        nonOptionalHeader: 'PB & J Anonymous',
        optionalHeader: 'Sandwiches are life',
      };
      const {
        getByText,
      } = renderComponent(props);

      // Basic check that an element is visible
      const formTitle = getByText(props.optionalHeader);
      expect(formTitle).toBeVisible();
    });
    test('disables the form while a login attempt is pending', async () => {
      const props = {
        nonOptionalHeader: 'PB & J Anonymous',
      };
      const {
        getByLabelText,
        getByText,
      } = renderComponent(props);

      const userNameInput = getByLabelText('Username');
      const passwordInput = getByLabelText('Password');
      const submitButton = getByText('Login');

      fireEvent.change(userNameInput, { target: { value: 'thunderKitten' } });
      fireEvent.change(passwordInput, { target: { value: '1234abcd' } });
      fireEvent.click(submitButton);

      // When there is an expectation that state might be transition a few times
      // using wait will ping the DOM until the assertions all return true
      // or there is a timeout
      await wait(() => [
        expect(userNameInput).toBeDisabled(),
        expect(passwordInput).toBeDisabled(),
        expect(submitButton).toBeDisabled(),
      ]);
    });
    test('displays a username when a login was successful', async () => {
      const props = {
        nonOptionalHeader: 'PB & J Anonymous',
      };
      const {
        getByLabelText,
        getByText,
      } = renderComponent(props);

      const userNameInput = getByLabelText('Username');
      const passwordInput = getByLabelText('Password');
      const submitButton = getByText('Login');

      fireEvent.change(userNameInput, { target: { value: 'thunderKitten' } });
      fireEvent.change(passwordInput, { target: { value: '1234abcd' } });
      fireEvent.click(submitButton);

      // When there is an expectation that state might be transition a few times
      // using wait will ping the DOM until the assertions all return true
      // or there is a timeout
      await wait(() => [
        expect(getByText('Kitten Thunder')).toBeVisible(),
        expect(userNameInput).toBeDisabled(),
        expect(userNameInput).toHaveValue('thunderKitten'),
        expect(passwordInput).toBeDisabled(),
        expect(passwordInput).toHaveValue('1234abcd'),
        expect(submitButton).toBeDisabled(),
      ]);
    });
  });
  test('displays an error when the account does not exist', async () => {
    const props = {
      nonOptionalHeader: 'PB & J Anonymous',
    };
    const {
      getByLabelText,
      getByText,
    } = renderComponent(props);

    const userNameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    const submitButton = getByText('Login');

    fireEvent.change(userNameInput, { target: { value: 'sushiR1tto7' } });
    fireEvent.change(passwordInput, { target: { value: 'piesAreSandwiches!' } });
    fireEvent.click(submitButton);

    await wait(() => [
      expect(getByText('Account does not exist')).toBeVisible(),
      expect(userNameInput).toHaveValue('sushiR1tto7'),
      expect(userNameInput).toBeEnabled(),
      expect(passwordInput).toBeEnabled(),
      expect(passwordInput).toHaveValue('piesAreSandwiches!'),
      expect(submitButton).toBeEnabled(),
    ]);
  });
  // More tests, test password length, test password is wrong
  // Notes: wait and waitForElement are deprecated waitFor is the replacement
});
