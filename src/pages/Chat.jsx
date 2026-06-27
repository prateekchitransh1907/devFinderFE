import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { createSocketConnection } from "../services/Socket";
import { useDispatch, useSelector } from "react-redux";
import { getChat } from "../actions/chats";

const Chat = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();

    const socketRef = useRef(null);
    const location = useLocation();
    const chatContainerRef = useRef(null);

    const selectedUser = location.state?.user || {};

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);

    const loggedInUser = useSelector((state) => state.auth.user);
    const chat = useSelector((state) => state.chat.chat);

    // Fetch previous chat history
    useEffect(() => {
        if (userId) {
            dispatch(getChat(userId));
        }
    }, [dispatch, userId]);

    // Populate messages from API
    useEffect(() => {
        if (!chat?.messages) return;

        setMessages(
            chat.messages.map((msg) => ({
                _id: msg._id,
                senderId: msg.senderId._id,
                firstName: msg.senderId.firstName,
                text: msg.text,
                createdAt: new Date(msg.createdAt).toLocaleTimeString(
                    "en-IN",
                    {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Kolkata",
                    }
                ),
            }))
        );
    }, [chat]);

    // Auto scroll to bottom
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    // Socket setup
    useEffect(() => {
        if (!userId || !loggedInUser?._id) return;

        const socket = createSocketConnection();
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("CONNECTED");
            console.log("socket id", socket.id);
        });

        socket.on("onlineUsers", (users) => {
            setOnlineUsers(users);
        });

        socket.on("connect_error", (err) => {
            console.log("CONNECT ERROR", err);
        });

        socket.on("error", (err) => {
            console.log("SOCKET ERROR", err);
        });

        socket.emit("joinChat", { userId });

        socket.on("messageReceived", (messageData) => {
            console.log("MESSAGE RECEIVED", messageData);
            setMessages((prev) => [
                ...prev,
                {
                    _id: Date.now(),
                    senderId: messageData.senderId,
                    firstName: messageData.firstName,
                    text: messageData.text,
                    createdAt: new Date(
                        messageData.createdAt
                    ).toLocaleTimeString("en-IN", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Kolkata",
                    }),
                },
            ]);
        });

        return () => {
            socket.off("messageReceived");
            socket.off("onlineUsers");
            socket.disconnect();
        };
    }, [userId, loggedInUser?._id]);

    const sendMessage = () => {
        if (!message.trim()) return;

        socketRef.current.emit("sendMessage", {
            userId,
            text: message,
        });

        setMessage("");
    };
    const isOnline = onlineUsers.includes(userId);
    return (
        <div className="h-[calc(100vh-64px)] bg-base-200">
            <div className="h-full flex flex-col max-w-5xl mx-auto">

                {/* CHAT HEADER */}
                <div className="bg-base-100 border-b border-base-300 px-6 py-4 flex items-center gap-4 shadow-sm">

                    <div className={`avatar ${isOnline ? "online" : "offline"}`}>
                        <div className="w-12 rounded-full">
                            <img
                                src={selectedUser.photoUrl}
                                alt={selectedUser.firstName}
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg">
                            {selectedUser.firstName} {selectedUser.lastName}
                        </h3>

                        {isOnline ? <p className="text-sm text-success">
                            Online
                        </p> : <p className="text-sm text-base-content/50">
                            Offline </p>}
                    </div>

                </div>

                {/* CHAT MESSAGES */}
                <div
                    className="flex-1 overflow-y-auto p-6 space-y-2"
                    ref={chatContainerRef}
                >
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center text-base-content/50">
                                <p className="text-lg">
                                    No messages yet 👋
                                </p>
                                <p className="text-sm">
                                    Start the conversation
                                </p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`chat ${msg.senderId === loggedInUser._id
                                    ? "chat-end"
                                    : "chat-start"
                                    }`}
                            >
                                <div className="chat-header">
                                    {msg.senderId === loggedInUser._id
                                        ? "You"
                                        : msg.firstName}

                                    <time className="text-xs opacity-50 ml-2">
                                        {msg.createdAt}
                                    </time>
                                </div>

                                <div
                                    className={`chat-bubble ${msg.senderId === loggedInUser._id
                                        ? "chat-bubble-primary"
                                        : ""
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* MESSAGE INPUT */}
                <div className="bg-base-100 border-t border-base-300 p-4">

                    <div className="flex gap-3">

                        <input
                            type="text"
                            className="input input-bordered flex-1"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        />

                        <button
                            className="btn btn-primary px-8"
                            onClick={sendMessage}
                            disabled={!message.trim()}
                        >
                            Send
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Chat;