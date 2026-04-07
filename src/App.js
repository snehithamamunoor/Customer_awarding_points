import { useState, useEffect } from "react";

// Reward Calculation Logic
const calculatePoints = (amount) => {
  let points = 0;
  if (amount > 100) {
    points += (amount - 100) * 2; // 2 points per $1 over 100
    points += 50;                 // 1 point for $50–$100
  } else if (amount > 50) {
    points += (amount - 50);      // 1 point per $1 between 50–100
  }
  return Math.floor(points);
};

// Simulated Async API
const fetchTransactions = () => {
  const mockData = [
    { id: 1, name: 'Pavan', amount: 120, date: '2024-01-15' },
    { id: 2, name: 'Pavan', amount: 75,  date: '2024-01-20' },
    { id: 3, name: 'Pavan', amount: 200, date: '2024-02-10' },
    { id: 4, name: 'Jyothi',  amount: 150, date: '2024-01-05' },
    { id: 5, name: 'Jyothi',  amount: 40,  date: '2024-02-12' },
    { id: 6, name: 'Jyothi',  amount: 110, date: '2024-03-22' },
    { id: 7, name: 'Sravan',amount: 95,  date: '2024-02-10' },
    { id: 8, name: 'Sravan',amount: 105, date: '2024-03-15' },
  ];

  return new Promise((resolve) => setTimeout(() => resolve(mockData), 1200));
};

// App Component
const App = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions().then((transactions) => {
      const grouped = transactions.reduce((acc, { name, amount, date }) => {
        const month = new Date(date).toLocaleString('default', { month: 'short' });
        const points = calculatePoints(amount);

        if (!acc[name]) acc[name] = { months: {}, total: 0 };
        if (!acc[name].months[month]) acc[name].months[month] = 0;

        acc[name].months[month] += points;
        acc[name].total += points;

        return acc;
      }, {});
      setData(grouped);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={styles.loader}>Fetching rewards data...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Customer Rewards Dashboard</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Customer</th>
            <th style={styles.th}>Monthly Points</th>
            <th style={styles.th}>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([name, info]) => (
            <tr key={name} style={styles.row}>
              <td style={styles.td}><strong>{name}</strong></td>
              <td style={styles.td}>
                {Object.entries(info.months)
                  .sort(([a], [b]) => new Date(`2024-${a}-01`) - new Date(`2024-${b}-01`)) // sorting months
                  .map(([month, pts]) => (
                    <span key={month} style={styles.badge}>
                      {month}: {pts} pts
                    </span>
                  ))
                }
              </td>
              <td style={styles.td}>
                <span style={styles.totalBadge}>{info.total} pts</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Segoe UI, sans-serif',
    maxWidth: '900px',
    margin: 'auto'
  },
  title: {
    color: '#333',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
    marginBottom: '20px'
  },
  loader: {
    textAlign: 'center',
    marginTop: '100px',
    fontSize: '1.2rem',
    color: '#666'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
  },
  th: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px',
    textAlign: 'left'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
    verticalAlign: 'top'
  },
  row: {
    transition: 'background 0.2s',
    cursor: 'default'
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#17a2b8',
    color: 'white',
    padding: '3px 8px',
    borderRadius: '12px',
    marginRight: '5px',
    marginBottom: '3px',
    fontSize: '0.9rem'
  },
  totalBadge: {
    display: 'inline-block',
    backgroundColor: '#28a745',
    color: 'white',
    padding: '5px 12px',
    borderRadius: '4px',
    fontWeight: 'bold'
  }
};

export default App;
