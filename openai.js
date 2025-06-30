async function getImprovedText(originalText) {
  const apiKey = "sk-proj-xxxxxxxxxxxx";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Rewrite this email in 2 structured formats, professionally:\n\n${originalText}`
      }]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
