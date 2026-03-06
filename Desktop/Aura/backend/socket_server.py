import socketio
import time

# Create AsyncServer
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*'
)

@sio.event
async def connect(sid, environ):
    print(f"INFO: Client connected: {sid}")
    # Auto-join every client to the global 'all' room
    await sio.enter_room(sid, 'all')
    print(f"INFO: {sid} auto-joined room 'all'")

@sio.event
async def join_emergency(sid, data):
    emergency_id = data.get('emergency_id')
    role = data.get('role', 'unknown')
    # Always join global room
    await sio.enter_room(sid, 'all')
    if emergency_id and emergency_id != 'all':
        await sio.enter_room(sid, emergency_id)
        print(f"INFO: {role} joined room {emergency_id}")
    print(f"INFO: {role} ({sid}) is in global room 'all'")

@sio.event
async def sos_pressed(sid, data):
    """When patient presses SOS, broadcast to all (driver + hospital)"""
    print(f"INFO: SOS pressed event received from {sid}")
    await sio.emit('emergency_assigned', data, room='all', skip_sid=sid)

@sio.event
async def patient_location_update(sid, data):
    """Broadcast patient location to driver"""
    await sio.emit('patient_location_update', data, room='all', skip_sid=sid)

@sio.event
async def hospital_accept(sid, data):
    """Hospital confirmed - tell patient"""
    await sio.emit('hospital_confirmed', data, room='all', skip_sid=sid)

@sio.event
async def disconnect(sid):
    print(f"INFO: Client disconnected: {sid}")

@sio.event
async def update_location(sid, data):
    emergency_id = data.get('emergency_id')
    lat = data.get('lat')
    lng = data.get('lng')
    if emergency_id:
        await sio.emit('ambulance_position', {
            'lat': lat,
            'lng': lng,
            'emergency_id': emergency_id,
            'timestamp': time.time()
        }, room='all')

async def emit_location(emergency_id, lat, lng):
    await sio.emit('ambulance_position', {
        'lat': lat,
        'lng': lng,
        'emergency_id': emergency_id
    }, room='all')

async def emit_confirmed(emergency_id, hospital_name):
    await sio.emit('hospital_confirmed', {
        'emergency_id': emergency_id,
        'hospital_name': hospital_name,
        'message': "Bed confirmed. ER team is ready.",
        'status': "confirmed"
    }, room='all')
