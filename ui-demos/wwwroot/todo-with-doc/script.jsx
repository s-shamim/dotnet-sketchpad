// ============================================
// STEP 1: CREATE THE MAIN COMPONENT
// ============================================
// This is a function that returns HTML-like code (JSX)
// React will call this function to build the UI

function TodoApp() {

  // ============================================
  // STEP 2: DEFINE STATE (DATA STORAGE)
  // ============================================
  // useState is a "hook" that lets us store data
  // When this data changes, React automatically updates the UI

  // todos: the current list of todos
  // setTodos: a function to update the todos
  // useState([...]): initial value is an array with 2 todos
  const [todos, setTodos] = React.useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a project', completed: false }
  ]);

  // inputText: stores what user types in the input box
  // setInputText: function to update inputText
  // useState(''): initial value is empty string
  const [inputText, setInputText] = React.useState('');

  // filter: stores which filter is active ('all', 'active', or 'completed')
  const [filter, setFilter] = React.useState('all');

  // ============================================
  // STEP 3: CREATE FUNCTIONS TO HANDLE ACTIONS
  // ============================================

  // Function to add a new todo
  const addTodo = () => {
    // Check if input is not empty
    if (inputText.trim()) {
      // Create a new todo object
      const newTodo = {
        id: Date.now(), // unique ID using timestamp
        text: inputText,
        completed: false
      };

      // Update the todos array
      // [...todos, newTodo] creates a new array with old todos + new todo
      setTodos([...todos, newTodo]);

      // Clear the input box
      setInputText('');
    }
  };

  // Function to toggle a todo between completed/not completed
  const toggleTodo = (id) => {
    // map() goes through each todo
    // If the todo's id matches, flip its completed status
    // Otherwise, keep it the same
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed } // flip completed
        : todo // keep unchanged
    ));
  };

  // Function to delete a todo
  const deleteTodo = (id) => {
    // filter() keeps only todos that DON'T match the id
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // ============================================
  // STEP 4: FILTER TODOS BASED ON SELECTED FILTER
  // ============================================

  const getFilteredTodos = () => {
    if (filter === 'active') {
      return todos.filter(todo => !todo.completed); // only non-completed
    }
    if (filter === 'completed') {
      return todos.filter(todo => todo.completed); // only completed
    }
    return todos; // 'all' - return everything
  };

  const filteredTodos = getFilteredTodos();

  // ============================================
  // STEP 5: CALCULATE STATISTICS
  // ============================================

  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  // ============================================
  // STEP 6: RETURN JSX (THE UI)
  // ============================================
  // This looks like HTML but it's JSX
  // React converts this to actual HTML elements

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto pt-20 px-4">

        {/* HEADER */}
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">
          todo with doc
        </h1>

        {/* INPUT SECTION */}
        <div className="flex items-center border-b border-gray-300 mb-8">
          {/*
            INPUT BOX
            - value={inputText}: the input shows whatever is in inputText state
            - onChange: when user types, update inputText state
            - onKeyPress: if user presses Enter, add the todo
          */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="what needs to be done?"
            className="flex-1 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none"
          />
          {/*
            ADD BUTTON
            - onClick: when clicked, call addTodo function
          */}
          <button
            onClick={addTodo}
            className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors"
          >
            add
          </button>
        </div>

        {/* TODO LIST */}
        {/*
          CONDITIONAL RENDERING
          If no todos, show message
          Otherwise, show the list
        */}
        {filteredTodos.length === 0 ? (
          <p className="text-center text-gray-300 text-sm py-8">
            nothing here yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {/*
              MAP THROUGH TODOS
              For each todo, create a list item
              map() is like a loop that creates UI for each item
            */}
            {filteredTodos.map(todo => (
              <li
                key={todo.id}
                className="flex items-center gap-3 py-3 group"
              >
                {/*
                  CHECKBOX
                  - checked: shows checked if todo.completed is true
                  - onChange: when clicked, toggle the todo
                */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="accent-gray-400 w-4 h-4 cursor-pointer"
                />

                {/*
                  TODO TEXT
                  If completed, show with line-through
                */}
                <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-300' : 'text-gray-700'}`}>
                  {todo.text}
                </span>

                {/*
                  DELETE BUTTON
                  When clicked, delete this todo
                */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 text-xs transition-all"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* FOOTER / FILTER BUTTONS */}
        {/*
          Each button sets the filter state
          The active button gets different styling
        */}
        <div className="flex items-center justify-between mt-6 text-xs text-gray-400">
          <span>{activeTodos} left</span>
          <div className="flex gap-3">
            {['all', 'active', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`lowercase transition-colors ${filter === f ? 'text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STEP 7: RENDER THE APP
// ============================================
// This tells React to render our TodoApp component
// inside the <div id="root"> element
ReactDOM.render(<TodoApp />, document.getElementById('root'));
