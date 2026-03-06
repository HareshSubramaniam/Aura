import { useState, useEffect } from 'react';
import RoleSelector from './pages/RoleSelector';
import SOSScreen from './pages/SOSScreen';
import DriverScreen from './pages/DriverScreen';
import HospitalDashboard from './pages/HospitalDashboard';
import OverviewScreen from './pages/OverviewScreen';
import socket from './socket';

const PATIENT_LAT = 11.0168;
const PATIENT_LNG = 76.9558;

export default function App() {
  const [activeRole, setActiveRole] = useState(null);
  const [loggedInProfile, setLoggedInProfile] = useState(null);
  const [emergency, setEmergency] = useState(null);
  const [patientPickedUp, setPatientPickedUp] = useState(false);
  const [hospitalConfirmed, setHospitalConfirmed] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);

  useEffect(() => {
    socket.emit('join_emergency', { role: activeRole });
    
    socket.on('hospital_confirmed', () => {
      setHospitalConfirmed(true);
    });

    socket.on('status_update', (data) => {
      setEmergency(prev => prev ? { ...prev, status: data.status } : null);
    });

    socket.on('emergency_created', (data) => {
      setEmergency(data);
    });

    socket.on('vitals_received', (data) => {
      setEmergency(prev => prev ? { ...prev, vitals: data.vitals } : null);
    });

    socket.on('patient_location_update', (data) => {
      // Update emergency with latest patient location
      setEmergency(prev => prev ? { ...prev, lat: data.lat, lng: data.lng } : null);
    });

    socket.on('hospital_updated', (data) => {
      // Rankings updated
    });

    return () => {
      socket.off('hospital_confirmed');
      socket.off('status_update');
      socket.off('emergency_created');
      socket.off('vitals_received');
      socket.off('patient_location_update');
      socket.off('hospital_updated');
    };
  }, [activeRole]);

  const handleSelectRole = (role, profile = null) => {
    setActiveRole(role);
    if (profile) {
      setLoggedInProfile(profile);
    }
    setEmergency(null);
    setPatientPickedUp(false);
    setHospitalConfirmed(false);
  };

  const handleSOSPress = (emergencyData) => {
    setEmergency(emergencyData);
    socket.emit('sos_pressed', emergencyData);
    // Emit patient location to driver in real-time
    socket.emit('patient_location_update', {
      emergency_id: emergencyData.id || emergencyData.emergency_id,
      patientName: emergencyData.patientName,
      lat: emergencyData.lat,
      lng: emergencyData.lng,
      timestamp: new Date().toISOString()
    });
  };

  const handlePickup = () => {
    setPatientPickedUp(true);
  };

  const handleAccept = () => {
    setHospitalConfirmed(true);
    socket.emit('hospital_accept', { emergency_id: emergency?.id });
  };

  const handleRunDemo = () => {
    if (demoRunning) return;
    setDemoRunning(true);

    const demoSteps = [
      { time: 0, action: () => { setActiveRole('patient'); setEmergency(null); setPatientPickedUp(false); setHospitalConfirmed(false); } },
      { time: 4000, action: () => { const emerg = { id: 'demo-' + Date.now(), emergency_id: 'demo-' + Date.now(), patientName: 'Rajesh Kumar', lat: PATIENT_LAT, lng: PATIENT_LNG, eta: 480, vitals: null, assignedHospital: null, status: 'SOS' }; setEmergency(emerg); } },
      { time: 6000, action: () => setActiveRole('driver') },
      { time: 10000, action: () => handlePickup() },
      { time: 13000, action: () => setActiveRole('hospital') },
      { time: 14000, action: () => {} },
      { time: 16000, action: () => handleAccept() },
      { time: 18000, action: () => setActiveRole('patient') },
      { time: 21000, action: () => { setActiveRole('overview'); setDemoRunning(false); } },
    ];

    demoSteps.forEach(step => {
      setTimeout(step.action, step.time);
    });
  };

  if (!activeRole) {
    return <RoleSelector onSelectRole={handleSelectRole} />;
  }

  const roleColorMap = {
    patient: 'aura-red',
    driver: 'aura-blue',
    hospital: 'aura-green',
  };

  const roleLabels = {
    patient: 'Patient',
    driver: 'Ambulance Driver',
    hospital: 'Hospital',
  };

  // Only allow overview role for demo, restrict others strictly
  const isRestrictedRole = ['patient', 'driver', 'hospital'].includes(activeRole);
  const canAccessOverview = activeRole === 'patient' || activeRole === 'overview';

  return (
    <div className="w-full h-screen flex flex-col bg-aura-dark">
      {/* Top Nav Bar - Only show current role tab */}
      <nav className="bg-aura-surface border-b border-aura-border flex items-center px-6 h-16">
        <button
          onClick={() => setActiveRole(null)}
          className="text-aura-text hover:text-aura-gold mr-6 transition-colors"
          title="Logout"
        >
          ← Logout
        </button>
        
        {/* Show role tabs + overview for patient */}
        {(isRestrictedRole || activeRole === 'overview') && (
          <div className="flex gap-4 flex-1 items-center">
            <div className={`px-4 py-2 rounded font-medium ${
              activeRole === 'overview' ? 'bg-aura-gold text-white' : `bg-${roleColorMap[activeRole]} text-white`
            }`}>
              {activeRole === 'overview' ? 'Overview' : roleLabels[activeRole]}
            </div>
            
            {/* Show overview link for patients */}
            {activeRole === 'patient' && (
              <button
                onClick={() => setActiveRole('overview')}
                className="px-4 py-2 rounded font-medium bg-transparent text-aura-muted hover:text-aura-gold transition-colors"
              >
                📊 Overview
              </button>
            )}

            {/* Back button in overview for patients */}
            {activeRole === 'overview' && (
              <button
                onClick={() => setActiveRole('patient')}
                className="px-4 py-2 rounded font-medium bg-transparent text-aura-muted hover:text-aura-gold transition-colors"
              >
                👤 Patient
              </button>
            )}
            
            <span className="text-aura-muted text-sm ml-auto py-2">
              {loggedInProfile?.fullName || 'User'} ({loggedInProfile?.email})
            </span>
          </div>
        )}
      </nav>

      {/* Content - Only render the screen for logged-in role */}
      <div className="flex-1 overflow-auto">
        {activeRole === 'patient' && (
          <SOSScreen
            emergency={emergency}
            onSOSPress={handleSOSPress}
            hospitalConfirmed={hospitalConfirmed}
            patientProfile={loggedInProfile}
          />
        )}
        {activeRole === 'driver' && (
          <DriverScreen
            emergency={emergency}
            patientPickedUp={patientPickedUp}
            onPickup={handlePickup}
            driverProfile={loggedInProfile}
          />
        )}
        {activeRole === 'hospital' && (
          <HospitalDashboard
            emergency={emergency}
            onAccept={handleAccept}
            hospitalProfile={loggedInProfile}
          />
        )}
        {activeRole === 'overview' && (
          <OverviewScreen
            onRunDemo={handleRunDemo}
            emergency={emergency}
            demoRunning={demoRunning}
          />
        )}
      </div>
    </div>
  );
}
