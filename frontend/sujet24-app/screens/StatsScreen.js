import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const CHART_CONFIG = {
  backgroundColor: '#6a1b9a',
  backgroundGradientFrom: '#6a1b9a',
  backgroundGradientTo: '#283593',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: { borderRadius: 16 },
};

export default function StatsScreen({ route }) {
  const { stats } = route.params;

  const bon     = parseInt(stats?.nb_bon     || 0);
  const mauvais = parseInt(stats?.nb_mauvais || 0);
  const abime   = parseInt(stats?.nb_abime   || 0);
  const total   = bon + mauvais + abime;

  const barData = {
    labels: ['Bon', 'Mauvais', 'Abime'],
    datasets: [{ data: [bon, mauvais, abime] }],
  };

  const pieData = [
    { name: 'Bon',     population: bon     || 0, color: '#4caf50', legendFontColor: '#333', legendFontSize: 13 },
    { name: 'Mauvais', population: mauvais || 0, color: '#f44336', legendFontColor: '#333', legendFontSize: 13 },
    { name: 'Abime',   population: abime   || 0, color: '#ffd600', legendFontColor: '#333', legendFontSize: 13 },
  ];

  const recapItems = [
    { label: 'Total',   value: total,   icon: 'layers-outline',        color: '#1565c0', bg: '#e3f2fd' },
    { label: 'Bon',     value: bon,     icon: 'checkmark-circle',      color: '#2e7d32', bg: '#e8f5e9' },
    { label: 'Mauvais', value: mauvais, icon: 'close-circle',          color: '#c62828', bg: '#ffebee' },
    { label: 'Abime',   value: abime,   icon: 'warning',               color: '#f57f17', bg: '#fff3e0' },
  ];

  const tableRows = [
    { etat: 'Bon',     nb: bon,     qty: stats?.total_bon     || 0, color: '#4caf50', icon: 'checkmark-circle' },
    { etat: 'Mauvais', nb: mauvais, qty: stats?.total_mauvais || 0, color: '#f44336', icon: 'close-circle'     },
    { etat: 'Abime',   nb: abime,   qty: stats?.total_abime   || 0, color: '#ffd600', icon: 'warning'          },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Recap Cards */}
      <View style={styles.recapRow}>
        {recapItems.map((item, i) => (
          <View key={i} style={[styles.recapCard, { backgroundColor: item.bg }]}>
            <Ionicons name={item.icon} size={20} color={item.color} />
            <Text style={[styles.recapNum, { color: item.color }]}>{item.value}</Text>
            <Text style={styles.recapLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Histogramme */}
      <View style={styles.chartCard}>
        <View style={styles.chartTitleRow}>
          <Ionicons name="bar-chart" size={20} color="#6a1b9a" style={{ marginRight: 8 }} />
          <Text style={styles.chartTitle}>Histogramme par etat</Text>
        </View>
        {total > 0 ? (
          <BarChart
            data={barData}
            width={screenWidth - 56}
            height={220}
            chartConfig={CHART_CONFIG}
            style={styles.chart}
            showValuesOnTopOfBars
            fromZero
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#ccc" />
            <Text style={styles.noData}>Aucune donnee disponible</Text>
          </View>
        )}
      </View>

      {/* Camembert */}
      <View style={styles.chartCard}>
        <View style={styles.chartTitleRow}>
          <Ionicons name="pie-chart" size={20} color="#6a1b9a" style={{ marginRight: 8 }} />
          <Text style={styles.chartTitle}>Repartition (Camembert)</Text>
        </View>
        {total > 0 ? (
          <PieChart
            data={pieData}
            width={screenWidth - 56}
            height={200}
            chartConfig={CHART_CONFIG}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#ccc" />
            <Text style={styles.noData}>Aucune donnee disponible</Text>
          </View>
        )}
      </View>

      {/* Tableau recapitulatif */}
      <View style={styles.chartCard}>
        <View style={styles.chartTitleRow}>
          <Ionicons name="list" size={20} color="#6a1b9a" style={{ marginRight: 8 }} />
          <Text style={styles.chartTitle}>Tableau des quantites</Text>
        </View>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Etat</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, { textAlign: 'center' }]}>Nb materiels</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, { textAlign: 'center' }]}>Quantite</Text>
        </View>
        {tableRows.map((row, i) => (
          <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
            <View style={[styles.tableCell, { flexDirection: 'row', alignItems: 'center' }]}>
              <Ionicons name={row.icon} size={16} color={row.color} style={{ marginRight: 6 }} />
              <Text style={styles.tableCellText}>{row.etat}</Text>
            </View>
            <Text style={[styles.tableCell, styles.tableCellText, { textAlign: 'center' }]}>{row.nb}</Text>
            <Text style={[styles.tableCell, styles.tableCellText, { textAlign: 'center' }]}>{row.qty}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <View style={[styles.tableCell, { flexDirection: 'row', alignItems: 'center' }]}>
            <Ionicons name="layers" size={16} color="#6a1b9a" style={{ marginRight: 6 }} />
            <Text style={styles.totalText}>TOTAL</Text>
          </View>
          <Text style={[styles.tableCell, styles.totalText, { textAlign: 'center' }]}>{total}</Text>
          <Text style={[styles.tableCell, styles.totalText, { textAlign: 'center' }]}>{stats?.total_quantite || 0}</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#f0f2f5' },
  content:        { padding: 16, paddingBottom: 40 },
  recapRow:       { flexDirection: 'row', marginBottom: 16 },
  recapCard:      { flex: 1, marginHorizontal: 4, borderRadius: 12, padding: 10, alignItems: 'center', elevation: 2 },
  recapNum:       { fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  recapLabel:     { fontSize: 10, color: '#666', marginTop: 2 },
  chartCard:      { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 3 },
  chartTitleRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  chartTitle:     { fontSize: 16, fontWeight: 'bold', color: '#6a1b9a' },
  chart:          { borderRadius: 12 },
  noDataContainer:{ alignItems: 'center', padding: 20 },
  noData:         { textAlign: 'center', color: '#aaa', marginTop: 8, fontSize: 14 },
  tableHeader:    { flexDirection: 'row', backgroundColor: '#6a1b9a', borderRadius: 8, paddingVertical: 10, marginBottom: 4 },
  tableHeaderText:{ color: '#fff', fontWeight: 'bold', paddingHorizontal: 8 },
  tableRow:       { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  tableRowAlt:    { backgroundColor: '#fafafa' },
  tableCell:      { flex: 1, paddingHorizontal: 8 },
  tableCellText:  { fontSize: 14, color: '#333' },
  totalRow:       { flexDirection: 'row', backgroundColor: '#e8eaf6', borderRadius: 8, paddingVertical: 10, marginTop: 4 },
  totalText:      { fontWeight: 'bold', color: '#6a1b9a', fontSize: 14 },
});