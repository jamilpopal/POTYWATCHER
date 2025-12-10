import fetch from "node-fetch";

const URL = "https://time.com/person-of-the-year-2025/";
const DISCORD_WEBHOOK = "YOUR_DISCORD_WEBHOOK_URL"; // replace with your webhook
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
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });
    if (res.status !== 200) {
      console.log(`STATUS: ${res.status}`);
      return null;
    }
    const html = await res.text();
    return html;
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

async function checkPOTY() {
  console.log(`Checking page at ${new Date().toISOString()} ...`);
  const html = await fetchPage();
  if (!html) return;

  if (!lastHTML) {
    lastHTML = html;
    console.log("First fetch completed. Monitoring for changes...");
    return;
  }

  if (html !== lastHTML) {
    console.log("🔥 Page changed! Sending notification...");
    await notifyDiscord("The Time POTY 2025 page has changed! Check it: " + URL);
    lastHTML = html;
  } else {
    console.log("No changes detected.");
  }
}

// Run every minute
checkPOTY();
setInterval(checkPOTY, 60000);
