import { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './DataTable.module.css';

const DataTable = memo(({ 
  columns, 
  data, 
  selectedRow, 
  onSelect, 
  loading 
}) => {
  const handleRowClick = useCallback((id) => {
    onSelect(id === selectedRow ? null : id);
  }, [onSelect, selectedRow]);

  const renderCell = useCallback((item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    return item[column.key];
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {columns.map((column) => (
              <th
                key={column.key}
                className={styles.headerCell}
                style={{ width: column.width || 'auto' }}
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
              className={`${styles.row} ${
                selectedRow === item.id ? styles.selected : ''
              }`}
              onClick={() => handleRowClick(item.id)}
            >
              {columns.map((column) => (
                <td
                  key={`${item.id}-${column.key}`}
                  className={styles.cell}
                  title={item[column.key]}
                >
                  {renderCell(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && !loading && (
        <div className={styles.noData}>Нет данных для отображения</div>
      )}
    </div>
  );
});

DataTable.displayName = 'DataTable';
DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedRow: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func,
  loading: PropTypes.bool,
};

DataTable.defaultProps = {
  onSelect: () => {},
  loading: false,
  selectedRow: null,
};

export default DataTable;