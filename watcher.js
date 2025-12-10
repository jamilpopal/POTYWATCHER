import fetch from "node-fetch";

const URL = "https://time.com/person-of-the-year-2025/";
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1133114527173574797/f7W00mapDDbHmby1hNL6a4uB3qjfU1IDplCIV3p5Dd-PRJVSFZfgNMQM-ZGMmoE28Ev5";

let lastHTML = null;

async function notifyDiscord(message) {
  try {
    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });
    console.log("🔔 Discord notification sent!");
  } catch (err) {
    console.error("Error sending Discord notification:", err);
  }
}

async function fetchPage() {
  try {
    const res = await fetch(URL, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    const html = await res.text();
    return { status: res.status, html, length: html.length };
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

async function checkPOTY() {
  const timestamp = new Date().toISOString();
  const result = await fetchPage();
  if (!result) return;

  const { status, html, length } = result;
  console.log(`[${timestamp}] STATUS: ${status}, HTML length: ${length}`);

  // Send Discord message on every check
  await notifyDiscord(`Checked at ${timestamp} — STATUS: ${status}, HTML length: ${length}`);

  // Update lastHTML if needed
  lastHTML = html;
}

// First run
checkPOTY();

// Run every minute
setInterval(checkPOTY, 60000);
