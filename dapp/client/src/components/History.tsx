import React from 'react';
import { Link } from 'react-router-dom';
  
function History() {
  return (
    <div>
      <header>
        <p>History component</p>
  
        <Link to="/">go back</Link>
      </header>
    </div>
  );
}

export default History;