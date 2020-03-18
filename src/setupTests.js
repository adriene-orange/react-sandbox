import browserSuperAgent from '../node_modules/superagent/lib/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@testing-library/jest-dom/extend-expect';

// request.mockImplementation(browserSuperAgent);
window.superagent = browserSuperAgent;