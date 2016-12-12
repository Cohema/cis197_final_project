var React = require('react');
var ReactDOM = require('react-dom');
var redux = require('redux');

// REDUX EXAMPLE

var reducer = function (state, action) {
  if (action.type === 'INCR') {
    return state + 1;
  } else if (action.type === 'DECR') {
    return state - 1;
  }
  return state;
};

// create store with initial state 10
var store = redux.createStore(reducer, 10);
store.subscribe(function () {
  console.log(store.getState());
});

store.dispatch({type: 'INCR'});
store.dispatch({type: 'INCR'});
store.dispatch({type: 'DECR'});
store.dispatch({type: 'DECR'});

// END REDUX EXAMPLE


var HelloWorld = React.createClass({
  render: function () {
    return (
      <h1>Hello {this.props.name}!</h1>
    );
  }
});

var LikeButton = require('./LikeButton.jsx');
var GrowingList = require('./GrowingList.jsx');

ReactDOM.render(
  <GrowingList />,
  document.getElementById('container')
);
