import React from 'react';
import {
  View, Text, TouchableOpacity, Modal,
  StyleSheet, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TYPES = {
  success: {
    icon: 'checkmark-circle',
    color: '#4caf50',
    bg: '#e8f5e9',
    btnColor: '#4caf50',
  },
  error: {
    icon: 'close-circle',
    color: '#f44336',
    bg: '#ffebee',
    btnColor: '#f44336',
  },
  warning: {
    icon: 'warning',
    color: '#ffd600',
    bg: '#fffde7',
    btnColor: '#f57f17',
  },
  delete: {
    icon: 'trash',
    color: '#f44336',
    bg: '#ffebee',
    btnColor: '#f44336',
  },
  info: {
    icon: 'information-circle',
    color: '#6a1b9a',
    bg: '#f3e5f5',
    btnColor: '#6a1b9a',
  },
};

export default function CustomAlert({
  visible,
  type = 'info',
  title,
  message,
  confirmText = 'OK',
  cancelText = null,
  onConfirm,
  onCancel,
}) {
  const t = TYPES[type] || TYPES.info;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel || onConfirm}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* Icone */}
          <View style={[styles.iconCircle, { backgroundColor: t.bg }]}>
            <Ionicons name={t.icon} size={48} color={t.color} />
          </View>

          {/* Titre */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          {message ? <Text style={styles.message}>{message}</Text> : null}

          {/* Boutons */}
          <View style={[styles.btnRow, !cancelText && { justifyContent: 'center' }]}>
            {cancelText && (
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Ionicons name="close-outline" size={18} color="#888" style={{ marginRight: 5 }} />
                <Text style={styles.cancelBtnText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: t.btnColor }]}
              onPress={onConfirm}
            >
              <Ionicons
                name={type === 'delete' ? 'trash-outline' : type === 'success' ? 'checkmark-outline' : 'arrow-forward-outline'}
                size={18}
                color="#fff"
                style={{ marginRight: 5 }}
              />
              <Text style={styles.confirmBtnText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: Dimensions.get('window').width * 0.82,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
  },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18, fontWeight: 'bold', color: '#222',
    textAlign: 'center', marginBottom: 8,
  },
  message: {
    fontSize: 14, color: '#666',
    textAlign: 'center', lineHeight: 20, marginBottom: 20,
  },
  btnRow: {
    flexDirection: 'row', width: '100%', marginTop: 8,
  },
  cancelBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 12,
    padding: 12, marginRight: 8,
  },
  cancelBtnText: { color: '#888', fontWeight: '600', fontSize: 14 },
  confirmBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 12, padding: 12,
  },
  confirmBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});