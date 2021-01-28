import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';


const AppRouter = () => (
  <BrowserRouter>
    <Route
      path='/:parameter1/:parameter2/:parameter3'
      render={props => <App {...props} />}
    />
  </BrowserRouter>
);


const App = props => {
  const { parameter1, parameter2, parameter3 } = props.match.params;
  return (
    <div>
      First: {parameter1} <br />
      Second: {parameter2} <br />
      Third: {parameter3} <br />
    </div>
  );
};


ReactDOM.render(<AppRouter />, document.getElementById('root'));
