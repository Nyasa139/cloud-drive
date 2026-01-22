export function loadData() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("driveFiles") || "[]");
}

export function saveData(data) {
  localStorage.setItem("driveFiles", JSON.stringify(data));
}
