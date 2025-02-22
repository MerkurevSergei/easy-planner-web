"use client";
import ControlPanel from './ControlPanel/ControlPanel';
import { useState, useEffect } from 'react';
import styles from './Directory.module.css';

export default function Directory({ config }) {
  const { title, columns, formFields, API_CONFIG } = config;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка данных с сервера
  const fetchData = async (signal) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_DATA}`, {
        signal
      });

      if (!response.ok) throw new Error('Ошибка загрузки данных');
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('Ошибка:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    
    fetchData(abortController.signal);

    return () => abortController.abort();
  }, []);

  const handleAddClick = () => {
    setEditMode(false);
    setFormData({});
    setIsMenuOpen(true);
  };

  const handleEditClick = () => {
    if (selectedRow) {
      const selectedItem = data.find(item => item.id === selectedRow);
      setFormData(selectedItem);
      setEditMode(true);
      setIsMenuOpen(true);
    }
  };

  const handleDeleteClick = () => {
    if (selectedRow) {
      setData(prev => prev.filter(item => item.id !== selectedRow));
      setSelectedRow(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editMode) {
      // Редактирование существующей записи
      setData(prev => prev.map(item => 
        item.id === selectedRow ? { ...formData, id: selectedRow } : item
      ));
    } else {
      // Добавление новой записи
      const newItem = { ...formData, id: Date.now() };
      setData(prev => [...prev, newItem]);
    }
    
    setIsMenuOpen(false);
    setSelectedRow(null);
  };

  const handleCancel = () => {
    setIsMenuOpen(false);
    setSelectedRow(null);
  };

  return (
    <div className={styles.directory}>
      {/* Заголовок справочника */}
      <div className={styles.directoryTitle}>
        <h1>{title}</h1>
      </div>

      <ControlPanel 
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        isEditDisabled={!selectedRow}
      />

      {/* Таблица */}
      <div className={styles.tableContainer}>
      {loading ? (
          <div className={styles.loader}>Загрузка...</div>
        ) : (
          <table className={styles.dataTable}>
            <thead>
              <tr className={styles.tableRow}>
                {columns.map((column) => (
                  <th 
                    key={column.key} 
                    className={styles.tableHead}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className={`${styles.tableRow} ${
                    selectedRow === item.id ? styles.selectedRow : ''
                  }`}
                  onClick={() => setSelectedRow(item.id)}
                >
                  {columns.map((column) => (
                    <td 
                      key={column.key} 
                      className={styles.tableData}
                      title={item[column.key]}
                    >
                      {item[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
      </div>

      {/* Оверлей и боковое меню */}
      {isMenuOpen && (
        <div 
          className={`${styles.sideMenuOverlay} ${styles.visible}`} 
          onClick={handleCancel}
        />
      )}

      <div className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ''}`}>
        <h2 className={styles.formTitle}>
          {editMode ? 'Редактировать элемент' : 'Добавить элемент'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div key={field.key} className={styles.formGroup}>
              <label className={styles.formLabel}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  className={`${styles.formInput} ${styles.formTextarea}`}
                  id={field.key}
                  name={field.key}
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    [field.key]: e.target.value
                  }))}
                  required={field.required}
                />
              ) : (
                <input
                  className={styles.formInput}
                  type={field.type}
                  id={field.key}
                  name={field.key}
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    [field.key]: e.target.value
                  }))}
                  required={field.required}
                />
              )}
            </div>
          ))}
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.formButton}
            >
              {editMode ? 'Сохранить' : 'Добавить'}
            </button>
            <button 
              type="button" 
              className={styles.formButton}
              onClick={handleCancel}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}