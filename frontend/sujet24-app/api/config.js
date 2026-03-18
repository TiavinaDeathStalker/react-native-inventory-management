// ⚠️ Remplacez par l'IP de votre machine Ubuntu sur le réseau local
// Pour trouver votre IP : tapez "ip addr" dans le terminal
// Exemple: 192.168.1.XX
// Si vous testez sur le même PC (web/emulateur), utilisez localhost

//const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'http://127.0.0.1:3000'; // ← Pour tester sur téléphone réel

export const API = {
  getAllMateriels: () => fetch(`${BASE_URL}/materiels`),
  
  getStats: () => fetch(`${BASE_URL}/materiels/stats`),
  
  addMateriel: (data) =>
    fetch(`${BASE_URL}/materiels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  
  updateMateriel: (id, data) =>
    fetch(`${BASE_URL}/materiels/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  
  deleteMateriel: (id) =>
    fetch(`${BASE_URL}/materiels/${id}`, {
      method: 'DELETE',
    }),
};
