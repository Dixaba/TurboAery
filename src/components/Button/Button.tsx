import React, { SyntheticEvent, PropsWithChildren, memo } from 'react';

interface IButtonProps {
  type: 'submit' | 'reset' | 'button';
  onSubmit?(event: SyntheticEvent): void;
}

const Button: React.FunctionComponent<PropsWithChildren<IButtonProps>> = (props) => {

  return (
    <button
      type={props.type}
      onSubmit={(e) => {e.preventDefault()}}
    >
      {props.children}
    </button>
  );
}

export default memo(Button);
