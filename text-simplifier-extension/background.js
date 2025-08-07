chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "simplifyText",
    title: "Simplify this text",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "summarizeText",
    title: "Summarize this text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "simplifyText" || info.menuItemId === "summarizeText") {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => window.getSelection().toString()
      },
      async (results) => {
        const selectedText = results?.[0]?.result?.trim();
        if (!selectedText) {
          console.warn("No text selected.");
          return;
        }

        let processedText;
        if (info.menuItemId === "simplifyText") {
          const rawSimplifiedText = await simplifyWithDeepSeek(selectedText);
          processedText = rawSimplifiedText
            .replace(/[*_`#>\-\[\]()]/g, '')
            .replace(/\n{2,}/g, '\n')
            .trim();
        } else {
          processedText = await summarizeWithDeepSeek(selectedText);
        }

        chrome.storage.local.set({ processedText });

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (processed, original, action) => {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;
            const range = selection.getRangeAt(0);
            range.deleteContents();

            // Container
            const container = document.createElement('div');
            container.style.display = 'inline-block';
            container.style.textAlign = 'left';

            // Buttons container
            const btnGroup = document.createElement('div');
            btnGroup.style.display = 'flex';
            btnGroup.style.gap = '8px';
            btnGroup.style.marginBottom = '6px';

            // Toggle button
            const btnToggle = document.createElement('button');
            btnToggle.textContent = action === "simplifyText" ? 'Show Original' : 'Show Full Text';
            Object.assign(btnToggle.style, {
              padding: '4px 10px',
              background: '#00796b',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            });

            // Remove button
            const btnRemove = document.createElement('button');
            btnRemove.textContent = 'Remove';
            Object.assign(btnRemove.style, {
              padding: '4px 10px',
              background: '#d32f2f',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            });

            // Text box
            const box = document.createElement('div');
            box.textContent = processed;
            Object.assign(box.style, {
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '14px 18px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              maxWidth: '400px',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            });

            let showingProcessed = true;
            btnToggle.onclick = () => {
              showingProcessed = !showingProcessed;
              box.textContent = showingProcessed ? processed : original;
              btnToggle.textContent = showingProcessed
                ? (action === "simplifyText" ? 'Show Original' : 'Show Full Text')
                : (action === "simplifyText" ? 'Show Simplified' : 'Show Summary');
            };

            btnRemove.onclick = () => {
              container.replaceWith(document.createTextNode(original));
            };

            btnGroup.appendChild(btnToggle);
            btnGroup.appendChild(btnRemove);
            container.appendChild(btnGroup);
            container.appendChild(box);
            range.insertNode(container);
          },
          args: [processedText, selectedText, info.menuItemId]
        });
      }
    );
  }
});

async function simplifyWithDeepSeek(text) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-extension-url",
        "X-Title": "SmartLearn Simplifier"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "system",
            content: "You simplify English text for clarity. Use everyday language."
          },
          {
            role: "user",
            content: `Simplify the following text. Don't use bullets or special formatting. Use simple sentences and plain language:\n\n"${text}"`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "Simplification failed.";
  } catch (e) {
    console.error("API Error:", e);
    return "API Error.";
  }
}

async function summarizeWithDeepSeek(text) {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-extension-url",
        "X-Title": "SmartLearn Summarizer"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "system",
            content: "You summarize English text for clarity. Use everyday language."
          },
          {
            role: "user",
            content: `Summarize the following text in a few sentences. Use plain language:\n\n"${text}"`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "Summarization failed.";
  } catch (e) {
    console.error("API Error:", e);
    return "API Error.";
  }
}
