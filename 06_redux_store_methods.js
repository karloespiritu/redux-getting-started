// First Redux application
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

const { createStore } = Redux;
// var createStore = Redux.createStore;
// import { createStore } from 'redux';

// This chore binds together the three principles of Redux. It holds the current application's state object. It lets you dispatch actions. When you create it, you need to specify the reducer that tells how state is updated with actions.

//In this example, we're calling creates chore with counter as the reducer that manages the state updates. This chore has three important methods.

const store = createStore(counter);

const render = () => {
  document.body.innerText = store.getState();
}

store.subscribe(render);
render();

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });
});

// console.log(store.getState());
//
// store.dispatch({ type: 'INCREMENT'});
// console.log(store.getState());
