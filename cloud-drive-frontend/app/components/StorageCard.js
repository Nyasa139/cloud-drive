export default function StorageCard({ title, used }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>{used} / 100 GB</p>
      <div style={styles.bar}>
        <div style={{ ...styles.fill, width: used }} />
      </div>
    </div>
  );
}

const styles = {
  card: {
    flex: 1,
    background: "#2563eb",
    color: "#fff",
    padding: 24,
    borderRadius: 20,
  },
  bar: {
    height: 6,
    background: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    marginTop: 10,
  },
  fill: {
    height: "100%",
    background: "#fff",
    borderRadius: 10,
  },
};
