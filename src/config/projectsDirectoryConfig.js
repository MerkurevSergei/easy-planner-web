export const directoryConfig = {
  title: "Проекты",
  columns: [
    { key: "name", label: "Наименование" },
    { key: "description", label: "Описание" },
    { key: "status", label: "Статус" },
    { key: "systemId", label: "Идентификатор ИС" },
    { key: "systemCode", label: "Код ИС" },
  ],
  formFields: [
    { key: "name", label: "Наименование", type: "text" },
    { key: "description", label: "Описание", type: "textarea" },
    { key: "code", label: "Код", type: "text" },
    { key: "identifier", label: "Идентификатор", type: "text" },
  ],
};