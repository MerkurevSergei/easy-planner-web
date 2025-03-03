"use client";
import ControlPanel from './ControlPanel/ControlPanel';
import DataTable from './DataTable/DataTable';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Валидация обязательных полей
      const requiredFields = formFields.filter(f => f.required);
      const isInvalid = requiredFields.some(f => !formData[f.key]);
      
      if (isInvalid) {
        throw new Error('Заполните все обязательные поля');
      }
  
      setLoading(true);
      setError(null);
  
      // Оптимистичное обновление для добавления
      let tempId = null;
      if (!editMode) {
        tempId = Date.now();
        setData(prev => [...prev, { ...formData, id: tempId }]);
      }
  
      const url = editMode 
        ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PUT_DATA}/${selectedRow}`
        : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POST_DATA}`;
  
      const method = editMode ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error(editMode ? 'Ошибка обновления' : 'Ошибка создания');
  
      const result = await response.json();
  
      // Обновляем данные с ответом сервера
      setData(prev => {
        if (editMode) {
          return prev.map(item => item.id === selectedRow ? result : item);
        } else {
          return prev.map(item => item.id === tempId ? result : item);
        }
      });
  
      setIsMenuOpen(false);
      setSelectedRow(null);
      setFormData({});
      
    } catch (err) {
      // Откатываем оптимистичное обновление при ошибке
      if (!editMode && tempId) {
        setData(prev => prev.filter(item => item.id !== tempId));
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

      <DataTable
        columns={columns}
        data={data}
        selectedRow={selectedRow}
        onSelect={setSelectedRow}
        loading={loading}
      />

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