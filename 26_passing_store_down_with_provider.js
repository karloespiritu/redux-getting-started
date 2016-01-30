// NOTES: Passing the Store Down Implicitly via Context
// Finally, the context API is not stable in React. It has changed before, and it is likely to change again. Try your best not to rely on it too much.

const todo = (state = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
});

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibiltyFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

// same as below -- ES6 syntax
const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos,
  visibiltyFilter
});

const { Component } = React;

const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return <span>{children}</span>
  }

  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};

class FilterLink extends Component {

  // subscribe to state in store
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    //read redux store state
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();

    return (
      <Link
        active={
          props.filter ===
          state.visibiltyFilter
        }
        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
      >
        {props.children}
      </Link>
    )
  }
}
FilterLink.contextTypes = {
  store: React.PropTypes.object
};

const Footer = () => (
  <p>
    Show:
      {' '}
      <FilterLink
        filter='SHOW_ALL'
      >
        All
      </FilterLink>
      {' '}
      <FilterLink
        filter='SHOW_ACTIVE'
      >
        Active
      </FilterLink>
      {' '}
      <FilterLink
        filter='SHOW_COMPLETED'
      >
        Completed
      </FilterLink>
    </p>
);

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration:
        completed ?
          'line-through' :
          'none'
    }}>
    {text}
  </li>
);

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
);

let nextTodoId = 0;
const AddTodo = (props, { store }) => {
  let input;

  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text: input.value
        })
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
};
AddTodo.contextTypes = {
  store: React.PropTypes.object
};

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed //when false
      );
  }
}

class VisibleTodoList extends Component {

  // subscribe to state in store
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const {store} = this.context;
    const state = store.getState();

    return (
      <TodoList
        todos={
          getVisibleTodos(
            state.todos,
            state.visibiltyFilter
          )
        }
        onTodoClick={id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        }
      />
    );
  }
}
VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
};


const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

// The Provider component just renders whatever you pass to it.  In this case, it renders its children or the todo app component. However, it also provides the context to any components inside it including grandchildren.

// the child context types are essential for the context to be turned on. If you don't specify them, no child components will receive this context.

const { Provider } = ReactRedux;
// import { Provider } from 'react-redux';  //Babel
// var Provider = require('react-redux').Provider; // ES5

const { createStore } = Redux;

ReactDOM.render(
    <Provider store={createStore(todoApp)}>
      <TodoApp />
    </Provider>,
    document.getElementById('root'),
);


// store.subscribe(render);
// render();
