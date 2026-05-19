import * as SQLite from 'expo-sqlite';

// Veritabanını asenkron olarak açıyoruz/oluşturuyoruz
export const getDBConnection = async () => {
  return await SQLite.openDatabaseAsync('notes.db');
};

// İlk açılışta notlar tablosunu oluşturan fonksiyon
export const createTable = async (db) => {
  const query = `
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `;
  await db.execAsync(query);
};

// Yeni Not/Mesaj Ekleme (Create)
export const insertNote = async (db, content) => {
  const query = 'INSERT INTO notes (content, date) VALUES (?, ?);';
  const currentDate = new Date().toLocaleDateString('tr-TR');
  await db.runAsync(query, [content, currentDate]);
};

// Notları Listeleme (Read)
export const getNotes = async (db) => {
  const query = 'SELECT * FROM notes ORDER BY id DESC;';
  return await db.getAllAsync(query);
};

// Not Silme (Delete)
export const deleteNote = async (db, id) => {
  const query = 'DELETE FROM notes WHERE id = ?;';
  await db.runAsync(query, [id]);
};

// Not Güncelleme (Update)
export const updateNote = async (db, id, newContent) => {
  const query = 'UPDATE notes SET content = ? WHERE id = ?;';
  await db.runAsync(query, [newContent, id]);
};