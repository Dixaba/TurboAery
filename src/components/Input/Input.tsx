import React from 'react';

interface IInputProps {
  type: 'email' | 'password' | 'text';
  value?: string;
  name: string;
  label?: string;
  pattern?: string;
  placeholder?: string;
  onChange?(event: any): void;
}

const Input: React.FunctionComponent<IInputProps> = (props) => {
  return (
    <>
      {console.log(props.value)}
      {props.label ? <label>{props.label}</label> : null}
      <input
        type={props.type}
        value={props.value}
        name={props.name}
        pattern={props.pattern}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
    </>
  );
};

export default React.memo(Input);
