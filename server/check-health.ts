async function checkLiveBackendHealth() {
  console.log("Checking live backend health...");
  try {
    const res = await fetch("https://messmind-app-cqb9gkagg7exgrcf.centralindia-01.azurewebsites.net/api/prediction/health", {
      method: "GET"
    });
    if (res.status === 404) {
      console.log("Health endpoint not found (404). This means the server HAS NOT deployed the latest code.");
      return;
    }
    const json = await res.json();
    console.log("Health Response:", json);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}
checkLiveBackendHealth();
