import { useState } from 'react';
import { HOSPITALS, PATIENT_LAT, PATIENT_LNG } from '../data/mockData';
import { scoreHospital, haversine } from '../utils/scoring';

export default function HospitalDashboard({ emergency, onAccept, hospitalProfile }) {
  const [selectedHospitalId, setSelectedHospitalId] = useState(1);
  const [acceptedPatient, setAcceptedPatient] = useState(false);

  const rankedHospitals = HOSPITALS.map((hospital) => {
    const distance = haversine(PATIENT_LAT, PATIENT_LNG, hospital.lat, hospital.lng);
    const score = scoreHospital(hospital);
    return { ...hospital, distance, score };
  }).sort((a, b) => b.score - a.score);

  const selectedHospital = rankedHospitals.find((hospital) => hospital.id === selectedHospitalId);

  const currentScore = selectedHospital?.score ?? 0;
  const currentRank = rankedHospitals.findIndex((hospital) => hospital.id === selectedHospitalId) + 1;

  const handleAccept = () => {
    setAcceptedPatient(true);
    onAccept();

    const confettiPieces = 50;
    for (let idx = 0; idx < confettiPieces; idx += 1) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-10px';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = ['#DC2626', '#16A34A', '#F59E0B', '#2563EB'][Math.floor(Math.random() * 4)];
      confetti.style.borderRadius = '50%';
      confetti.style.animation = 'confetti-fall 0.8s ease-out forwards';
      confetti.style.pointerEvents = 'none';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 800);
    }
  };

  return (
    <div className="min-h-screen bg-aura-dark p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-aura-green/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-aura-blue/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Profile Header */}
        {hospitalProfile && (
          <div className="max-w-7xl mx-auto mb-8">
            <div className="glass border border-aura-border-light/30 rounded-xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🏥</div>
                  <div>
                    <p className="text-aura-muted-dark uppercase text-xs font-bold tracking-wider">Hospital Administrator</p>
                    <p className="text-aura-text font-black text-2xl font-display">{hospitalProfile.fullName}</p>
                    <p className="text-aura-muted text-sm">{hospitalProfile.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-aura-muted-dark uppercase text-xs font-bold mb-2">System Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-aura-green animate-pulse shadow-glow-green" />
                    <span className="text-aura-green-light font-semibold">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Left Sidebar - Hospital Selector */}
          <div className="col-span-3 space-y-6">
            {/* Hospital Selection Card */}
            <div className="glass border border-aura-border-light/30 rounded-xl p-6 backdrop-blur-xl">
              <h3 className="text-sm font-black text-aura-text mb-4 uppercase tracking-wider">Select Hospital</h3>

              <select
                value={selectedHospitalId || ''}
                onChange={(event) => setSelectedHospitalId(Number(event.target.value))}
                className="w-full bg-aura-surface/50 border border-aura-border/40 rounded-lg px-4 py-3 text-aura-text font-medium focus:outline-none focus:ring-2 focus:ring-aura-blue/50 focus:border-transparent transition-all mb-6 cursor-pointer"
              >
                {rankedHospitals.map((hospital) => (
                  <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
                ))}
              </select>

              {/* Score Display */}
              <div className="bg-gradient-to-br from-aura-gold/20 to-transparent rounded-lg p-5 mb-6 border border-aura-gold/30">
                <p className="text-aura-muted-dark uppercase text-xs font-bold mb-3 tracking-wider">Your Score</p>
                <p className="text-4xl font-mono font-black text-aura-gold-light">{currentScore.toFixed(4)}</p>
              </div>

              {/* Availability Status */}
              <div className={`p-4 rounded-lg text-center font-bold text-sm mb-6 border transition-all ${
                (selectedHospital?.icu || 0) > 0
                  ? 'bg-aura-green/20 text-aura-green-light border-aura-green/40'
                  : 'bg-aura-red/20 text-aura-red-light border-aura-red/40'
              }`}>
                <span className="text-2xl">{(selectedHospital?.icu || 0) > 0 ? '🟢' : '🔴'}</span>
                <p className="mt-2 font-black">{(selectedHospital?.icu || 0) > 0 ? 'ICU AVAILABLE' : 'ICU FULL'}</p>
              </div>

              {/* Rankings */}
              <div className="border-t border-aura-border/30 pt-4">
                <p className="text-aura-muted-dark uppercase text-xs font-bold mb-3 text-center tracking-wider">Hospital Rank</p>
                <div className="text-center">
                  <p className="text-3xl font-black text-aura-blue-light font-mono">#{Math.max(currentRank, 0)}</p>
                  <p className="text-aura-muted text-xs mt-2">of {rankedHospitals.length || 0} hospitals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Emergency Details */}
          <div className="col-span-5">
            {!emergency ? (
              <div className="glass border border-aura-border-light/30 rounded-xl p-12 h-full flex flex-col items-center justify-center backdrop-blur-xl">
                <div className="w-5 h-5 rounded-full bg-aura-green mb-6 animate-dot-pulse shadow-glow-green" />
                <p className="text-aura-text-light font-medium text-center text-lg">Monitoring for incoming emergencies...</p>
                <p className="text-aura-muted text-sm mt-2">You will be notified when a patient needs a bed</p>
              </div>
            ) : (
              <div className="glass border border-aura-border-light/30 rounded-xl p-8 backdrop-blur-xl animate-slide-in">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl">👤</div>
                  <div>
                    <p className="text-aura-muted-dark uppercase text-xs font-bold tracking-wider">Incoming Patient</p>
                    <h3 className="text-3xl font-black font-display text-aura-text">{emergency.patientName}</h3>
                  </div>
                </div>

                {/* ETA */}
                <div className="bg-gradient-to-br from-aura-red/20 to-transparent rounded-lg p-6 mb-6 border border-aura-red/30">
                  <p className="text-aura-muted-dark uppercase text-xs font-bold mb-2 tracking-wider">Estimated Arrival</p>
                  <p className="text-5xl font-mono font-black text-aura-red-light animate-glow-pulse">08:00</p>
                </div>

                {/* Vitals Display */}
                {emergency.vitals ? (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-aura-surface/50 rounded-lg p-4 border border-aura-border/30">
                      <p className="text-aura-muted-dark text-xs font-bold uppercase mb-3 tracking-wider">Heart Rate</p>
                      <p className={`text-3xl font-mono font-black ${
                        emergency.vitals.hr > 100 ? 'text-aura-red-light' : 'text-aura-green-light'
                      }`}>
                        {emergency.vitals.hr}
                      </p>
                      <p className="text-aura-muted text-xs mt-1">bpm</p>
                    </div>
                    <div className="bg-aura-surface/50 rounded-lg p-4 border border-aura-border/30">
                      <p className="text-aura-muted-dark text-xs font-bold uppercase mb-3 tracking-wider">Blood Pressure</p>
                      <p className={`text-2xl font-mono font-black ${
                        emergency.vitals.bp_sys > 140 ? 'text-aura-red-light' : 'text-aura-green-light'
                      }`}>
                        {emergency.vitals.bp_sys}/{emergency.vitals.bp_dia}
                      </p>
                      <p className="text-aura-muted text-xs mt-1">mmHg</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-aura-surface/50 rounded-lg p-6 mb-6 text-center border border-aura-border/30">
                    <p className="text-aura-muted-dark animate-pulse font-medium">Awaiting vital signs...</p>
                  </div>
                )}

                {/* Accept Patient Button */}
                {!acceptedPatient && (
                  <button
                    onClick={handleAccept}
                    className="w-full group relative rounded-lg bg-gradient-to-r from-aura-green via-aura-green-light to-aura-green py-5 text-aura-darker font-black text-lg uppercase tracking-wider overflow-hidden transition-all hover:shadow-glow-green"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-2">✓ ACCEPT & PREPARE BED</span>
                  </button>
                )}

                {acceptedPatient && (
                  <div className="w-full glass bg-gradient-to-r from-aura-green/20 to-transparent text-aura-green-light font-black py-5 rounded-lg text-center border border-aura-green/50 flex items-center justify-center gap-2">
                    <span className="text-2xl">✓</span>
                    <span>BED CONFIRMED — TEAM NOTIFIED</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar - Hospital Rankings Table */}
          <div className="col-span-4">
            <div className="glass border border-aura-border-light/30 rounded-xl p-6 backdrop-blur-xl h-full">
              <h3 className="text-sm font-black text-aura-text mb-6 uppercase tracking-wider flex items-center gap-2">
                <span>📊</span> Hospital Rankings
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rankedHospitals.map((hospital, idx) => (
                  <div
                    key={hospital.id}
                    className={`rounded-lg p-4 border transition-all ${
                      selectedHospitalId === hospital.id
                        ? 'bg-aura-blue/20 border-aura-blue/40'
                        : 'bg-aura-surface/50 border-aura-border/30 hover:bg-aura-surface/70'
                    } cursor-pointer`}
                    onClick={() => setSelectedHospitalId(hospital.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aura-gold/40 to-aura-gold/20 flex items-center justify-center font-black text-aura-gold-light text-sm">
                          #{idx + 1}
                        </div>
                        <div>
                          <p className="text-aura-text font-bold text-sm">{hospital.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-aura-gold-light font-mono font-black text-sm">{hospital.score.toFixed(2)}</p>
                        <p className="text-aura-muted text-xs">score</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-aura-muted">
                      <span>ICU: {hospital.icu}</span>
                      <span>{hospital.has_doctor ? '👨‍⚕️' : '✗'} {hospital.has_oxygen ? '💨' : '✗'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
