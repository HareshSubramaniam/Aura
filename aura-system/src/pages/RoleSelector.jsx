import { useState } from 'react';

const roleCards = [
  { id: 'patient', title: 'USER', icon: '👤' },
  { id: 'driver', title: 'AMBULANCE', icon: '🚑' },
  { id: 'hospital', title: 'HOSPITAL', icon: '🏥' },
];

export default function RoleSelector({ onSelectRole }) {
  const [selectedRole, setSelectedRole] = useState('patient');
  const [fullName, setFullName] = useState('Rajesh Kumar');
  const [phone, setPhone] = useState('9876543210');
  const [email, setEmail] = useState('patient@aura.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleSignIn = (event) => {
    event.preventDefault();
    onSelectRole(selectedRole, {
      fullName,
      phone,
      email,
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-aura-dark overflow-hidden">
      {/* Left Section - Brand & Info */}
      <section className="relative hidden lg:flex items-center justify-center px-8 py-12 overflow-hidden">
        {/* Gradient background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-aura-blue/20 via-transparent to-aura-green/10" />
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-aura-blue/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-aura-green/10 blur-3xl" />
        
        <div className="w-full max-w-md text-aura-text relative z-10">
          <div className="mb-8">
            <h1 className="text-7xl font-black font-display tracking-[0.05em] mb-4 bg-gradient-to-r from-aura-blue-light via-aura-green-light to-aura-blue-light bg-clip-text text-transparent">AURA</h1>
            <div className="h-1 w-20 bg-gradient-to-r from-aura-blue-light to-aura-green-light rounded-full" />
          </div>
          
          <p className="text-2xl font-semibold leading-relaxed text-aura-text-light mb-12">
            Advanced Unified Response
            <br />
            <span className="font-black text-aura-blue-light">&</span> Assistance System
          </p>

          <div className="glass rounded-2xl p-8 border border-aura-border-light/30 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-aura-blue/20 flex items-center justify-center text-2xl border border-aura-blue/40">🚑</div>
              <span className="text-base font-medium text-aura-text-light">Real-Time Ambulance Tracking</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-aura-green/20 flex items-center justify-center text-2xl border border-aura-green/40">🤖</div>
              <span className="text-base font-medium text-aura-text-light">Save More Lives</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-aura-gold/20 flex items-center justify-center text-2xl border border-aura-gold/40">📱</div>
              <span className="text-base font-medium text-aura-text-light">Instant SMS Alerts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right Section - Login/Role Selection */}
      <section className="flex items-center justify-center p-6 md:p-10 relative">
        {!showLoginForm ? (
          <div className="w-full max-w-xl">
            <div className="glass rounded-2xl p-8 md:p-12 border border-aura-border-light/30 backdrop-blur-xl">
              <h2 className="text-5xl font-black font-display text-aura-text mb-2">Welcome to AURA</h2>
              <p className="text-aura-muted mb-10 text-base">Select your role to get started</p>

              <div className="space-y-3 mb-8">
                {roleCards.map((role) => {
                  const isSelected = selectedRole === role.id;
                  const bgColor = role.id === 'patient' ? 'aura-blue' : role.id === 'driver' ? 'aura-gold' : 'aura-green';
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.id);
                        setEmail(role.id === 'driver' ? 'ambulance@aura.com' : `${role.id}@aura.com`);
                        setFullName(role.id === 'driver' ? 'Driver Team' : role.id === 'hospital' ? 'Hospital Desk' : 'Rajesh Kumar');
                        setPhone('9876543210');
                      }}
                      className={`w-full group relative overflow-hidden rounded-xl border transition-all duration-300 flex items-center justify-start px-6 py-5 ${
                        isSelected
                          ? `border-${bgColor} bg-${bgColor}/10`
                          : `border-aura-border/50 bg-aura-surface/50 hover:bg-aura-surface/80`
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
                      )}
                      <div className={`text-3xl transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>{role.icon}</div>
                      <div className="text-left ml-4 flex-1">
                        <div className={`font-bold tracking-wider ${isSelected ? `text-${bgColor}-light` : 'text-aura-text'}`}>{role.title}</div>
                        <div className="text-xs text-aura-muted-dark">Select to continue</div>
                      </div>
                      {isSelected && <div className="ml-auto text-xl opacity-75 scale-125">✓</div>}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setShowLoginForm(true)}
                className="w-full relative group rounded-xl bg-gradient-to-r from-aura-blue via-aura-blue-light to-aura-blue py-4 text-aura-darker text-lg font-black tracking-wide overflow-hidden transition-all duration-300 hover:shadow-glow-blue"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">CONTINUE</span>
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSignIn}
            className="w-full max-w-xl animate-fade-in"
          >
            <div className="glass rounded-2xl p-8 md:p-12 border border-aura-border-light/30 backdrop-blur-xl">
              <h2 className="text-5xl font-black font-display text-aura-text mb-2">Welcome Back</h2>
              
              {/* Selected Role Display */}
              <div className="bg-gradient-to-r from-aura-blue/20 to-aura-green/20 border border-aura-border-light/40 rounded-xl p-4 mb-8 backdrop-blur-sm">
                <p className="text-xs text-aura-muted uppercase mb-3 font-semibold">Signing in as:</p>
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {selectedRole === 'patient' && '👤'}
                    {selectedRole === 'driver' && '🚑'}
                    {selectedRole === 'hospital' && '🏥'}
                  </div>
                  <div>
                    <p className="font-black text-aura-blue-light text-lg">
                      {selectedRole === 'patient' && 'USER'}
                      {selectedRole === 'driver' && 'AMBULANCE'}
                      {selectedRole === 'hospital' && 'HOSPITAL'}
                    </p>
                    <p className="text-xs text-aura-muted mt-1">Tap BACK to change role</p>
                  </div>
                </div>
              </div>

              <p className="text-aura-muted text-sm mb-6 font-medium">Enter your credentials</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-aura-text-light text-xs font-semibold mb-2 uppercase tracking-wider">Full Name</label>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    type="text"
                    className="w-full rounded-lg border border-aura-border/40 bg-aura-surface/50 px-4 py-3 text-aura-text placeholder-aura-muted focus:outline-none focus:ring-2 focus:ring-aura-blue/50 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-aura-text-light text-xs font-semibold mb-2 uppercase tracking-wider">Email Address</label>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    className="w-full rounded-lg border border-aura-border/40 bg-aura-surface/50 px-4 py-3 text-aura-text placeholder-aura-muted focus:outline-none focus:ring-2 focus:ring-aura-blue/50 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-aura-text-light text-xs font-semibold mb-2 uppercase tracking-wider">Phone Number</label>
                  <div className="flex items-center rounded-lg border border-aura-border/40 bg-aura-surface/50 px-4 focus-within:ring-2 focus-within:ring-aura-blue/50">
                    <span className="text-aura-muted text-sm mr-2 font-medium">+91</span>
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
                      type="tel"
                      className="w-full bg-transparent py-3 text-aura-text placeholder-aura-muted focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-aura-text-light text-xs font-semibold mb-2 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full rounded-lg border border-aura-border/40 bg-aura-surface/50 px-4 py-3 pr-12 text-aura-text placeholder-aura-muted focus:outline-none focus:ring-2 focus:ring-aura-blue/50 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-text-light transition-colors"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-8 w-full relative group rounded-lg bg-gradient-to-r from-aura-blue via-aura-blue-light to-aura-blue py-4 text-aura-darker text-lg font-black tracking-wide overflow-hidden transition-all duration-300 hover:shadow-glow-blue"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">SIGN IN</span>
              </button>

              <button
                type="button"
                onClick={() => setShowLoginForm(false)}
                className="mt-3 w-full rounded-lg border border-aura-border/50 bg-aura-surface/30 py-3 text-aura-text-light text-sm font-semibold hover:bg-aura-surface/60 transition-colors"
              >
                BACK TO ROLE SELECTION
              </button>

              <p className="mt-8 text-center text-xs text-aura-muted-dark font-medium">
                Not nearest hospital. <span className="text-aura-gold font-bold">BEST hospital.</span> That's our edge.
              </p>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
