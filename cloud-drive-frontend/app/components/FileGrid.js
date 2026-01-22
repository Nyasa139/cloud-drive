import { supabase } from "../lib/supabase";

export default function FileGrid({ files }) {
  return (
    <div style={styles.grid}>
      {files.map(file => {
        const url =
          supabase.storage.from("files").getPublicUrl(file.name).data.publicUrl;

        return (
          <div key={file.name} style={styles.card}>
            <img
              src={url}
              style={{ width: "100%", height: 120, objectFit: "cover" }}
            />
            <p>{file.name}</p>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 20,
    marginTop: 30,
  },
  card: {
    background: "#fff",
    padding: 12,
    borderRadius: 12,
  },
};
