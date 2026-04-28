async function checkLiveBackend() {
  console.log("Checking live backend...");
  try {
    const res = await fetch("https://messmind-app-cqb9gkagg7exgrcf.centralindia-01.azurewebsites.net/api/prediction/ai-insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: "data" })
    });
    const json = await res.json();
    console.log("Response:", json);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}
checkLiveBackend();
