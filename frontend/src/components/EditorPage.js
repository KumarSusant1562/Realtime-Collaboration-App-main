import React, { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "../Socket";
import { ACTIONS } from "../Actions";
import { useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const LANGUAGES = [
  "python3", "java", "cpp", "nodejs", "c", "ruby", "go", "scala", "bash", 
  "sql", "pascal", "csharp", "php", "swift", "rust", "r",
];

function EditorPage() {
  const [clients, setClients] = useState([]);
  const [output, setOutput] = useState("");
  const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python3");
  const codeRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", handleErrors);
      socketRef.current.on("connect_failed", handleErrors);

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
      });
    };

    const handleErrors = (err) => {
      console.log("Error", err);
      toast.error("Socket connection failed. Please try again.");
      navigate("/");
    };

    init();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy Room ID");
    }
  };

  const leaveRoom = () => navigate("/");

  const runCode = async () => {
    setIsCompiling(true);
    try {
      const response = await axios.post("http://localhost:5000/compile", {
        code: codeRef.current,
        language: selectedLanguage,
      });
      setOutput(response.data.output || JSON.stringify(response.data));
    } catch (error) {
      setOutput(error.response?.data?.error || "An error occurred");
    } finally {
      setIsCompiling(false);
    }
  };

  const toggleCompileWindow = () => setIsCompileWindowOpen(!isCompileWindowOpen);

  return (
    <div className="editor-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <img src="/images/codecast.png" alt="CodeCast Logo" />
        </div>
        <div className="clients-list">
          <h4>Members</h4>
          {clients.map((client) => (
            <Client key={client.socketId} username={client.username} />
          ))}
        </div>
        <div className="sidebar-actions">
          <button onClick={copyRoomId}>Copy Room ID</button>
          <button onClick={leaveRoom} className="leave-room">
            Leave Room
          </button>
        </div>
      </div>

      {/* Main Editor Panel */}
      <div className="main-editor">
        <div className="editor-header">
          <select
            className="language-selector"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => (codeRef.current = code)}
        />
      </div>

      {/* Compiler Section */}
      <div className={`compiler ${isCompileWindowOpen ? "open" : ""}`}>
        <div className="compiler-header">
          <h5>Compiler Output ({selectedLanguage})</h5>
          <div className="compiler-actions">
            <button onClick={runCode} disabled={isCompiling}>
              {isCompiling ? "Compiling..." : "Run Code"}
            </button>
            <button onClick={toggleCompileWindow}>Close</button>
          </div>
        </div>
        <pre>{output || "Output will appear here after compilation"}</pre>
      </div>
    </div>
  );
}

export default EditorPage;
