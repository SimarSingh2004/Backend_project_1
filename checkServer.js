import fetch from "node-fetch";

(async () => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/users/register");
    console.log("status", res.status);
    const text = await res.text();
    console.log("body", text);
  } catch (e) {
    console.error("error", e.message);
  }
})();
