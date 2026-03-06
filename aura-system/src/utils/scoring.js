export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function scoreHospital(h, pLat = 11.0168, pLng = 76.9558) {
  const dist = haversine(pLat, pLng, h.lat, h.lng);
  const readiness = (h.has_doctor ? 0.5 : 0) + (h.has_oxygen ? 0.5 : 0);
  return (0.5 * (1 / (dist + 0.1))) + (0.3 * Math.min(h.icu / 10, 1)) + (0.2 * readiness);
}

export function rankHospitals(hospitals, pLat = 11.0168, pLng = 76.9558) {
  return [...hospitals]
    .map(h => ({ ...h, score: scoreHospital(h, pLat, pLng) }))
    .sort((a, b) => b.score - a.score);
}
