// src/components/header/header.js

"use client"; // Marking this component as a client component

import { useState } from 'react';
import styles from './header.module.css';
import menu from '@/config/menuConfig';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState('Выберите проект');

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleProjectSelect = (project) => {
    setCurrentProject(project);
    setIsDropdownOpen(false);
  };

  const projects = ['Проект 1', 'Проект 2', 'Проект 3']; // Пример проектов

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <ul className={styles.leftMenu}>
          {menu.baseItems.map((item, index) => (
            <li key={index}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
          <li> | </li>
          {menu.referenceItems.map((item, index) => (
            <li key={index}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
        <div className={styles.rightMenu}>
          {/* Выпадающий список для выбора проекта */}
          <div className={styles.dropdown}>
            <button onClick={toggleDropdown} className={styles.dropdownToggle}>
              {currentProject} ▼
            </button>
            {isDropdownOpen && (
              <ul className={styles.dropdownMenu}>
                {projects.map((project, index) => (
                  <li key={index} onClick={() => handleProjectSelect(project)}>
                    {project}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Иконки конфигурации и текущего пользователя */}
          <span className={styles.icon}>
            <a href="#" title="Настройки">⚙️</a> {/* Символ для настроек */}
          </span>
          <span className={styles.icon}>
            <a href="#" title="Пользователь">👤</a> {/* Символ для пользователя */}
          </span>
        </div>
      </nav>
    </header>
  );
}
