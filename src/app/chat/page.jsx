"use client";

import { useState } from "react";
import { askGemini } from "./actions";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); //This will store history in form of array

  const handleSubmit = async () => {
    setLoading(true);

    // send new question + old chat to server
    const answer = await askGemini(input, history); //Curr Input + History Array

    setResponse(answer);

    // save conversation in browser memory
    setHistory(prev =>
      prev.concat({ question: input, answer: answer })
    );

    setLoading(false);
  };

  return (
    <div style={{ padding: "50px" }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask AI..."
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>

      <p>{response}</p>

      <ul>
        {history.map((item, i) => (
          <li key={i}>
            <b>You:</b> {item.question}<br />
            <b>AI:</b> {item.answer}
          </li>
        ))}
      </ul>
    </div>
  );
}