import { useState, useEffect, useRef } from 'react';
import { HOSPITALS, PATIENT_LAT, PATIENT_LNG } from '../data/mockData';
import { scoreHospital, haversine } from '../utils/scoring';

export default function SOSScreen({ emergency, onSOSPress, hospitalConfirmed, patientProfile }) {
  const [eta, setEta] = useState(480);
  const [assignedHospital, setAssignedHospital] = useState(null);
  const [trackerPos, setTrackerPos] = useState({ x: 4, y: 4 });
  const [statusSteps, setStatusSteps] = useState({
    sos: true,
    dispatched: false,
    en_route: false,
    confirmed: false
  });
  const sosPressed = useRef(false);
  const etaInterval = useRef(null);
  const trackerInterval = useRef(null);

  useEffect(() => {
    if (emergency?.assignedHospital) {
      setAssignedHospital(emergency.assignedHospital);
    }
  }, [emergency]);

  useEffect(() => {
    if (hospitalConfirmed) {
      setStatusSteps(prev => ({ ...prev, confirmed: true }));
    }
  }, [hospitalConfirmed]);

  useEffect(() => {
    // Tracker animation
    if (emergency && !hospitalConfirmed) {
      let step = 0;
      const gridSize = 5;
      trackerInterval.current = setInterval(() => {
        step++;
        const angle = Math.atan2(2 - 4, 2 - 4);
        const newX = Math.max(2, 4 - step * 0.3);
        const newY = Math.max(2, 4 - step * 0.3);
        if (newX > 2 || newY > 2) {
          setTrackerPos({ x: newX, y: newY });
        } else {
          clearInterval(trackerInterval.current);
        }
      }, 1500);
    }
    return () => {
      if (trackerInterval.current) clearInterval(trackerInterval.current);
    };
  }, [emergency, hospitalConfirmed]);

  const handleSOSPress = () => {
    if (sosPressed.current) return;
    sosPressed.current = true;

    const rankedHospitals = HOSPITALS.map((hospital) => {
      const distance = haversine(PATIENT_LAT, PATIENT_LNG, hospital.lat, hospital.lng);
      const score = scoreHospital(hospital);
      return { ...hospital, distance, score };
    }).sort((a, b) => b.score - a.score);

    const best = rankedHospitals.find((hospital) => hospital.icu > 0) || rankedHospitals[0];
    
    if (best) {
      setAssignedHospital(best);
    }

    const emergencyData = {
      id: `emerg-${Date.now()}`,
      patientName: patientProfile?.fullName || 'Rajesh Kumar',
      familyPhone: patientProfile?.phone ? `+91${patientProfile.phone}` : '+919876543210',
      lat: PATIENT_LAT,
      lng: PATIENT_LNG,
      eta: 480,
      vitals: null,
      assignedHospital: best,
      status: 'SOS'
    };

    onSOSPress(emergencyData);

    // ETA countdown
    let remaining = 480;
    setStatusSteps(prev => ({ ...prev, dispatched: true }));
    setTimeout(() => setStatusSteps(prev => ({ ...prev, en_route: true })), 1000);

    etaInterval.current = setInterval(() => {
      remaining -= 1;
      setEta(remaining);
      if (remaining <= 0) {
        clearInterval(etaInterval.current);
      }
    }, 1000);
  };

  if (!emergency) {
    return (
      <div className="min-h-screen bg-aura-dark flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-aura-red/20 blur-3xl animate-glow-pulse" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-aura-red/10 blur-3xl" />
        </div>

        <style>{`
          .sos-button {
            animation: sos-pulse 1.5s infinite;
          }
        `}</style>

        <div className="relative z-10 text-center">
          {/* SOS Button */}
          <div className="mb-12">
            <button
              onClick={handleSOSPress}
              className="sos-button w-64 h-64 rounded-full bg-gradient-to-br from-aura-red via-aura-red-light to-aura-red text-white font-black text-7xl hover:from-aura-red-light hover:via-aura-red hover:to-aura-red-light transition-all duration-300 shadow-2xl hover:shadow-glow-red relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full group-hover:from-white/40 transition-all" />
              <span className="relative">SOS</span>
            </button>
          </div>

          <h2 className="text-5xl font-black font-display text-aura-text mb-2 drop-shadow-lg">EMERGENCY ASSISTANCE</h2>
          <p className="text-xl text-aura-text-light mb-4 font-medium">Tap the SOS button to alert emergency services</p>
          <p className="text-aura-muted text-base">Your location and profile details will be transmitted instantly</p>
        </div>
      </div>
    );
  }

  // State B: After SOS Pressed
  if (emergency && !hospitalConfirmed) {
    const minutes = Math.floor(eta / 60);
    const seconds = eta % 60;
    const secStr = seconds.toString().padStart(2, '0');

    return (
      <div className="min-h-screen bg-aura-dark flex flex-col relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-aura-blue/10 blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-aura-green/10 blur-3xl" />
        </div>

        {/* Header */}
        <div className="glass border-b border-aura-border-light/30 px-6 py-6 relative z-10">
          <h1 className="text-4xl font-black font-display text-aura-text text-center">🚨 HELP IS ON THE WAY</h1>
          <p className="text-aura-muted text-center text-sm mt-2 uppercase font-semibold tracking-wider">Emergency services dispatched</p>
        </div>

        <div className="flex-1 overflow-auto p-6 relative z-10">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* ETA Countdown - Priority */}
            <div className="glass rounded-xl p-8 border border-aura-border-light/30 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-aura-red/0 via-aura-red/5 to-aura-red/0 pointer-events-none" />
              <p className="text-aura-muted uppercase text-xs font-bold tracking-wider mb-4">Estimated Arrival</p>
              <p className="text-7xl font-black font-mono text-aura-red animate-glow-pulse drop-shadow-lg">
                {minutes}:{secStr}
              </p>
            </div>

            {/* Hospital Assignment Card */}
            {assignedHospital && (
              <div className="glass rounded-xl p-6 border border-aura-border-light/30">
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-4xl">🏥</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black font-display text-aura-text mb-1">{assignedHospital.name}</h2>
                    <p className="text-aura-muted text-sm">Selected based on availability & proximity</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-aura-blue/10 rounded-lg p-4 border border-aura-blue/30">
                    <p className="text-aura-muted-dark text-xs font-semibold uppercase mb-2">Score</p>
                    <p className="text-2xl font-black font-mono text-aura-blue-light">{assignedHospital.score.toFixed(4)}</p>
                  </div>
                  <div className="bg-aura-green/10 rounded-lg p-4 border border-aura-green/30">
                    <p className="text-aura-muted-dark text-xs font-semibold uppercase mb-2">Distance</p>
                    <p className="text-2xl font-black font-mono text-aura-green-light">{(assignedHospital.distance || 0).toFixed(2)} km</p>
                  </div>
                  <div className="bg-aura-gold/10 rounded-lg p-4 border border-aura-gold/30">
                    <p className="text-aura-muted-dark text-xs font-semibold uppercase mb-2">ICU Beds</p>
                    <p className="text-2xl font-black font-mono text-aura-gold-light">{assignedHospital.icu}</p>
                  </div>
                  <div className="bg-aura-red/10 rounded-lg p-4 border border-aura-red/30">
                    <p className="text-aura-muted-dark text-xs font-semibold uppercase mb-2">Status</p>
                    <p className="text-sm font-bold text-aura-red-light">
                      {assignedHospital.icu > 0 ? '✓ Ready' : '⚠ Recovering'}
                    </p>
                  </div>
                </div>

                {/* Readiness Indicators */}
                <div className="mt-4 flex gap-3">
                  {assignedHospital.has_doctor && (
                    <div className="flex items-center gap-2 bg-aura-green/10 border border-aura-green/30 rounded-lg px-3 py-2">
                      <span className="text-lg">👨‍⚕️</span>
                      <span className="text-sm font-semibold text-aura-green-light">Doctor Available</span>
                    </div>
                  )}
                  {assignedHospital.has_oxygen && (
                    <div className="flex items-center gap-2 bg-aura-blue/10 border border-aura-blue/30 rounded-lg px-3 py-2">
                      <span className="text-lg">💨</span>
                      <span className="text-sm font-semibold text-aura-blue-light">O₂ Ready</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Tracker */}
            <div className="glass rounded-xl p-6 border border-aura-border-light/30">
              <p className="text-aura-muted uppercase text-xs font-bold tracking-wider mb-6">Journey Progress</p>
              <div className="flex items-center justify-between mb-6">
                {[
                  { key: 'sos', label: 'SOS Alert', icon: '🚨' },
                  { key: 'dispatched', label: 'Dispatched', icon: '📡' },
                  { key: 'en_route', label: 'En Route', icon: '🚑' },
                  { key: 'confirmed', label: 'Confirmed', icon: '✓' }
                ].map((step, idx) => {
                  const isActive = statusSteps[step.key];
                  const colors = {
                    sos: 'aura-red',
                    dispatched: 'aura-blue',
                    en_route: 'aura-gold',
                    confirmed: 'aura-green'
                  };
                  const color = colors[step.key];
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1">
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold mb-3 transition-all
                        ${isActive ? `border-${color} bg-${color}/20` : 'border-aura-border bg-transparent'}`}
                        style={{
                          borderColor: isActive ? (color === 'aura-red' ? '#DC2626' : color === 'aura-blue' ? '#2563EB' : color === 'aura-gold' ? '#F59E0B' : '#16A34A') : '#334155',
                          backgroundColor: isActive ? (color === 'aura-red' ? 'rgba(220,38,38,0.1)' : color === 'aura-blue' ? 'rgba(37,99,235,0.1)' : color === 'aura-gold' ? 'rgba(245,158,11,0.1)' : 'rgba(22,163,74,0.1)') : 'transparent'
                        }}>
                        <span className="text-lg">{step.icon}</span>
                      </div>
                      <span className={`text-xs font-semibold text-center ${isActive ? 'text-aura-text' : 'text-aura-muted'}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Connection status */}
              <div className="flex items-center gap-2 text-sm text-aura-green-light font-medium">
                <div className="w-2 h-2 rounded-full bg-aura-green-light animate-pulse" />
                Connected to dispatch center
              </div>
            </div>

            {/* SMS Notification */}
            <div className="glass rounded-xl p-4 border border-aura-green/50 bg-gradient-to-r from-aura-green/10 to-transparent">
              <p className="text-aura-green-light font-semibold flex items-center gap-2">
                <span className="text-xl">✓</span>
                SMS with live tracker sent to family
              </p>
            </div>

            {/* Ambulance Tracker Grid */}
            <div className="glass rounded-xl p-6 border border-aura-border-light/30">
              <p className="text-aura-muted uppercase text-xs font-bold tracking-wider mb-4">Live Position Tracking</p>
              <div className="grid grid-cols-5 gap-1 bg-aura-darker/50 p-4 rounded-lg">
                {Array.from({ length: 25 }).map((_, i) => {
                  const row = Math.floor(i / 5);
                  const col = i % 5;
                  const isPatient = row === 2 && col === 2;
                  const isAmbulance = Math.abs(trackerPos.x - col) < 0.5 && Math.abs(trackerPos.y - row) < 0.5;

                  return (
                    <div
                      key={i}
                      className="aspect-square rounded border border-aura-border/30 flex items-center justify-center transition-all hover:border-aura-border/60"
                      style={{
                        background: isPatient ? 'rgba(220, 38, 38, 0.2)' : isAmbulance ? 'rgba(37, 99, 235, 0.2)' : 'transparent'
                      }}
                    >
                      {isPatient && <div className="w-3 h-3 rounded-full bg-aura-red shadow-glow-red" />}
                      {isAmbulance && <div className="w-3 h-3 rounded-full bg-aura-blue animate-pulse shadow-glow-blue" />}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex gap-6 text-xs text-aura-muted">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-aura-red" />You (patient)</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-aura-blue" />Ambulance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State C: Hospital Confirmed
  if (hospitalConfirmed && assignedHospital) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-aura-dark"
        style={{
          animation: 'confirm-flash 0.8s ease-out'
        }}
      >
        <div className="text-center">
          <h1 className="text-6xl font-black text-aura-green mb-4">BED CONFIRMED</h1>
          <p className="text-3xl text-aura-text mb-2">{assignedHospital.name}</p>
          <p className="text-lg text-aura-muted">Team is Ready. Help is on the way.</p>
        </div>
      </div>
    );
  }

  return null;
}
