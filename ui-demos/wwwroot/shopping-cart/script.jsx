const { useState } = React;

const PRODUCTS = [
  { id: 1, name: 'laptop',     price: 999.99, emoji: '💻', description: 'powerful computing'    },
  { id: 2, name: 'headphones', price: 199.99, emoji: '🎧', description: 'crystal clear audio'   },
  { id: 3, name: 'smartphone', price: 799.99, emoji: '📱', description: 'stay connected'         },
  { id: 4, name: 'smartwatch', price: 299.99, emoji: '⌚', description: 'track your fitness'     },
  { id: 5, name: 'camera',     price: 599.99, emoji: '📷', description: 'capture memories'       },
  { id: 6, name: 'tablet',     price: 499.99, emoji: '🖥', description: 'portable productivity'  },
];

function ShoppingApp() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      return existing
        ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  const remove = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty === 0) { remove(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto pt-20 px-4 pb-16">
        <h1 className="text-3xl font-light tracking-widest text-gray-800 mb-8 lowercase">tech store</h1>

        <div className="flex gap-10">
          <div className="flex-1">
            <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">products</h2>
            <ul className="divide-y divide-gray-100">
              {PRODUCTS.map(p => (
                <li key={p.id} className="flex items-center gap-3 py-3 group">
                  <span className="text-lg w-6 text-center">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700 lowercase">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.description}</div>
                  </div>
                  <span className="text-xs text-gray-400">${p.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(p)}
                    className="text-gray-300 hover:text-gray-700 text-xs opacity-0 group-hover:opacity-100 transition-all ml-1"
                  >
                    + add
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-40 flex-shrink-0">
            <h2 className="text-xs tracking-widest text-gray-400 uppercase mb-4">
              cart{itemCount > 0 ? ` (${itemCount})` : ''}
            </h2>
            {cart.length === 0 ? (
              <p className="text-gray-300 text-xs py-2">empty.</p>
            ) : (
              <>
                <ul className="divide-y divide-gray-100 mb-4">
                  {cart.map(item => (
                    <li key={item.id} className="py-2 group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-700 lowercase">{item.name}</span>
                        <button
                          onClick={() => remove(item.id)}
                          className="text-gray-200 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all"
                        >✕</button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} className="text-gray-300 hover:text-gray-600 text-xs w-4">−</button>
                          <span className="text-xs text-gray-400 w-4 text-center tabular-nums">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} className="text-gray-300 hover:text-gray-600 text-xs w-4">+</button>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-400">total</span>
                    <span className="text-gray-700 font-mono">${total.toFixed(2)}</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-700 text-xs transition-colors">
                    checkout →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<ShoppingApp />, document.getElementById('root'));
