const { useState, useEffect } = React;

const API = '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | done

  useEffect(() => { fetchTodos(); }, []);

  async function fetchTodos() {
    const res = await fetch(API);
    setTodos(await res.json());
  }

  async function addTodo() {
    const title = input.trim();
    if (!title) return;
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    setInput('');
    fetchTodos();
  }

  async function toggle(id) {
    await fetch(`${API}/${id}/toggle`, { method: 'PATCH' });
    fetchTodos();
  }

  async function remove(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchTodos();
  }

  const filtered = todos.filter(t =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done
  );
  const remaining = todos.filter(t => !t.done).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto pt-20 px-4">

        {/* Header */}
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">
          todos
        </h1>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="What needs to be done?"
            className="flex-1 border-b border-gray-300 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-500 text-sm"
          />
          <button
            onClick={addTodo}
            className="text-gray-400 hover:text-gray-700 text-sm px-2 transition-colors"
          >
            add
          </button>
        </div>

        {/* List */}
        <ul className="divide-y divide-gray-100">
          {filtered.map(todo => (
            <li key={todo.id} className="flex items-center gap-3 py-3 group">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggle(todo.id)}
                className="accent-gray-400 w-4 h-4 cursor-pointer"
              />
              <span className={`flex-1 text-sm ${todo.done ? 'line-through text-gray-300' : 'text-gray-700'}`}>
                {todo.title}
              </span>
              <button
                onClick={() => remove(todo.id)}
                className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 text-xs transition-all"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* Empty state */}
        {filtered.length === 0 && (
          <p className="text-center text-gray-300 text-sm py-8">
            {filter === 'all' ? 'No todos yet.' : `No ${filter} todos.`}
          </p>
        )}

        {/* Footer */}
        {todos.length > 0 && (
          <div className="flex items-center justify-between mt-6 text-xs text-gray-400">
            <span>{remaining} left</span>
            <div className="flex gap-3">
              {['all', 'active', 'done'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`lowercase transition-colors ${filter === f ? 'text-gray-700' : 'hover:text-gray-600'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));