import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API } from '../api/config';
import CustomAlert from '../components/CustomAlert';

const ETATS = [
  { label: 'Bon',     icon: 'checkmark-circle', color: '#4caf50' },
  { label: 'Mauvais', icon: 'close-circle',     color: '#f44336' },
  { label: 'Abime',   icon: 'warning',          color: '#ffd600' },
];

export default function EditMaterielScreen({ navigation, route }) {
  const { materiel } = route.params;

  const [nMateriel, setNMateriel] = useState(materiel.n_materiel);
  const [design, setDesign]       = useState(materiel.design);
  const [etat, setEtat]           = useState(materiel.etat);
  const [quantite, setQuantite]   = useState(String(materiel.quantite));
  const [loading, setLoading]     = useState(false);

  const [alert, setAlert] = useState({
    visible: false, type: 'info', title: '', message: '',
    confirmText: 'OK', cancelText: null,
    onConfirm: null, onCancel: null,
  });
  const showAlert = (config) => setAlert({ ...alert, visible: true, ...config });
  const hideAlert = () => setAlert((a) => ({ ...a, visible: false }));

  const handleUpdate = async () => {
    if (!nMateriel.trim() || !design.trim() || !quantite.trim()) {
      showAlert({
        type: 'warning',
        title: 'Champs manquants',
        message: 'Veuillez remplir tous les champs avant de continuer.',
        confirmText: 'Compris',
        onConfirm: hideAlert,
      });
      return;
    }
    setLoading(true);
    try {
      const res = await API.updateMateriel(materiel.id, {
        n_materiel: nMateriel.trim(),
        design: design.trim(),
        etat,
        quantite: parseInt(quantite),
      });
      const data = await res.json();
      if (res.ok) {
        showAlert({
          type: 'success',
          title: 'Modification enregistree !',
          message: '"' + design.trim() + '" a ete mis a jour avec succes.',
          confirmText: 'OK',
          onConfirm: () => { hideAlert(); navigation.goBack(); },
        });
      } else {
        showAlert({
          type: 'error',
          title: 'Erreur',
          message: data.error || 'Une erreur est survenue lors de la modification.',
          confirmText: 'Reessayer',
          onConfirm: hideAlert,
        });
      }
    } catch {
      showAlert({
        type: 'error',
        title: 'Serveur introuvable',
        message: 'Impossible de contacter le serveur. Verifiez que le backend tourne.',
        confirmText: 'OK',
        onConfirm: hideAlert,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Modifier le materiel</Text>

        <Text style={styles.label}>N° Materiel</Text>
        <View style={styles.inputRow}>
          <Ionicons name="barcode-outline" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput style={styles.input} value={nMateriel} onChangeText={setNMateriel} autoCapitalize="characters" />
        </View>

        <Text style={styles.label}>Design</Text>
        <View style={styles.inputRow}>
          <Ionicons name="document-text-outline" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput style={styles.input} value={design} onChangeText={setDesign} />
        </View>

        <Text style={styles.label}>Etat</Text>
        <View style={styles.etatContainer}>
          {ETATS.map((e) => (
            <TouchableOpacity
              key={e.label}
              style={[styles.etatOption, etat === e.label && { backgroundColor: e.color, borderColor: e.color }]}
              onPress={() => setEtat(e.label)}
            >
              <Ionicons name={e.icon} size={20} color={etat === e.label ? '#fff' : e.color} style={{ marginBottom: 4 }} />
              <Text style={[styles.etatOptionText, etat === e.label && { color: '#fff' }]}>{e.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Quantite</Text>
        <View style={styles.inputRow}>
          <Ionicons name="layers-outline" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput style={styles.input} value={quantite} onChangeText={setQuantite} keyboardType="numeric" />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, loading && { backgroundColor: '#9e9e9e' }]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.submitBtnText}>Enregistrer les modifications</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close-outline" size={18} color="#999" style={{ marginRight: 4 }} />
          <Text style={styles.cancelBtnText}>Annuler</Text>
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        confirmText={alert.confirmText}
        cancelText={alert.cancelText}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#f0f2f5' },
  content:        { padding: 16 },
  card:           { backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 3 },
  sectionTitle:   { fontSize: 18, fontWeight: 'bold', color: '#6a1b9a', marginBottom: 20, textAlign: 'center' },
  label:          { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 6, marginTop: 14 },
  inputRow:       { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#ddd', borderRadius: 10, backgroundColor: '#fafafa' },
  inputIcon:      { paddingLeft: 12 },
  input:          { flex: 1, padding: 12, fontSize: 15, color: '#333' },
  etatContainer:  { flexDirection: 'row', justifyContent: 'space-between' },
  etatOption: {
    flex: 1, marginHorizontal: 4, padding: 12, borderRadius: 10,
    borderWidth: 2, borderColor: '#ddd', alignItems: 'center', backgroundColor: '#f5f5f5',
  },
  etatOptionText: { fontSize: 12, color: '#555', fontWeight: '600' },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#6a1b9a', padding: 15, borderRadius: 12, marginTop: 24,
  },
  submitBtnText:  { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, marginTop: 8 },
  cancelBtnText:  { color: '#999', fontSize: 15 },
});