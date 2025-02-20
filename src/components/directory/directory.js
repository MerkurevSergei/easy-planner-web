"use client";
import { useState } from 'react';
import styles from './directory.module.css';

export default function Directory({ config }) {
  const { title, columns, formFields } = config;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({});

  const handleAddClick = () => {
    setFormData({});
    setIsMenuOpen(true);
  };

  const handleCancel = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={styles.directory}>
      {/* Заголовок справочника */}
      <div className={styles.directoryTitle}>
        <h1>{title}</h1>
      </div>

      {/* Панель управления */}
      <div className={styles.controlPanel}>
        <button onClick={handleAddClick} title="Добавить">&#x2795;</button>
        <button id="editBtn" title="Редактировать">&#x270E;</button>
        <button id="deleteBtn" title="Удалить">&#x1F5D1;</button>
      </div>

      {/* Таблица */}
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead className={styles.tableHead}>
            <tr className={styles.tableRow}>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            <tr className={styles.tableRow}>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Боковое меню для формы */}
      <div className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ''}`}>
        <h2 id="formTitle">Добавить элемент</h2>
        <form id="elementForm">
          {formFields.map((field) => (
            <div key={field.key}>
              <label htmlFor={field.key}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.key}
                  name={field.key}
                  rows="3"
                  required
                />
              ) : (
                <input
                  type={field.type}
                  id={field.key}
                  name={field.key}
                  required
                />
              )}
            </div>
          ))}
          <button type="submit">Сохранить</button>
          <button type="button" onClick={handleCancel}>Отмена</button>
        </form>
      </div>
    </div>
  );
}