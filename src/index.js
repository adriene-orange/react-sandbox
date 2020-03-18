import React from 'react';
import { render } from 'react-dom';
import runMockServer from './mirageJS/mockServer';
import App from './mirageJS/app';

// Run the mock server from MirageJS
if (process.env.NODE_ENV === 'development') {
  runMockServer();
}

render(React.createElement(App), document.getElementById('root'));
