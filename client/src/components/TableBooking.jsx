import React, { useState } from 'react';
import { Calendar, Users, Clock, User, Phone, Mail, ShoppingCart, Trash2, Send, ChevronRight, ChevronLeft } from 'lucide-react';

export default function TableBooking({ preOrderItems, onRemovePreOrder, onClearPreOrder }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    guests: '2',
    date: '',
    time: '18:00',
    name: '',
    phone: '',
    email: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required.';
    if (!formData.time) newErrors.time = 'Time is required.';
    if (!formData.guests || Number(formData.guests) < 1) newErrors.guests = 'Valid guest count is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) return;

    // Calculate totals
    const preOrderTotal = preOrderItems.reduce((sum, item) => sum + item.price, 0);

    // Format WhatsApp message
    let message = `*Mana Katha - Table Reservation & Pre-Order*\n\n`;
    message += `*Reservation Details:*\n`;
    message += `• *Name:* ${formData.name}\n`;
    message += `• *Contact:* ${formData.phone}\n`;
    if (formData.email) message += `• *Email:* ${formData.email}\n`;
    message += `• *Date:* ${formData.date}\n`;
    message += `• *Time:* ${formData.time}\n`;
    message += `• *Guests:* ${formData.guests} Persons\n\n`;

    if (preOrderItems.length > 0) {
      message += `*Pre-ordered Items:*\n`;
      preOrderItems.forEach((item) => {
        message += `• ${item.name} - ₹${item.price}\n`;
      });
      message += `\n*Total Pre-order Value:* ₹${preOrderTotal}\n\n`;
    } else {
      message += `*Pre-ordered Items:* None (Will order at the table)\n\n`;
    }
    message += `Please confirm availability and share the quote/booking summary. Thank you!`;

    // Encode URI
    const encodedMessage = encodeURIComponent(message);
    const ownerPhoneNumber = '919876543210'; // Set default owner phone number
    const whatsappUrl = `https://wa.me/${ownerPhoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  const totalAmount = preOrderItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <section id="booking" className="relative z-20 py-24 bg-coffee-950/20 border-t border-coffee-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-gold-400 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">
            Reservation Request
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">
            Book a Table
          </h2>
          <p className="text-coffee-300 max-w-xl mx-auto text-sm">
            Reserve your scenic rooftop table or cozy indoor corner. Submit the request to complete the quote via WhatsApp.
          </p>
        </div>

        {/* Steps Tracker */}
        <div className="flex justify-between items-center mb-12 max-w-md mx-auto relative px-4">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-coffee-900 -translate-y-1/2 z-0" />
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border transition-all duration-300 ${
                step >= num
                  ? 'bg-gold-500 text-coffee-950 border-gold-400 shadow-md shadow-gold-500/10'
                  : 'bg-coffee-950 text-coffee-400 border-coffee-800'
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Booking Card */}
        <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl relative">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* STEP 1: Logistics */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-2xl font-serif text-white mb-6 border-b border-coffee-900 pb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold-400" /> 1. Select Date & Seating
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Guests */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-coffee-300 mb-2 font-medium">Guests</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/60" />
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-coffee-900/60 border border-coffee-800 rounded-xl text-white focus:outline-none focus:border-gold-500 appearance-none font-medium text-sm"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5">5 Persons</option>
                        <option value="6">6 Persons</option>
                        <option value="8">8 Persons</option>
                        <option value="10">10+ Persons (Gathering)</option>
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-coffee-300 mb-2 font-medium">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/60" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-12 pr-4 py-3.5 bg-coffee-900/60 border border-coffee-800 rounded-xl text-white focus:outline-none focus:border-gold-500 text-sm font-medium"
                      />
                    </div>
                    {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-coffee-300 mb-2 font-medium">Preferred Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/60" />
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-coffee-900/60 border border-coffee-800 rounded-xl text-white focus:outline-none focus:border-gold-500 text-sm font-medium"
                      />
                    </div>
                    {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Contact Details */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-2xl font-serif text-white mb-6 border-b border-coffee-900 pb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-gold-400" /> 2. Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-coffee-300 mb-2 font-medium">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/60" />
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-coffee-900/60 border border-coffee-800 rounded-xl text-white focus:outline-none focus:border-gold-500 text-sm"
                      />
                    </div>
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-coffee-300 mb-2 font-medium">WhatsApp Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/60" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-coffee-900/60 border border-coffee-800 rounded-xl text-white focus:outline-none focus:border-gold-500 text-sm"
                      />
                    </div>
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-coffee-300 mb-2 font-medium">Email Address (Optional)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/60" />
                      <input
                        type="email"
                        name="email"
                        placeholder="johndoe@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-coffee-900/60 border border-coffee-800 rounded-xl text-white focus:outline-none focus:border-gold-500 text-sm"
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Pre-order & Confirm */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-2xl font-serif text-white mb-6 border-b border-coffee-900 pb-3 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-gold-400" /> 3. Review Pre-order Selection
                </h3>

                {preOrderItems.length > 0 ? (
                  <div className="space-y-4">
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                      {preOrderItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-4 bg-coffee-900/40 rounded-xl border border-coffee-800 hover:border-coffee-700/80 transition-all">
                          <div>
                            <p className="font-semibold text-white text-sm">{item.name}</p>
                            <p className="text-xs text-gold-400">₹{item.price}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemovePreOrder(item.id)}
                            className="p-2 text-coffee-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Remove Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center p-4 border-t border-coffee-800 bg-coffee-900/10 mt-6">
                      <div>
                        <p className="text-xs text-coffee-400 uppercase tracking-wider">Total Pre-Order Value</p>
                        <p className="text-2xl font-bold font-serif text-gold-300">₹{totalAmount}</p>
                      </div>
                      <button
                        type="button"
                        onClick={onClearPreOrder}
                        className="text-xs text-red-400 hover:text-red-300 font-medium transition-all"
                      >
                        Clear All Items
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-coffee-900/10 rounded-2xl border border-dashed border-coffee-800">
                    <p className="text-sm text-coffee-300 mb-2">No pre-order items selected.</p>
                    <p className="text-xs text-coffee-400 mb-4">You can add items directly from the Menu section above.</p>
                    <a href="#menu" onClick={() => setStep(1)} className="text-xs text-gold-400 hover:text-gold-300 font-semibold underline">
                      Go to Menu
                    </a>
                  </div>
                )}

                {/* Final Reservation Summary Box */}
                <div className="p-5 bg-gold-950/20 border border-gold-500/10 rounded-2xl text-sm space-y-2.5">
                  <h4 className="font-semibold text-gold-300 uppercase tracking-widest text-xs mb-2">Reservation Summary</h4>
                  <p className="text-coffee-200"><span className="text-coffee-400">Date:</span> {formData.date}</p>
                  <p className="text-coffee-200"><span className="text-coffee-400">Time:</span> {formData.time}</p>
                  <p className="text-coffee-200"><span className="text-coffee-400">Guests:</span> {formData.guests} Persons</p>
                  <p className="text-coffee-200"><span className="text-coffee-400">Customer:</span> {formData.name} ({formData.phone})</p>
                </div>
              </div>
            )}

            {/* BUTTON NAVIGATION */}
            <div className="flex justify-between items-center pt-6 border-t border-coffee-900">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 rounded-full border border-coffee-800 text-coffee-300 hover:bg-coffee-900 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-full bg-coffee-900 border border-gold-500/30 text-gold-400 hover:bg-coffee-800/80 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-coffee-950 hover:from-gold-400 hover:to-gold-500 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-gold-500/10"
                >
                  <Send className="w-4 h-4" /> Submit to WhatsApp
                </button>
              )}
            </div>

          </form>

        </div>

      </div>
    </section>
  );
}
