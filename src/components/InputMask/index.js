import React from 'react';
import MaskedInput from 'react-text-mask';

export const  PhoneMask = ({ inputRef, ...other }) => {
  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      placeholder="000-000-0000"
      guide={false}
      mask={[/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      showMask
    />
  );
};

export const NpiMask = ({ inputRef, ...other }) => {
  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      guide={false}
      mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
      showMask
    />
  );
};

