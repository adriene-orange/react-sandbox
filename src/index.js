import React from 'react';
import { render } from 'react-dom';
import superagent from 'superagent';
import runMockServer from './mockServer';
import App from './app';

window.superagent = superagent;


if (process.env.NODE_ENV === 'development') {
  runMockServer();
}

render(React.createElement(App), document.getElementById('root'));
