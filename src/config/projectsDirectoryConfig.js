export const directoryConfig = {
  title: "Проекты",
  columns: [
    { key: "name", label: "Наименование" },
    { key: "description", label: "Описание" },
    { key: "isId", label: "Идентификатор ИС" },
    { key: "isCode", label: "Код ИС" },
  ],
  formFields: [
    { key: "name", label: "Наименование", type: "text" },
    { key: "description", label: "Описание", type: "textarea" },
    { key: "isId", label: "Идентификатор ИС" },
    { key: "isCode", label: "Код ИС" }
  ],
  API_CONFIG: {
    BASE_URL: 'http://localhost:8080/api',
    ENDPOINTS: {
      GET_DATA: '/projects',
      POST_DATA: '/projects',
      PUT_DATA: '/projects',
      DELETE_DATA: '/items'
    }
  }
};