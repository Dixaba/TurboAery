import React, { useState, useCallback, useMemo, SyntheticEvent, useEffect } from 'react';
import Form from '../Form';
import Input from '../Input';
import Button from '../Button';
const { ipcRenderer } = require('electron');

const App: React.FunctionComponent = () => {

  const [firstname, setFirstname] = useState('');
  const [secondname, setSecondname] = useState('');

  useEffect(() => {

    console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

    ipcRenderer.on('asynchronous-reply', (event: Event, arg: any[]) => {
      console.log(event, arg) // prints "pong"
    })
    ipcRenderer.send('asynchronous-message', 'ping')
  }, [])

  const handleInput = useCallback(({ target }) => {
    const { value, name } = target;
    if (name === 'firstname') {
      setFirstname(value)
    } else {
      setSecondname(value)
    }
  }, []);

  const handleSubmit = useCallback((event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();

    console.log();
  }, []);

  const memoFrom = useMemo(() => (
    <Form>
      <Input
        type='text'
        name='firstname'
        label='Firstname'
        placeholder='John'
        onChange={handleInput}
      />
      <br />
      <Input
        type='text'
        name='secondname'
        label='Secondname'
        placeholder='Doe'
        onChange={handleInput}
      />
      <br />
      <Button type={'submit'} onSubmit={handleSubmit}>Submit</Button>
    </Form>), [handleInput, handleSubmit])

  return (
    <>
      {memoFrom}
      <br />
      {firstname}
      {secondname}
    </>
  );
}

export default App;
