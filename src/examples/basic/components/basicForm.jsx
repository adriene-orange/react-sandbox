import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const fakerUserDB = {
  thunderKitten: {
    password: '1234abcd',
    displayName: 'Kitten Thunder',
  },
};

const fakeLoginMethod = (userName, password) => {
  const existingAccount = fakerUserDB[userName];
  if (existingAccount) {
    return existingAccount.password === password
      ? { status: 200, displayName: existingAccount.displayName }
      : { status: 401, error: 'Invalid password' };
  }
  return {
    status: 404,
    error: 'Account does not exist',
  };
};

const LOADED = 'LOADED';
const LOADING = 'LOADING';

const BasicFormComponent = ({ optionalHeader, nonOptionalHeader }) => {
  // Hooks at top level
  const [uiStatus, updateUIStatus] = useState(LOADED);
  const [loginResults, setLoginResults] = useState({});
  const userRef = useRef();
  const passwordRef = useRef();

  if (!nonOptionalHeader) {
    throw new Error('nonOptionalHeader is non-optional');
  }

  const login = (e) => {
    e.preventDefault();
    updateUIStatus(LOADING);
    const username = userRef.current.value;
    const password = passwordRef.current.value;
    const { status, error, displayName } = fakeLoginMethod(username, password);
    setLoginResults({
      status,
      displayName,
      error,
    });
    updateUIStatus(LOADED);
  };
  const { status, displayName, error } = loginResults;
  const disabled = Boolean(uiStatus === LOADING || status === 200);
  return (
    <>
      <h1>{nonOptionalHeader.toUpperCase()}</h1>
      { optionalHeader && <h2>{optionalHeader}</h2> }
      { error && <span>{error}</span> }
      { displayName && <span>{displayName}</span> }
      <form onSubmit={login}>
        <label htmlFor="username-input">
          Username
          <input
            placeholder="Enter your username"
            type="text"
            required
            name="username"
            id="username-input"
            ref={userRef}
            disabled={disabled}
          />
        </label>
        <label htmlFor="password-input">
          Password
          <input
            placeholder="Enter your password"
            type="password"
            required
            name="password"
            id="password-input"
            ref={passwordRef}
            disabled={disabled}
          />
        </label>
        <button type="submit" disabled={disabled}>Login</button>
      </form>
    </>
  );
};

BasicFormComponent.propTypes = {
  optionalHeader: PropTypes.string,
  nonOptionalHeader: PropTypes.string.isRequired,
};

BasicFormComponent.defaultProps = {
  optionalHeader: null,
};

export default BasicFormComponent;
