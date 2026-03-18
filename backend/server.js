const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ===================== CONFIGURATION BASE DE DONNÉES =====================
const db = mysql.createConnection({
  host: 'localhost',
  user: 'sujet24',         // Changez selon votre config MySQL
  password: 'sujet24pass',         // Changez selon votre config MySQL
  database: 'sujet24_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur connexion MySQL:', err.message);
    return;
  }
  console.log('✅ Connecté à MySQL');

  // Créer la table si elle n'existe pas
  const createTable = `
    CREATE TABLE IF NOT EXISTS materiel (
      id INT AUTO_INCREMENT PRIMARY KEY,
      n_materiel VARCHAR(50) NOT NULL UNIQUE,
      design VARCHAR(100) NOT NULL,
      etat ENUM('Bon', 'Mauvais', 'Abîmé') NOT NULL,
      quantite INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(createTable, (err) => {
    if (err) console.error('Erreur création table:', err.message);
    else console.log('✅ Table materiel prête');
  });
});

// ===================== ROUTES API =====================

// GET - Récupérer tous les matériels
app.get('/materiels', (req, res) => {
  db.query('SELECT * FROM materiel ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET - Stats (total quantité + nombre par état)
app.get('/materiels/stats', (req, res) => {
  const query = `
    SELECT 
      SUM(quantite) AS total_quantite,
      SUM(CASE WHEN etat = 'Mauvais' THEN quantite ELSE 0 END) AS total_mauvais,
      SUM(CASE WHEN etat = 'Bon' THEN quantite ELSE 0 END) AS total_bon,
      SUM(CASE WHEN etat = 'Abîmé' THEN quantite ELSE 0 END) AS total_abime,
      COUNT(CASE WHEN etat = 'Mauvais' THEN 1 END) AS nb_mauvais,
      COUNT(CASE WHEN etat = 'Bon' THEN 1 END) AS nb_bon,
      COUNT(CASE WHEN etat = 'Abîmé' THEN 1 END) AS nb_abime
    FROM materiel
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// POST - Ajouter un matériel
app.post('/materiels', (req, res) => {
  const { n_materiel, design, etat, quantite } = req.body;
  if (!n_materiel || !design || !etat || quantite === undefined) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }
  db.query(
    'INSERT INTO materiel (n_materiel, design, etat, quantite) VALUES (?, ?, ?, ?)',
    [n_materiel, design, etat, quantite],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY')
          return res.status(409).json({ error: 'N° matériel déjà existant' });
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Matériel ajouté', id: result.insertId });
    }
  );
});

// PUT - Modifier un matériel
app.put('/materiels/:id', (req, res) => {
  const { id } = req.params;
  const { n_materiel, design, etat, quantite } = req.body;
  db.query(
    'UPDATE materiel SET n_materiel=?, design=?, etat=?, quantite=? WHERE id=?',
    [n_materiel, design, etat, quantite, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Matériel modifié' });
    }
  );
});

// DELETE - Supprimer un matériel
app.delete('/materiels/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM materiel WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Matériel supprimé' });
  });
});

// ===================== DÉMARRAGE SERVEUR =====================
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
