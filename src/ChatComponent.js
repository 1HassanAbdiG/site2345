import React, { useState } from "react";
import { fetchChatGPTResponse } from "./chatService";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleSendMessage = async () => {
    const chatResponse = await fetchChatGPTResponse(message);
    setResponse(chatResponse);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Chat avec ChatGPT</h2>
      <textarea
        rows="3"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Écris ton message..."
      />
      <button onClick={handleSendMessage}>Envoyer</button>
      <p><strong>Réponse :</strong> {response}</p>
    </div>
  );
};

export default ChatComponent;
