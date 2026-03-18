import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { API } from '../api/config';
import CustomAlert from '../components/CustomAlert';

const ETAT_COLORS = {
  'Bon':    { bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32' },
  'Mauvais':{ bg: '#ffebee', border: '#f44336', text: '#c62828' },
  'Abime':  { bg: '#fffde7', border: '#ffd600', text: '#f57f17' },
  'Abîmé':  { bg: '#fffde7', border: '#ffd600', text: '#f57f17' },
};

const ETAT_ICONS = {
  'Bon':     { name: 'checkmark-circle', color: '#2e7d32' },
  'Mauvais': { name: 'close-circle',     color: '#c62828' },
  'Abime':   { name: 'warning',          color: '#f57f17' },
  'Abîmé':   { name: 'warning',          color: '#f57f17' },
};

export default function HomeScreen({ navigation }) {
  const [materiels, setMateriels]   = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Alert states
  const [alert, setAlert] = useState({
    visible: false, type: 'info', title: '', message: '',
    confirmText: 'OK', cancelText: null,
    onConfirm: null, onCancel: null,
  });

  const showAlert = (config) => setAlert({ ...alert, visible: true, ...config });
  const hideAlert = () => setAlert((a) => ({ ...a, visible: false }));

  const fetchData = async () => {
    try {
      const [mRes, sRes] = await Promise.all([
        API.getAllMateriels(),
        API.getStats(),
      ]);
      const mData = await mRes.json();
      const sData = await sRes.json();
      setMateriels(Array.isArray(mData) ? mData : []);
      setStats(sData);
    } catch (e) {
      showAlert({
        type: 'error',
        title: 'Connexion impossible',
        message: 'Impossible de contacter le serveur.\nVerifiez que le backend tourne.',
        confirmText: 'OK',
        onConfirm: hideAlert,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const handleDelete = (item) => {
    showAlert({
      type: 'delete',
      title: 'Supprimer ce materiel ?',
      message: '"' + item.design + '" sera definitivement supprime.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      onCancel: hideAlert,
      onConfirm: async () => {
        hideAlert();
        try {
          await API.deleteMateriel(item.id);
          fetchData();
          showAlert({
            type: 'success',
            title: 'Supprime !',
            message: 'Le materiel a ete supprime avec succes.',
            confirmText: 'OK',
            onConfirm: hideAlert,
          });
        } catch {
          showAlert({
            type: 'error',
            title: 'Erreur',
            message: 'La suppression a echoue. Reessayez.',
            confirmText: 'OK',
            onConfirm: hideAlert,
          });
        }
      },
    });
  };

  const renderItem = ({ item }) => {
    const colors = ETAT_COLORS[item.etat] || ETAT_COLORS['Bon'];
    const icon   = ETAT_ICONS[item.etat]  || ETAT_ICONS['Bon'];
    return (
      <View style={[styles.card, { borderLeftColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.nMateriel}>#{item.n_materiel}</Text>
          <View style={[styles.etatBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <Ionicons name={icon.name} size={14} color={icon.color} style={{ marginRight: 4 }} />
            <Text style={[styles.etatText, { color: colors.text }]}>{item.etat}</Text>
          </View>
        </View>
        <Text style={styles.design}>{item.design}</Text>
        <View style={styles.quantiteRow}>
          <Ionicons name="cube-outline" size={16} color="#888" style={{ marginRight: 4 }} />
          <Text style={styles.quantite}>Quantite : <Text style={styles.boldText}>{item.quantite}</Text></Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditMateriel', { materiel: item })}
          >
            <Ionicons name="create-outline" size={16} color="#7b1fa2" style={{ marginRight: 5 }} />
            <Text style={styles.editBtnText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
            <Ionicons name="trash-outline" size={16} color="#c62828" style={{ marginRight: 5 }} />
            <Text style={styles.deleteBtnText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const FooterStats = () => (
    <View style={styles.footer}>
      <View style={styles.footerTitleRow}>
        <Ionicons name="bar-chart-outline" size={20} color="#6a1b9a" style={{ marginRight: 6 }} />
        <Text style={styles.footerTitle}>Recapitulatif</Text>
      </View>
      <View style={styles.footerRow}>
        <View style={styles.statBox}>
          <Ionicons name="layers-outline" size={24} color="#2e7d32" />
          <Text style={styles.statNumber}>{stats ? stats.total_quantite : 0}</Text>
          <Text style={styles.statLabel}>Quantite totale</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#ffebee' }]}>
          <Ionicons name="close-circle-outline" size={24} color="#c62828" />
          <Text style={[styles.statNumber, { color: '#c62828' }]}>{stats ? stats.nb_mauvais : 0}</Text>
          <Text style={styles.statLabel}>Nb Mauvais</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.statsNavBtn}
        onPress={() => navigation.navigate('Stats', { stats })}
      >
        <Ionicons name="pie-chart-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.statsNavBtnText}>Voir les graphiques</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6a1b9a" />
        <Text style={{ marginTop: 10, color: '#666' }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={materiels}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Aucun materiel enregistre</Text>
            <Text style={styles.emptySubText}>Appuyez sur + pour en ajouter</Text>
          </View>
        }
        ListFooterComponent={<FooterStats />}
        contentContainerStyle={{ padding: 12 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddMateriel')}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#f0f2f5' },
  centered:       { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 10, borderLeftWidth: 5, elevation: 3,
  },
  cardHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  nMateriel:      { fontSize: 13, color: '#888', fontWeight: '600' },
  etatBadge:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  etatText:       { fontSize: 12, fontWeight: '700' },
  design:         { fontSize: 17, fontWeight: 'bold', color: '#6a1b9a', marginBottom: 4 },
  quantiteRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  quantite:       { fontSize: 14, color: '#555' },
  boldText:       { fontWeight: 'bold', color: '#333' },
  cardActions:    { flexDirection: 'row' },
  editBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3e5f5', padding: 8, borderRadius: 8, marginRight: 5 },
  editBtnText:    { color: '#7b1fa2', fontWeight: '600', fontSize: 13 },
  deleteBtn:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffebee', padding: 8, borderRadius: 8 },
  deleteBtnText:  { color: '#c62828', fontWeight: '600', fontSize: 13 },
  footer:         { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 8, elevation: 3 },
  footerTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  footerTitle:    { fontSize: 16, fontWeight: 'bold', color: '#6a1b9a' },
  footerRow:      { flexDirection: 'row', marginBottom: 12 },
  statBox:        { flex: 1, backgroundColor: '#e8f5e9', borderRadius: 10, padding: 12, alignItems: 'center', marginHorizontal: 5 },
  statNumber:     { fontSize: 28, fontWeight: 'bold', color: '#2e7d32', marginTop: 4 },
  statLabel:      { fontSize: 12, color: '#555', textAlign: 'center', marginTop: 2 },
  statsNavBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#6a1b9a', padding: 12, borderRadius: 10 },
  statsNavBtnText:{ color: '#fff', fontWeight: '700', fontSize: 14 },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyText:      { fontSize: 18, fontWeight: 'bold', color: '#555', marginTop: 12 },
  emptySubText:   { fontSize: 13, color: '#aaa', marginTop: 4 },
  fab: {
    position: 'absolute', right: 20, bottom: 28,
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: '#6a1b9a', justifyContent: 'center', alignItems: 'center',
    elevation: 8,
  },
});