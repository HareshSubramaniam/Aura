import { haversine } from '../utils/scoring';

export default function DriverScreen({ emergency, patientPickedUp, onPickup, driverProfile }) {
  if (!emergency) {
    return (
      <div className="min-h-screen bg-aura-dark flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-aura-green/10 blur-3xl animate-float" />
        </div>

        <div className="relative z-10 text-center">
          <div className="text-6xl mb-6">🚑</div>
          <h2 className="text-5xl font-black font-display text-aura-text mb-4">Driver Portal</h2>
          {driverProfile && (
            <p className="text-aura-text-light text-base mb-8 font-medium">{driverProfile.fullName} • {driverProfile.email}</p>
          )}
          <div className="flex items-center justify-center gap-3 bg-aura-surface/50 glass rounded-lg px-6 py-4 w-fit mx-auto">
            <div className="w-3 h-3 rounded-full bg-aura-green animate-dot-pulse shadow-glow-green" />
            <p className="text-aura-text-light font-medium">Waiting for emergency dispatch...</p>
          </div>
        </div>
      </div>
    );
  }

  const distance = haversine(emergency.lat, emergency.lng, emergency.assignedHospital?.lat || 0, emergency.assignedHospital?.lng || 0);

  return (
    <div className="min-h-screen bg-aura-dark flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full bg-aura-blue/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-aura-gold/10 blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative z-10 space-y-6">
        {/* New Emergency Alert */}
        <style>{`
          @keyframes emergency-pulse-banner {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          .emergency-banner {
            animation: emergency-pulse-banner 1.5s ease-in-out infinite;
          }
        `}</style>
        
        <div className="emergency-banner glass border-2 border-aura-red/60 rounded-xl p-6 text-center backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-aura-red/20 via-transparent to-aura-red/20" />
          <p className="text-aura-red-light font-black text-2xl mb-2 relative">🚨 NEW EMERGENCY ALERT</p>
          <p className="text-aura-muted text-sm relative uppercase font-semibold tracking-wider">Tap button below to start navigation</p>
        </div>

        {/* Priority Navigation Card */}
        {!patientPickedUp && (
          <div className="glass rounded-xl p-8 border border-aura-border-light/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-aura-blue/20 via-transparent to-transparent" />
            <div className="relative z-10">
              <p className="text-aura-blue uppercase text-xs font-black tracking-widest mb-4">🧭 Patient Location</p>
              <p className="text-3xl font-black font-display text-aura-text mb-6">{emergency.patientName}</p>
              
              <div className="glass-light rounded-lg p-4 mb-6">
                <p className="text-aura-muted-dark text-xs uppercase font-bold mb-3 tracking-wider">GPS Coordinates</p>
                <p className="font-mono text-lg font-bold text-aura-blue-light mb-2">{emergency.lat.toFixed(4)}°N, {emergency.lng.toFixed(4)}°E</p>
                <p className="text-aura-muted text-sm">Coimbatore, India</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-aura-blue/10 border border-aura-blue/30 rounded-lg p-3">
                  <p className="text-aura-muted-dark text-xs font-bold uppercase mb-2">Distance</p>
                  <p className="text-2xl font-black font-mono text-aura-blue-light">{distance.toFixed(2)} km</p>
                </div>
                {emergency.familyPhone && (
                  <div className="bg-aura-green/10 border border-aura-green/30 rounded-lg p-3">
                    <p className="text-aura-muted-dark text-xs font-bold uppercase mb-2">Family Contact</p>
                    <p className="font-mono text-sm font-bold text-aura-green-light">{emergency.familyPhone}</p>
                  </div>
                )}
              </div>

              <a
                href={`https://maps.google.com/?q=${emergency.lat},${emergency.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full group relative rounded-lg bg-gradient-to-r from-aura-blue via-aura-blue-light to-aura-blue py-4 text-aura-darker font-black text-lg uppercase tracking-wider overflow-hidden transition-all hover:shadow-glow-blue"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">📍 Start Navigation</span>
              </a>
            </div>
          </div>
        )}

        {/* Patient Details Card */}
        <div className="glass rounded-xl p-6 border border-aura-border-light/30 backdrop-blur-xl">
          <h2 className="text-xl font-black font-display text-aura-text mb-5">Patient Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-aura-border/30">
              <span className="text-aura-muted text-sm font-medium uppercase tracking-wider">Patient Name</span>
              <span className="text-aura-text font-bold text-lg">{emergency.patientName}</span>
            </div>
            {emergency.familyPhone && (
              <div className="flex justify-between items-center pb-4 border-b border-aura-border/30">
                <span className="text-aura-muted text-sm font-medium uppercase tracking-wider">Emergency Contact</span>
                <span className="text-aura-text-light font-mono text-base">{emergency.familyPhone}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-aura-muted text-sm font-medium uppercase tracking-wider">Distance from Patient</span>
              <div className="flex items-baseline gap-1">
                <span className="text-aura-green-light font-mono font-black text-xl">{distance.toFixed(2)}</span>
                <span className="text-aura-muted text-xs">km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hospital Info Card */}
        {emergency.assignedHospital && (
          <div className="glass rounded-xl p-6 border border-aura-border-light/30 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🏥</span>
              <h3 className="text-xl font-black font-display text-aura-text">Assigned Hospital</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-aura-text font-bold text-lg mb-2">{emergency.assignedHospital.name}</p>
                <p className="text-aura-muted text-sm">Ranked hospital with best availability</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-aura-gold/10 border border-aura-gold/30 rounded-lg p-3">
                  <p className="text-xs text-aura-muted-dark font-bold uppercase mb-2">Score</p>
                  <p className="text-xl font-black font-mono text-aura-gold-light">{emergency.assignedHospital.score.toFixed(2)}</p>
                </div>
                <div className="bg-aura-green/10 border border-aura-green/30 rounded-lg p-3">
                  <p className="text-xs text-aura-muted-dark font-bold uppercase mb-2">ICU Beds</p>
                  <p className="text-xl font-black font-mono text-aura-green-light">{emergency.assignedHospital.icu}</p>
                </div>
                <div className={`rounded-lg p-3 border ${emergency.assignedHospital.has_doctor ? 'bg-aura-blue/10 border-aura-blue/30' : 'bg-aura-muted/10 border-aura-muted/30'}`}>
                  <p className="text-xs text-aura-muted-dark font-bold uppercase mb-2">Doctor</p>
                  <p className="text-lg font-black">{emergency.assignedHospital.has_doctor ? '✓' : '✗'}</p>
                </div>
                <div className={`rounded-lg p-3 border ${emergency.assignedHospital.has_oxygen ? 'bg-aura-green/10 border-aura-green/30' : 'bg-aura-muted/10 border-aura-muted/30'}`}>
                  <p className="text-xs text-aura-muted-dark font-bold uppercase mb-2">Oxygen</p>
                  <p className="text-lg font-black">{emergency.assignedHospital.has_oxygen ? '✓' : '✗'}</p>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${emergency.assignedHospital.lat},${emergency.assignedHospital.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full group relative rounded-lg bg-gradient-to-r from-aura-green via-aura-green-light to-aura-green py-3 text-aura-darker font-black uppercase tracking-wider overflow-hidden transition-all hover:shadow-glow-green"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">🏥 Navigate to Hospital</span>
              </a>
            </div>
          </div>
        )}

        {/* Pickup Confirmation Button */}
        {!patientPickedUp && (
          <button
            onClick={onPickup}
            className="w-full group relative rounded-lg bg-gradient-to-r from-aura-green via-aura-green-light to-aura-green py-5 text-aura-darker font-black text-xl uppercase tracking-wider overflow-hidden transition-all hover:shadow-glow-green"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center justify-center gap-3">✓ PATIENT PICKED UP</span>
          </button>
        )}

        {patientPickedUp && (
          <div className="glass rounded-xl p-6 border border-aura-green/50 bg-gradient-to-r from-aura-green/10 to-transparent text-center">
            <p className="text-aura-green-light font-bold text-lg">✓ Patient safely on board</p>
            <p className="text-aura-muted text-sm mt-2">Proceeding to hospital</p>
          </div>
        )}
      </div>
    </div>
  );
}
