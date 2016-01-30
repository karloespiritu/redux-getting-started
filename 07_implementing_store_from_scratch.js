// reducer
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  //only way to change state, call reducer fxn
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  //get the initial store populated
  dispatch({});

  return { getState, dispatch, subscribe };
};



// const { createStore } = Redux;
// var createStore = Redux.createStore;
// import { createStore } from 'redux';

const store = createStore(counter);
// console.log(store.getState());

// const render = () => {
//   ReactDOM.render(
//     <Counter value={store.getState()} />,
//     document.getElementById('root')
//   );
// };

// original manual
// const render = () => {
//   document.body.innerText = store.getState();
// };

// store.dispatch({ type: 'INCREMENT' });
// console.log(store.getState());

const render = () => {
  document.body.innerText = store.getState();
}

store.subscribe(render);
render();

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });
});
