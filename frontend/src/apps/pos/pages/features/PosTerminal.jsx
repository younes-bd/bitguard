import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Settings, WifiOff, Wifi, CreditCard, Banknote, ScanBarcode, DoorOpen, Calculator, Trash2, Play, Square } from 'lucide-react';
import posService, { posDb } from '../../api/posService';
import toast from 'react-hot-toast';

import RestaurantFloorPlan from './RestaurantFloorPlan';

export default function PosTerminal() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showPayment, setShowPayment] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Restaurant Mode
  const [activeTable, setActiveTable] = useState(null);
  const [config, setConfig] = useState(null);

  // Session Management
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [startCash, setStartCash] = useState(0);
  const [endCash, setEndCash] = useState(0);
  const [showCloseModal, setShowCloseModal] = useState(false);

  // Network listener
  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); posService.syncOfflineOrders(); };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); }
  }, []);

  // Fetch active session and products
  useEffect(() => {
    const initPos = async () => {
      setLoading(true);
      try {
        if (isOnline) {
          // Find an active session for this user
          const res = await posService.getSessions({ state: 'opened' });
          let currentSession = null;
          
          if (res.results && res.results.length > 0) {
            currentSession = res.results[0];
          } else {
            // Check for opening_control sessions
            const openingRes = await posService.getSessions({ state: 'opening_control' });
            if (openingRes.results && openingRes.results.length > 0) {
              currentSession = openingRes.results[0];
            } else {
               // Create new session if none exists
               const configRes = await posService.getConfigs();
               if (configRes.results && configRes.results.length > 0) {
                 currentSession = await posService.createSession({ config: configRes.results[0].id });
               }
            }
          }
          
          if (currentSession) {
            setSession(currentSession);
            // Fetch the config details to check if it's a restaurant
            try {
              const confData = await posService.getConfigs();
              const configs = Array.isArray(confData) ? confData : confData.results || [];
              const c = configs.find(c => c.id === currentSession.config);
              if (c) setConfig(c);
            } catch (e) {}
          }
          await posService.cacheProducts();
        }
      } catch (err) {
        console.error("POS Init error", err);
      }
      
      const cached = await posDb.products.toArray();
      setProducts(cached);
      setLoading(false);
    };
    initPos();
  }, [isOnline]);

  // Mock Barcode Scanner (Listens to fast keyboard input)
  useEffect(() => {
    let barcode = '';
    let timeout = null;
    const handleKeyDown = (e) => {
      // Don't intercept if typing in an input
      if (e.target.tagName === 'INPUT' || !session || session.state !== 'opened') return;

      if (e.key === 'Enter' && barcode) {
        const p = products.find(prod => prod.sku === barcode);
        if (p) addToCart(p);
        else toast.error('Product not found!');
        barcode = '';
      } else if (e.key.length === 1) {
        barcode += e.key;
        clearTimeout(timeout);
        timeout = setTimeout(() => { barcode = ''; }, 100);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products, cart, session]);

  const handleOpenSession = async () => {
    try {
      const updated = await posService.openSession(session.id, { cash_register_balance_start: parseFloat(startCash) });
      setSession({ ...session, state: updated.status });
      toast.success("Session Opened");
    } catch (e) {
      toast.error("Failed to open session");
    }
  };

  const handleCloseSession = async () => {
    try {
      const updated = await posService.closeSession(session.id, { cash_register_balance_end_real: parseFloat(endCash) });
      setSession({ ...session, state: updated.status });
      setShowCloseModal(false);
      toast.success("Session Closed");
      setTimeout(() => window.location.assign(window.location.pathname), 1000);
    } catch (e) {
      toast.error("Failed to close session");
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  
  const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0);

  const handleCheckout = async (method) => {
    if (cart.length === 0) return toast.error("Cart is empty");
    if (!session || session.state !== 'opened') return toast.error("No active session");

    if (method === 'cash') {
      setDrawerOpen(true);
      toast.success("Cash Drawer Opened", { icon: <DoorOpen className="text-emerald-500"/> });
      setTimeout(() => setDrawerOpen(false), 3000);
    }

    const payload = {
      session: session.id,
      items: cart.map(i => ({ product_id: i.id, quantity: i.qty, unit_price: i.price })),
      amount_total: total,
      state: 'paid',
      payments: [
          { amount: total, payment_method: method }
      ]
    };

    const res = await posService.createOrder(payload);
    if (res.offline) {
      toast.success("Order saved offline!");
    } else {
      toast.success("Order processed successfully!");
    }
    setCart([]);
    setShowPayment(false);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku && p.sku.includes(search)));

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-slate-950 text-emerald-500">Loading POS...</div>;
  }

  // Session Control Screen
  if (session && session.state === 'opening_control') {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md text-center animate-in fade-in zoom-in">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Open POS Session</h2>
          <p className="text-slate-400 mb-8">Enter the starting cash amount in your drawer.</p>
          
          <div className="text-left mb-6">
            <label className="block text-sm text-slate-400 mb-2">Opening Cash Balance</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input 
                type="number" 
                min="0"
                step="0.01"
                value={startCash}
                onChange={e => setStartCash(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-8 pr-4 text-white font-bold text-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
          
          <button 
            onClick={handleOpenSession}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            Open Session
          </button>
        </div>
      </div>
    );
  }

  // Restaurant Floor Plan rendering
  if (session && session.state === 'opened' && config && config.is_restaurant && !activeTable) {
    return <RestaurantFloorPlan config={config} onTableSelect={setActiveTable} onBack={() => window.location.href = '/admin/pos'} />;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Top Navbar */}
      <div className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="font-bold text-xl text-emerald-600 dark:text-emerald-400">BitGuard POS</div>
          <div className={`flex items-center px-2 py-1 rounded text-xs font-medium ${isOnline ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30'}`}>
            {isOnline ? <><Wifi className="w-4 h-4 mr-1"/> Online</> : <><WifiOff className="w-4 h-4 mr-1"/> Offline Mode</>}
          </div>
          {session && (
            <div className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
              Session #{session.id}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3 text-slate-500">
          <button onClick={() => toast.success("Mock Scan activated! Type fast to simulate scanner.", { icon: <ScanBarcode />})} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full" title="Barcode Scanner Setup"><ScanBarcode className="w-5 h-5"/></button>
          <button onClick={() => setShowCloseModal(true)} className="flex items-center px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-lg transition-colors">
            <Square className="w-4 h-4 mr-2" fill="currentColor"/> Close Session
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left pane: Products Grid */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products or scan barcode..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 dark:text-white text-lg shadow-sm"
            />
          </div>
          <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map(p => (
              <div 
                key={p.id} 
                onClick={() => addToCart(p)}
                className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all select-none flex flex-col justify-between h-36"
              >
                <div className="text-slate-800 dark:text-slate-200 font-medium leading-tight">{p.name}</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">${parseFloat(p.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right pane: Cart & Checkout */}
        <div className="w-96 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col shadow-xl z-10">
          {/* Customer / Table Selection */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50">
            {activeTable ? (
              <div className="flex flex-col">
                <div className="flex items-center text-slate-800 dark:text-white font-bold">
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-sm mr-2">{activeTable.name}</span>
                  Table Guest
                </div>
                <button onClick={() => setActiveTable(null)} className="text-xs text-slate-500 hover:text-emerald-600 mt-1 text-left">
                  ← Back to Floor Plan
                </button>
              </div>
            ) : (
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                <User className="w-5 h-5 mr-2" />
                <span className="font-medium">Walk-in Customer</span>
              </div>
            )}
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <ShoppingCart className="w-12 h-12 opacity-20" />
                <p>Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700/50">
                    <div className="flex-1">
                      <div className="font-medium text-slate-800 dark:text-white truncate pr-2">{item.name}</div>
                      <div className="text-emerald-600 dark:text-emerald-400 text-sm">${parseFloat(item.price).toFixed(2)} x {item.qty}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="font-bold text-slate-800 dark:text-white">${(item.price * item.qty).toFixed(2)}</div>
                      <button onClick={() => removeFromCart(item.id)} className="text-rose-400 hover:text-rose-600 p-1"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Area */}
          <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 space-y-4">
            <div className="flex justify-between text-xl font-bold text-slate-800 dark:text-white">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            {!showPayment ? (
              <button 
                onClick={() => setShowPayment(true)}
                disabled={cart.length === 0}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl text-lg font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center"
              >
                Payment <ShoppingCart className="ml-2 w-5 h-5"/>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleCheckout('cash')} className="py-4 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold flex flex-col items-center justify-center">
                    <Banknote className="w-6 h-6 mb-1"/> Cash
                  </button>
                  <button onClick={() => handleCheckout('card')} className="py-4 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 text-blue-700 dark:text-blue-400 rounded-xl font-bold flex flex-col items-center justify-center">
                    <CreditCard className="w-6 h-6 mb-1"/> Card
                  </button>
                </div>
                <button onClick={() => setShowPayment(false)} className="w-full py-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mock Cash Drawer Animation */}
      {drawerOpen && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-8 py-4 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-20 z-50 flex items-center">
          <DoorOpen className="w-6 h-6 text-emerald-400 mr-3" />
          <span className="font-bold text-lg">Cash Drawer Open</span>
        </div>
      )}

      {/* Close Session Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md animate-in zoom-in-95">
            <h2 className="text-2xl font-bold text-white mb-2">Close POS Session</h2>
            <p className="text-slate-400 mb-6">Enter the closing cash amount in your drawer to reconcile.</p>
            
            <div className="text-left mb-6">
              <label className="block text-sm text-slate-400 mb-2">Closing Cash Balance</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  value={endCash}
                  onChange={e => setEndCash(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-8 pr-4 text-white font-bold text-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowCloseModal(false)}
                className="flex-1 py-3 text-white font-bold rounded-xl border border-slate-600 hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleCloseSession}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-500/20"
              >
                Close Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
