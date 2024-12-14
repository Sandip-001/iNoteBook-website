import React from 'react'
import Notes from './Notes';
import AddNote from './AddNote';

const Home = ({ showAlert }) => {

  return (
    <div className="container my-3">
      <AddNote showAlert={showAlert} /> {/* Pass showAlert to AddNote */}
      <Notes showAlert={showAlert}/> {/* Pass showAlert to Notes */}
    </div>
  );
};

export default Home;
