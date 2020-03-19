import React from 'react';
import { render } from '@testing-library/react';
/* eslint-disable  react/prop-types */
// import FormattedPrice from './components/formattedPrice';


describe('Querying for Abnormal Text', () => {
  // There's a few different ways you can test for text
  // That is broken across several elements
  test('text is broken across several elements - container query', () => {
    // Component to test is a formatted Price, where dollars and cents are split
    const FormattedPrice = ({ price }) => {
      const [dollars, cents] = price.split('.');
      return (
        <>
          $
          <span>{dollars}</span>
          {cents}
        </>
      );
    };

    const price = '12.34';
    const { container, getByText } = render(<FormattedPrice price={price} />);

    // In this example our component is really simple, but text is broken across both lines and elements
    // Because the root "element" of our component is a Fragment, the container element
    // when we render will be the default DOM element render provides which is a div

    // This makes testing our component pretty easy because we can just assert that the container
    // has text content that equals what we expect to be rendered

    expect(container).toHaveTextContent('$1234');

    // Or you can query for part of the expected text, the query will return the element
    // that matches the partial text
    // In this case we'd want to query for '$'

    expect(getByText('$', { exact: false })).toHaveTextContent('$1234');

    // toHaveTextContent is an extension RTL provides on jest's expect lib
    // It's full of very useful assertions toBeVisible(), toBeChecked(), toHaveValue()
  });
  // test('text is broken across several lines', () => {

  // });
});
