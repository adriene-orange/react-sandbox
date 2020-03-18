import React from 'react';
import { render } from 'react-dom';
import runMockServer from './mockServer';
import App from './app';

if (process.env.NODE_ENV === 'development') {
  runMockServer();
}

render(React.createElement(App), document.getElementById('root'));
