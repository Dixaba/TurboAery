import React, { SyntheticEvent } from 'react';

interface IFormProps {
  onSubmit?(event: SyntheticEvent): void;
}

const Form: React.FunctionComponent<React.PropsWithChildren<IFormProps>> = (props) => {
  return (
    <>
      <form>
        {props.children}
      </form>
    </>
  );
}

export default React.memo(Form);
