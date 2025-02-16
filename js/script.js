"use strict";
const apiUrl = 'http://localhost:8080/api/projects';

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        const projectList = document.getElementById('projects-list');
        console.log(projectList);
        data.forEach(item => {
            const projectDiv = document.createElement('div');
            projectDiv.classList.add("project");
            projectDiv.textContent = item.name;
            projectList.appendChild(projectDiv);
        });
    })
    .catch(error => {
        console.error('Ошибка при получении данных:', error);
    });
