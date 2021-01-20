import React from 'react';
import CalendarContainer from './calendarContainer';
import CentralContainer from './centralContainer';
import RightContainer from './rightContainer';
import './App.css';

function App() {
  return (
    <div className = "mainContainer">
      <CalendarContainer />
      <CentralContainer />
      <RightContainer />
    </div>
  );
}

export default App;
