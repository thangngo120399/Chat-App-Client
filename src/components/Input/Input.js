import React, { useState, useEffect } from "react";
import "./Input.css";
import Picker from "emoji-picker-react";
import smile from "../../icons/smile.png";
import close from "../../icons/close.png";

const Input = ({ message, setMessage, sendMessage, msgToxic }) => {
  const [chosenEmoji, setChosenEmoji] = useState();
  const [showEmoji, setShowEmoji] = useState(false);
  const handleShowEmoji = (event) => {
    event.preventDefault();
    setShowEmoji(!showEmoji);
  };
  useEffect(() => {
    if (chosenEmoji) {
      setMessage(message + chosenEmoji.emoji);
      setShowEmoji(false);
    }
  }, [chosenEmoji]);

  return (
    <form className="form">
      <button onClick={(e) => handleShowEmoji(e)} className="emojibutton">
        {showEmoji ? (
          <div title="Close Emoji">
            {" "}
            <img src={close} alt="close" />
          </div>
        ) : (
          <div title="Open Emoji">
            <img src={smile} alt="open" />
          </div>
        )}
      </button>
      {showEmoji && (
        <div style={{ position: "absolute", marginTop: "2rem" }}>
          <Picker
            onEmojiClick={(event, emojiObject) => setChosenEmoji(emojiObject)}
          />
        </div>
      )}
      <input
        className="input"
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyPress={(event) =>
          event.key === "Enter" ? sendMessage(event) : null
        }
        style={{ color: msgToxic ? "red" : "black" }}
      ></input>
      <button className="sendButton" onClick={(event) => sendMessage(event)}>
        Send
      </button>
    </form>
  );
};
export default Input;
