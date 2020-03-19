import React from 'react';

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

export default FormattedPrice;
