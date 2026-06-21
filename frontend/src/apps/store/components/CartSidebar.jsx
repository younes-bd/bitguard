import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingCart, ArrowRight } from 'lucide-react';
// import { storeApi } from '../../api/storeApi';

export default function CartSidebar({ isOpen, onClose }) {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Managed IT Professional (Monthly)', price: 299.00, quantity: 1, type: 'subscription' },
        { id: 2, name: 'Endpoint Protection License', price: 15.00, quantity: 5, type: 'license' }
    ]);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const applyCoupon = () => {
        // Mock apply coupon
        if (couponCode === 'WELCOME10') setDiscount(10);
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax - discount;

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
            
            <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <ShoppingCart className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Cart</h2>
                        <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs font-bold">
                            {cartItems.length}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                            <ShoppingCart className="w-16 h-16 opacity-20" />
                            <p>Your cart is empty.</p>
                            <button onClick={onClose} className="text-blue-500 hover:underline">Continue Shopping</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-4 p-4 border border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                                    <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400">
                                        <ShoppingCart className="w-6 h-6 opacity-30" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight">{item.name}</h3>
                                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">${item.price.toFixed(2)}</div>
                                        
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-1">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded text-gray-500">
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-sm font-medium w-4 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded text-gray-500">
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <button onClick={() => removeItem(item.id)} className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30 space-y-4">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Discount Code" 
                                className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <button onClick={applyCoupon} className="px-4 py-2 bg-gray-900 dark:bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-slate-600 transition-colors">
                                Apply
                            </button>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600 dark:text-slate-400">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                    <span>Discount ({couponCode})</span>
                                    <span className="font-medium">-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-600 dark:text-slate-400">
                                <span>Tax (Estimated)</span>
                                <span className="font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center text-lg">
                                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                onClose();
                                window.location.href = '/store/checkout';
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
                        >
                            Proceed to Checkout <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
