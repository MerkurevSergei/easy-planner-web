"use client";
import styles from './ControlPanel.module.css';

export default function ControlPanel({ 
  onAdd, 
  onEdit, 
  onDelete, 
  isEditDisabled 
}) {
  return (
    <div className={styles.panel}>
      <button 
        className={styles.button}
        onClick={onAdd} 
        title="Добавить"
      >
        ➕
      </button>
      <button 
        className={styles.button}
        onClick={onEdit} 
        title="Редактировать"
        disabled={isEditDisabled}
      >
        ✏️
      </button>
      <button 
        className={styles.button}
        onClick={onDelete} 
        title="Удалить"
        disabled={isEditDisabled}
      >
        🗑️
      </button>
    </div>
  );
}