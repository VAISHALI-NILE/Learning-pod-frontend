import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Profile from "./Profile";
import { apiGeneral } from "../../utils/urls";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

// Establish socket connection
const socket = io("http://localhost:8000");

export default function ChatContainer({ pod, isOpen }) {
  const [chatInput, setChatInput] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentPod, setCurrentPod] = useState(null); // State to store pod data
  const userId = localStorage.getItem("user_id");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate(); // Use the navigate hook
  const navigate2 = useNavigate(); // Use the navigate hook

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSubmission = () => {
    navigate2("/submission");
  };

  const handleResource = () => {
    navigate("/resource", {
      state: {
        podId: pod?._id,
        podName: pod?.pod_name, // Include podName
      },
    }); // Use navigate instead of Navigate
  };

  // Fetch pod details
  const fetchPodDetails = () => {
    if (pod?._id) {
      fetch(`${apiGeneral.pods}${pod._id}`)
        .then((response) => response.json())
        .then((data) => {
          setCurrentPod(data);
        })
        .catch((error) => {
          console.error("Error fetching pod details:", error);
        });
    }
  };

  // Fetch messages from the server (polling)
  const fetchMessages = () => {
    if (isOpen && pod?._id) {
      fetch(`${apiGeneral.chats}${pod._id}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setChatMessages(data);
          } else {
            console.error("Expected an array of messages but got:", data);
            setChatMessages([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  };

  useEffect(() => {
    if (isOpen && pod?._id) {
      // Fetch initial messages
      fetchMessages();

      // Fetch pod details
      fetchPodDetails();

      // Socket.IO listener for real-time messages
      socket.on("chatMessage", (msg) => {
        if (msg.podId === pod._id) {
          setChatMessages((prevMessages) => [...prevMessages, msg]);
        }
      });

      // Polling mechanism as a fallback (every 10 seconds)
      const pollingInterval = setInterval(fetchMessages, 10000);

      // Cleanup on component unmount
      return () => {
        clearInterval(pollingInterval);
        socket.off("chatMessage"); // Remove Socket.IO listener
      };
    }
  }, [isOpen, pod?._id]);

  const handleSend = () => {
    if (chatInput.trim()) {
      const newMessage = {
        podId: pod._id,
        sender: userId,
        text: chatInput,
      };

      // Emit new message through socket
      socket.emit("chatMessage", newMessage);

      // Add message to the chat locally
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);

      // Send message to the server (for persistence)
      fetch(`${apiGeneral.send}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          podId: pod._id,
          senderId: userId,
          text: chatInput,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          setChatInput(""); // Clear input field after sending
        })
        .catch((error) => {});
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  if (!isOpen || !pod || !pod._id) return null;

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
        <Avatar
          src={pod.profilePhoto}
          alt="Pod Profile"
          style={styles.podImage}
        />
        <div className="pod-info" style={styles.podInfo}>
          <span className="pod-name" style={styles.podName}>
            {pod.pod_name}
          </span>
          <span className="pod-description" style={styles.podDescription}>
            {pod.pod_description}
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            style={{ backgroundColor: "#2d3e54", padding: "10px" }}
            onClick={handleResource}
          >
            <FolderOpenIcon />
          </button>
        </div>
      </div>
      <div className="chat-messages" style={styles.chatMessages}>
        {Array.isArray(chatMessages) ? (
          chatMessages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.sender === userId ? "sender" : "receiver"
              }`}
              style={{
                ...styles.chatMessage,
                ...(message.sender === userId
                  ? styles.chatMessageSender
                  : styles.chatMessageReceiver),
              }}
            >
              <div
                className="chat-bubble"
                style={{
                  ...styles.chatBubble,
                  ...(message.sender === userId
                    ? styles.chatBubbleSender
                    : styles.chatBubbleReceiver),
                }}
              >
                {message.text}
              </div>
            </div>
          ))
        ) : (
          <p>No messages found.</p>
        )}
        {/* Reference to ensure auto-scroll */}
        <div ref={messagesEndRef}></div>
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
      {isProfileOpen && (
        <Profile
          isOpen={isProfileOpen}
          onClose={handleProfileClick}
          photo={pod.profilePhoto}
          name={pod.pod_name}
          description={pod.pod_description}
          files={pod.files || 0}
          links={pod.links || 0}
        />
      )}
    </div>
  );
}
