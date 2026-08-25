import { useState, useEffect, useRef } from "react";
import { FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([
    { role: "system", content: "Bạn là trợ lý thân thiện." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const toggleVisibility = () => {
    setIsVisible(window.pageYOffset > 800);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigate = useNavigate();
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

      const res = await axios.post(`${BACKEND_URL}/api/chat`, {
        messages: newMessages,
      });

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: res.data.reply,
          products: res.data.products || [],
        },
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ArrowUpIcon = () => (
    <svg
      className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  );

  return (
    <>
      {isVisible && (
        <div className="fixed z-50 flex flex-col items-center gap-3 bottom-8 right-9">
          {/* Message (luôn nằm trên cùng) */}
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center justify-center w-12 h-12 text-white transition-transform bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 hover:scale-110"
          >
            💬
          </button>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 text-white transition-transform bg-red-600 rounded-full shadow-md hover:bg-red-700 hover:scale-110"
          >
            <FaYoutube />
          </a>

          {/* TikTok */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 text-white transition-transform bg-black rounded-full shadow-md hover:bg-gray-900 hover:scale-110"
          >
            <FaTiktok />
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 text-white transition-transform bg-blue-600 rounded-full shadow-md hover:bg-blue-700 hover:scale-110"
          >
            <FaFacebookF />
          </a>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center w-12 h-12 text-white transition-all duration-300 transform bg-black rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl hover:scale-105 group"
          >
            <ArrowUpIcon />
          </button>
        </div>
      )}

      {/* Chat box */}
      {chatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 90,
            width: 350,
            height: 450,
            border: "1px solid #ccc",
            borderRadius: 12,
            backgroundColor: "#f4f6f8",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            zIndex: 999999,
          }}
        >
          {/* ...header... */}
          <div
            style={{
              backgroundColor: "#0077ff",
              color: "white",
              padding: "10px 15px",
              fontWeight: "bold",
              fontSize: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Hỗ trợ trực tuyến
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>
          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {messages
              .filter((m) => m.role !== "system")
              .map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent:
                      m.role === "user" ? "flex-end" : "flex-start",
                    gap: 8,
                  }}
                >
                  {m.role === "assistant" && (
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        backgroundColor: "#0077ff",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                      }}
                    >
                      B
                    </div>
                  )}
                  <div
                    style={{
                      backgroundColor: m.role === "user" ? "#0077ff" : "white",
                      color: m.role === "user" ? "white" : "black",
                      padding: "8px 12px",
                      borderRadius: 12,
                      maxWidth: "70%",
                    }}
                  >
                    {m.content}
                    {/* Hiển thị sản phẩm nếu có */}
                    {m.products && m.products.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        {m.products.map((item) => (
                          <div
                            key={item._id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: 8,
                              background: "#f9f9f9",
                              borderRadius: 8,
                              padding: 8,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              navigate(`/product/${item._id}`, {
                                state: { item },
                              })
                            }
                          >
                            <img
                              src={item.images?.[0] || item.image}
                              alt={item.name}
                              style={{
                                width: 48,
                                height: 48,
                                objectFit: "cover",
                                borderRadius: 8,
                                marginRight: 12,
                                background: "#eee",
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: "bold" }}>
                                {item.name}
                              </div>
                              <div style={{ color: "#888" }}>
                                {(item.price * 25000).toLocaleString("vi-VN")}{" "}
                                VND
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {m.role === "user" && (
                    <div
                      style={{
                        width: 35,
                        height: 35,
                        borderRadius: "50%",
                        backgroundColor: "#555",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Bạn
                    </div>
                  )}
                </div>
              ))}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              padding: 10,
              borderTop: "1px solid #ccc",
              gap: 5,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Nhập tin nhắn..."
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 20,
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                backgroundColor: "#0077ff",
                color: "white",
                border: "none",
                borderRadius: 20,
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              {loading ? "..." : "Gửi"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
