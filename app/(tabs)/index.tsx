import React, { useState } from 'react';
import store from '../../redux/store';
import { Provider, useSelector } from 'react-redux';
import AppForStore from "./AppForStore";

const App = () => {

  return (
  <Provider store={store}>
    <AppForStore />
   </Provider> 
  );
};

export default App;