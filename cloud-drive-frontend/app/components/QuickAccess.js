export default function QuickAccess({ setFilter }) {
  const items = [
    { label: "Images", type: "images" },
    { label: "Videos", type: "videos" },
    { label: "Docs", type: "docs" },
    { label: "Downloads", type: "all" },
  ];

  return (
    <div style={styles.row}>
      {items.map(item => (
        <button
          key={item.label}
          onClick={() => setFilter(item.type)}
          style={styles.item}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    gap: 16,
    marginTop: 20,
  },
  item: {
    padding: "12px 18px",
    borderRadius: 12,
    background: "#eef2ff",
    fontWeight: 500,
  },
};
