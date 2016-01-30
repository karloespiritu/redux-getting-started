// Avoiding Object Mutations with Object.assign() and ...spread
const toggleTodo = (todo) => {
  // mutating version
  //   todo.completed = !todo.completed;
  //   return todo;

  // immutable version - ES6
  //   return Object.assign({}, todo, {
  //     completed: !todo.completeds
  //   });

  // immutable version - Propose in ES7, enabled in
  // Babel stage-2 preset
  return {
    ...todo,
    completed: !todo.completed
  };
};

const testToggleTodo = () => {
  const todoBefore = {
    id: 0,
    text: 'Learn Redux',
    completed: false
  };

  const todoAfter = {
    id: 0,
    text: 'Learn Redux',
    completed: true
  };

  deepFreeze(todoBefore)

  expect(
    toggleTodo(todoBefore)
  ).toEqual(todoAfter);
}

testToggleTodo(0);
console.log("All tests passed.");
