import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView, Keyboard } from 'react-native';
import { getDBConnection, createTable, insertNote, getNotes, deleteNote, updateNote } from './database';

export default function App() {
  const [db, setDb] = useState(null);
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Uygulama ilk açıldığında veritabanını hazırla ve verileri çek
  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await getDBConnection();
        await createTable(database);
        setDb(database);
        await refreshNotes(database);
      } catch (error) {
        console.error("Veritabanı başlatılamadı:", error);
      }
    };
    initDB();
  }, []);

  // Listeyi veritabanından güncel haliyle çeken yardımcı fonksiyon
  const refreshNotes = async (databaseInstance) => {
    const currentDb = databaseInstance || db;
    if (currentDb) {
      const allNotes = await getNotes(currentDb);
      setNotes(allNotes);
    }
  };

  // Ekleme veya Güncelleme butonuna basıldığında çalışır
  const handleSave = async () => {
    if (text.trim() === '') return;

    if (editingNoteId) {
      // Güncelleme Modu
      await updateNote(db, editingNoteId, text);
      setEditingNoteId(null);
    } else {
      // Yeni Ekleme Modu
      await insertNote(db, text);
    }

    setText('');
    Keyboard.dismiss();
    await refreshNotes();
  };

  // Silme butonuna basıldığında çalışır
  const handleDelete = async (id) => {
    await deleteNote(db, id);
    await refreshNotes();
  };

  // Düzenle butonuna basıldığında veriyi input alanına yükler
  const handleEditSetup = (note) => {
    setText(note.content);
    setEditingNoteId(note.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Günün Notu / Mesajı</Text>
      </View>

      {/* Not Giriş Alanı */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Bugünün mesajını veya notunu yazın..."
          placeholderTextColor="#888"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={[styles.button, editingNoteId ? styles.updateBtn : styles.addBtn]} onPress={handleSave}>
          <Text style={styles.buttonText}>{editingNoteId ? "Güncelle" : "Ekle"}</Text>
        </TouchableOpacity>
      </View>

      {/* Not Listesi */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <View style={styles.noteTextContainer}>
              <Text style={styles.noteContent}>{item.content}</Text>
              <Text style={styles.noteDate}>{item.date}</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEditSetup(item)}>
                <Text style={styles.actionText}>📝</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.actionText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz eklenmiş bir not bulunmuyor.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  headerContainer: { padding: 20, backgroundColor: '#4a69bd', alignItems: 'center', paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  inputContainer: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#dcdde1', fontSize: 16, marginRight: 10 },
  button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, justifyYontent: 'center' },
  addBtn: { backgroundColor: '#4cd137' },
  updateBtn: { backgroundColor: '#eccc68' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  listContainer: { padding: 15 },
  noteCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, elevation: 2 },
  noteTextContainer: { flex: 1, marginRight: 10 },
  noteContent: { fontSize: 16, color: '#2f3640' },
  noteDate: { fontSize: 12, color: '#7f8c8d', marginTop: 5 },
  actionButtons: { flexDirection: 'row' },
  editButton: { padding: 8, backgroundColor: '#f1f2f6', borderRadius: 6, marginRight: 5 },
  deleteButton: { padding: 8, backgroundColor: '#ffeaa7', borderRadius: 6 },
  actionText: { fontSize: 16 },
  emptyText: { textAlign: 'center', color: '#7f8c8d', marginTop: 40, fontSize: 16 }
});