import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Profile from "./Profile";
import { apiGeneral } from "../../utils/urls";
import { maxWidth } from "@mui/system";

const socket = io("https://hackothsava-server.onrender.com");

export default function ChatContainer({ pod, isOpen }) {
  const [chatInput, setChatInput] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    if (isOpen && pod?.id) {
      fetch(`${apiGeneral.chats}${pod.id}`)
        .then((response) => response.json())
        .then((data) => {
          setChatMessages(data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });

      socket.on("chatMessage", (msg) => {
        if (msg.podId === pod.id) {
          setChatMessages((prevMessages) => [...prevMessages, msg]);
        }
      });

      return () => {
        socket.off("chatMessage");
      };
    }
  }, [isOpen, pod?.id]);

  const handleSend = () => {
    if (chatInput.trim()) {
      const newMessage = {
        podId: pod.id,
        sender: 101,
        text: chatInput,
      };

      socket.emit("chatMessage", newMessage);

      setChatMessages((prevMessages) => [...prevMessages, newMessage]);

      fetch(`${apiGeneral.send}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ podId: pod.id, senderId: 101, text: chatInput }),
      })
        .then((response) => response.json())
        .then((data) => {
          setChatInput("");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (!isOpen || !pod || !pod.id) return null;

  const styles = {
    chatContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      overflowY: "auto",
      background: "white",
    },
    input: {
      width: "100%",
      padding: "6px 40px 6px 15px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      outline: "none",
      fontSize: ".75rem",
    },
    chatMessages: {
      display: "flex",
      flexDirection: "column",
      padding: "10px",
      flex: "1",
      overflowY: "auto",
    },
    chatMessage: {
      display: "flex",
      margin: "0 50px",
      marginBottom: "10px",
      maxWidth: "100%",
    },
    chatMessageSender: {
      justifyContent: "flex-end",
      alignItems: "flex-end",
      marginLeft: "auto",
      maxWidth: "50%",
    },
    chatMessageReceiver: {
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginRight: "auto",
      maxWidth: "50%",
    },
    chatBubble: {
      padding: "10px",
      borderRadius: "8px",
      color: "#fff",
      background: "#333",
      maxWidth: "100%",
    },
    chatBubbleSender: {
      background: "#2d3e54",
    },
    chatBubbleReceiver: {
      background: "rgba(53, 64, 77, 0.45)",
    },
    podDetailsContainer: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      justifyContent: "space-between",
      borderBottom: "1px solid #aaa",
      padding: "10px",
      margin: "20px 30px",
    },
    podImage: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      marginRight: "20px",
    },
    podInfo: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      flex: "1",
    },
    podName: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#2d3e54",
    },
    podDescription: {
      fontSize: "0.9rem",
      color: "#2d3e54",
    },
    inputWrapper: {
      display: "flex",
      alignItems: "center",
      padding: "30px",
      position: "relative",
    },
    sendButton: {
      marginLeft: "10px",
      backgroundColor: "#35404d",
      border: "none",
      borderRadius: "4px",
      color: "#ddd",
      padding: "6px 20px",
      cursor: "pointer",
    },
  };

  return (
    <div className="chat-container" style={styles.chatContainer}>
      <div
        className="pod-details-container"
        style={styles.podDetailsContainer}
        onClick={handleProfileClick}
      >
        <img
          src={pod.profilePhoto}
          alt={`${pod.name} Profile`}
          className="pod-image"
          style={styles.podImage}
        />
        <div className="pod-info" style={styles.podInfo}>
          <span className="pod-name" style={styles.podName}>
            {pod.name}
          </span>
          <span className="pod-description" style={styles.podDescription}>
            {pod.description}
          </span>
        </div>
      </div>
      <div className="chat-messages" style={styles.chatMessages}>
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.sender === 100 ? "sender" : "receiver"
            }`}
            style={{
              ...styles.chatMessage,
              ...(message.sender === 100
                ? styles.chatMessageSender
                : styles.chatMessageReceiver),
            }}
          >
            <div
              className="chat-bubble"
              style={{
                ...styles.chatBubble,
                ...(message.sender === 100
                  ? styles.chatBubbleSender
                  : styles.chatBubbleReceiver),
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="input-wrapper" style={styles.inputWrapper}>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.sendButton}>
          Send
        </button>
      </div>
      {isProfileOpen && <Profile />}
    </div>
  );
}
