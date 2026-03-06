import { useState, useEffect } from 'react';
import { HOSPITALS, PATIENT_LAT, PATIENT_LNG } from '../data/mockData';
import { scoreHospital, haversine } from '../utils/scoring';

export default function OverviewScreen({ onRunDemo, emergency, demoRunning }) {
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoComplete, setDemoComplete] = useState(false);
  const [eventLog, setEventLog] = useState([]);

  const rankedHospitals = HOSPITALS.map((hospital) => {
    const distance = haversine(PATIENT_LAT, PATIENT_LNG, hospital.lat, hospital.lng);
    const score = scoreHospital(hospital);
    return { ...hospital, distance, score };
  }).sort((a, b) => b.score - a.score);

  useEffect(() => {
    if (demoRunning) {
      setDemoProgress(0);
      setDemoComplete(false);
      setEventLog([]);

      const demoTimeline = [
        { time: 0, label: '👤 Patient Role Selected' },
        { time: 4000, label: '🚨 SOS Pressed - Hospitals Ranked' },
        { time: 6000, label: '🧑‍🚗 Driver Role - Emergency Received' },
        { time: 10000, label: '⬆️ Patient Picked Up' },
        { time: 13000, label: '📤 Vitals Submitted' },
        { time: 13500, label: '🏥 Hospital Role - Patient Card Arrived' },
        { time: 16000, label: '✓ Hospital Accepted - Confetti! 🎉' },
        { time: 18000, label: '👤 Patient Role - Bed Confirmed' },
        { time: 21000, label: '✅ Demo Complete - 21 Seconds!' },
      ];

      const progressInterval = setInterval(() => {
        setDemoProgress(prev => Math.min(100, prev + (100 / 21000) * 100));
      }, 100);

      demoTimeline.forEach(({ time, label }) => {
        setTimeout(() => {
          setEventLog(prev => [...prev, { label, time }]);
        }, time);
      });

      setTimeout(() => {
        clearInterval(progressInterval);
        setDemoProgress(100);
        setDemoComplete(true);
      }, 21000);
    }
  }, [demoRunning]);

  return (
    <div className="min-h-screen bg-aura-dark p-8 overflow-auto relative">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-aura-red/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-aura-blue/10 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-8xl font-black font-display text-transparent bg-gradient-to-r from-aura-red via-aura-gold to-aura-red bg-clip-text mb-6 tracking-tight">AURA</h1>
          <p className="text-2xl text-aura-text-light font-medium mb-8">Advanced Unified Response & Assistance System</p>

          {/* Time Comparison Badge */}
          <div className="inline-flex items-center gap-6 glass rounded-xl px-8 py-5 border border-aura-border-light/30 backdrop-blur-xl">
            <div>
              <p className="text-aura-muted text-sm uppercase font-bold tracking-wider">Legacy System</p>
              <p className="text-xl font-mono line-through text-aura-muted-dark">18–30 min</p>
            </div>
            <div className="w-1 h-12 bg-gradient-to-b from-aura-gold/0 via-aura-gold to-aura-gold/0" />
            <div>
              <p className="text-aura-green-light text-sm uppercase font-bold tracking-wider">AURA System</p>
              <p className="text-4xl font-black font-mono text-aura-green-light animate-glow-pulse">47s</p>
            </div>
          </div>
        </div>

        {/* Problem vs Solution Section */}
        <div className="glass rounded-xl p-10 border border-aura-border-light/30 backdrop-blur-xl mb-12">
          <h2 className="text-3xl font-black font-display text-aura-text mb-8">The Challenge → Our Solution</h2>
          <div className="space-y-4">
            {[
              { problem: '🔴 Manual hospital calls', solution: '⚡ Instant algorithmic routing' },
              { problem: '🔴 Nearest ≠ best care', solution: '✓ Best hospital by smart scoring' },
              { problem: '🔴 No vitals before arrival', solution: '✓ En-route vital submission' },
              { problem: '🔴 Family in the dark', solution: '✓ Real-time SMS tracker' },
              { problem: '🔴 Fragmented systems', solution: '✓ One unified platform' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 p-4 bg-aura-surface/50 rounded-lg border border-aura-border/30 hover:border-aura-border/60 transition-all">
                <div className="text-3xl flex-shrink-0">{item.problem.split(' ')[0]}</div>
                <div className="flex-1">
                  <p className="text-aura-muted text-sm font-medium">{item.problem.slice(2)}</p>
                </div>
                <div className="text-aura-gold font-black text-lg">→</div>
                <div className="flex-1">
                  <p className="text-aura-green-light text-sm font-medium">{item.solution.slice(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Routing Formula Card */}
        <div className="glass rounded-xl p-10 border border-aura-gold/40 bg-gradient-to-br from-aura-gold/10 via-transparent to-transparent backdrop-blur-xl mb-12">
          <h2 className="text-3xl font-black font-display text-aura-gold-light mb-6 flex items-center gap-2">
            <span>🧮</span> The Scoring Algorithm
          </h2>
          <div className="bg-aura-darker/50 rounded-lg p-6 border border-aura-border/30">
            <div className="font-mono text-sm space-y-3">
              <div className="text-aura-text-light">
                <span className="text-aura-blue-light font-bold">score</span>
                <span className="text-aura-muted"> = </span>
                <span className="text-aura-red-light font-bold">(0.5 × proximity)</span>
                <span className="text-aura-muted"> + </span>
                <span className="text-aura-green-light font-bold">(0.3 × capacity)</span>
                <span className="text-aura-muted"> + </span>
                <span className="text-aura-gold-light font-bold">(0.2 × readiness)</span>
              </div>
              <div className="text-aura-muted text-xs pt-2 border-t border-aura-border/30">
                <p>readiness = (has_doctor ? 0.5 : 0) + (has_oxygen ? 0.5 : 0)</p>
                <p className="mt-1">proximity = inverse(haversine_distance)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Hospital Rankings Table */}
        <div className="glass rounded-xl p-10 border border-aura-border-light/30 backdrop-blur-xl mb-12">
          <h2 className="text-3xl font-black font-display text-aura-text mb-8 flex items-center gap-2">
            <span>🏥</span> Hospital Rankings (Real-Time)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-aura-border/40">
                  <th className="text-left text-aura-muted-dark py-4 font-bold text-xs uppercase tracking-wider">Rank</th>
                  <th className="text-left text-aura-muted-dark py-4 font-bold text-xs uppercase tracking-wider">Hospital</th>
                  <th className="text-right text-aura-muted-dark py-4 font-bold text-xs uppercase tracking-wider">Score</th>
                  <th className="text-right text-aura-muted-dark py-4 font-bold text-xs uppercase tracking-wider">ICU</th>
                  <th className="text-center text-aura-muted-dark py-4 font-bold text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {rankedHospitals.map((h, idx) => {
                  const isGKN = h.id === 6;
                  const isRank1 = idx === 0;
                  const bgClass = isGKN
                    ? 'bg-aura-red/10 border-aura-red/30'
                    : isRank1
                    ? 'bg-aura-gold/10 border-aura-gold/30'
                    : 'border-aura-border/20';

                  return (
                    <tr
                      key={h.id}
                      className={`border-b ${bgClass} transition-all hover:bg-aura-surface/50`}
                    >
                      <td className="py-4 font-black text-aura-text">#{idx + 1}</td>
                      <td className="py-4 text-aura-text font-semibold">{h.name}</td>
                      <td className="py-4 text-right font-mono font-black text-aura-gold-light">{h.score.toFixed(4)}</td>
                      <td className="py-4 text-right font-mono font-bold text-aura-text">{h.icu}</td>
                      <td className="py-4 text-center">
                        {isGKN ? (
                          <span className="text-aura-red-light font-bold text-xs uppercase">⚠ Skipped</span>
                        ) : h.icu > 0 ? (
                          <span className="text-aura-green-light font-bold text-xs uppercase">✓ Ready</span>
                        ) : (
                          <span className="text-aura-red-light font-bold text-xs uppercase">Full</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { stat: '47s', label: 'Response Time', icon: '⏱️', color: 'aura-red' },
            { stat: '6', label: 'Hospitals Managed', icon: '🏥', color: 'aura-blue' },
            { stat: '0', label: 'Phone Calls', icon: '📞', color: 'aura-green' },
          ].map((item, i) => (
            <div key={i} className={`glass rounded-xl p-8 border border-${item.color}/40 text-center backdrop-blur-xl`} style={{ borderColor: item.color === 'aura-red' ? 'rgba(220,38,38,0.4)' : item.color === 'aura-blue' ? 'rgba(37,99,235,0.4)' : 'rgba(22,163,74,0.4)' }}>
              <div className="text-4xl mb-3">{item.icon}</div>
              <p className={`text-4xl font-black font-display text-${item.color}-light mb-2`} style={{ color: item.color === 'aura-red' ? '#EF4444' : item.color === 'aura-blue' ? '#3B82F6' : '#22C55E' }}>
                {item.stat}
              </p>
              <p className="text-aura-muted text-sm font-medium uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Demo Section */}
        <div className="glass rounded-xl p-10 border border-aura-gold/40 bg-gradient-to-br from-aura-gold/10 via-transparent to-transparent backdrop-blur-xl mb-12">
          <h2 className="text-3xl font-black font-display text-aura-gold-light mb-8 flex items-center gap-3">
            <span>▶️</span> See It In Action
          </h2>

          <button
            onClick={onRunDemo}
            disabled={demoRunning}
            className="w-full group relative rounded-lg bg-gradient-to-r from-aura-red via-aura-red-light to-aura-red py-6 text-aura-darker font-black text-xl uppercase tracking-wider overflow-hidden transition-all hover:shadow-glow-red disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center justify-center gap-2">
              {demoRunning ? '⏳ Demo Running...' : '▶️ Run 21-Second Demo'}
            </span>
          </button>

          {/* Progress Bar */}
          {demoRunning && (
            <div className="mb-8">
              <div className="w-full bg-aura-darker/50 rounded-lg h-3 overflow-hidden border border-aura-border/30">
                <div
                  className="h-full bg-gradient-to-r from-aura-red via-aura-gold to-aura-green transition-all duration-100"
                  style={{ width: `${demoProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-aura-muted text-sm font-mono">{Math.round(demoProgress / 100 * 21)}s / 21s</p>
                <p className="text-aura-text font-bold">{Math.round(demoProgress)}%</p>
              </div>
            </div>
          )}

          {demoComplete && (
            <div className="glass rounded-lg p-8 bg-gradient-to-r from-aura-green/20 to-transparent border border-aura-green/50 text-center mb-6">
              <p className="text-aura-green-light font-black text-2xl mb-2">✅ COMPLETE</p>
              <p className="text-aura-text-light font-medium">SOS to Bed Confirmed in 21 seconds</p>
              <p className="text-aura-muted text-sm mt-3">Not nearest. <span className="text-aura-gold font-bold">Best.</span></p>
            </div>
          )}

          {/* Event Timeline */}
          {eventLog.length > 0 && (
            <div className="bg-aura-darker/50 rounded-lg p-6 border border-aura-border/30">
              <p className="text-aura-muted-dark text-xs font-bold uppercase tracking-wider mb-4">📋 Event Timeline</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {eventLog.map((event, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm">
                    <span className="text-aura-gold font-mono font-bold text-xs min-w-fit">{(event.time / 1000).toFixed(1)}s</span>
                    <span className="text-aura-text">{event.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="text-center py-12 border-t border-aura-border/30">
          <p className="text-2xl font-black font-display mb-3 bg-gradient-to-r from-aura-gold via-aura-red to-aura-gold bg-clip-text text-transparent">
            Not nearest hospital. BEST hospital. That's why we win.
          </p>
          <p className="text-aura-muted-dark text-sm font-medium">Emergency response systems powered by intelligent algorithms, not luck.</p>
        </div>
      </div>
    </div>
  );
}
