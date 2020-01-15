import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import styled from 'styled-components'


import Panel from './Components/Panel';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
       <Panel/>
    );
  }
}

export default App;
