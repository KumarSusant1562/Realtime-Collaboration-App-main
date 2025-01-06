import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const Id = uuid();
    setRoomId(Id);
    toast.success("Room ID generated successfully!");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both fields are required!");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
    toast.success("Successfully joined the room!");
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="home-container d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="form-card p-4 shadow-lg rounded bg-white text-center">
        <h1 className="mb-4 text-primary">JoinPoint</h1>
        <p className="mb-4 text-muted">
          Collaborate with your team in real-time. Enter a Room ID to get started.
        </p>

        <div className="mb-3">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="form-control p-3 mb-2"
            placeholder="Enter Room ID"
            onKeyUp={handleInputEnter}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control p-3"
            placeholder="Enter Your Username"
            onKeyUp={handleInputEnter}
          />
        </div>

        <button
          onClick={joinRoom}
          className="btn btn-primary btn-block p-3 w-100 mt-3"
        >
          Join Room
        </button>

        <div className="mt-4">
          <p className="text-muted">
            Don't have a Room ID?{" "}
            <span
              onClick={generateRoomId}
              className="text-primary font-weight-bold"
              style={{ cursor: "pointer" }}
            >
              Create a New Room
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
