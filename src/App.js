import React, { useState, useEffect } from 'react';

function Greeting({ initialName = '' }) {
  const savedName = localStorage.getItem('name');
  const [name, setName] = useState(!savedName ? initialName : savedName);

  useEffect(() => {
    name && localStorage.setItem('name', name);
  }, [name]);

  function handleChange(event) {
    setName(event.target.value);
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  );
}

function App() {
  return <Greeting />;
}

export default App;
