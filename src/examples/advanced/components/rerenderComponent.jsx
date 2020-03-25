import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ReRenderComponent = ({ status }) => {
  useEffect(() => {
    if (status) {
      console.log('The component has mounted');
    }
    return () => { console.log('The component is unmounting'); };
  }, []);
  useEffect(() => {
    if (status) {
      console.log(`The status is ${status}`);
    }
  }, [status]);

  switch (status) {
    case 'LOADED':
      return <h1>Hello world</h1>;
    case 'LOADING':
      return <span>Loading...</span>;
    default:
      return null;
  }
};

export default ReRenderComponent;
