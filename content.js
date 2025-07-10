// Create floating draggable button
const bubble = document.createElement("div");
bubble.id = "ai-drag-button";
bubble.innerHTML = `<img src="chrome-extension://${chrome.runtime.id}/icon.png" width="40" height="40" />`;
document.body.appendChild(bubble);

// Create hidden popup panel
const popup = document.createElement("div");
popup.id = "ai-popup";
popup.innerHTML = `
  <textarea id="ai-original" placeholder="Detected email will appear here..."></textarea>
  <button id="ai-generate">✨ Improve with AI</button>
  <div id="ai-suggestions"></div>
`;
document.body.appendChild(popup);

// Dragging logic
let offsetX, offsetY, isDragging = false;
bubble.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - bubble.getBoundingClientRect().left;
  offsetY = e.clientY - bubble.getBoundingClientRect().top;
});
document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    bubble.style.left = `${e.clientX - offsetX}px`;
    bubble.style.top = `${e.clientY - offsetY}px`;
  }
});
document.addEventListener("mouseup", () => isDragging = false);

// Toggle popup
bubble.addEventListener("click", () => {
  popup.style.display = popup.style.display === "none" ? "block" : "none";
});

// Detect open email content
function detectEmailContent() {
  let emailBox = document.querySelector('[role="textbox"], div[contenteditable="true"]');
  if (emailBox) {
    return emailBox.innerText || emailBox.textContent;
  }
  return "";
}

// GPT Request
async function fetchFormatted(text) {
  const apiKey = "your-openai-api-key"; // Replace with your real key

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Rewrite this email in 2 structured professional formats:\n\n${text}`
        }
      ]
    })
  });

  const data = await res.json();
  console.log("OpenAI response:", data);

  if (!data.choices || !data.choices[0]) {
    throw new Error("Invalid response from OpenAI API");
  }

  return data.choices[0].message.content;
}

// Button click → send to AI
popup.querySelector("#ai-generate").addEventListener("click", async () => {
  const original = detectEmailContent();
  popup.querySelector("#ai-original").value = original;
  popup.querySelector("#ai-suggestions").innerText = "⏳ Waiting for AI...";

  try {
    const response = await fetchFormatted(original);
    popup.querySelector("#ai-suggestions").innerText = response;
  } catch (error) {
    console.error("AI fetch failed:", error);
    popup.querySelector("#ai-suggestions").innerText = "⚠️ Error: Could not get suggestions. Check API key or console.";
  }
});

// Initial hidden popup
popup.style.display = "none";
