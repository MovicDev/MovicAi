import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Mic, ArrowUp, Clock, Trash2, MessageCircle, History, User, Menu, X, Volume2 } from "lucide-react";

export default function MovicAi() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([] );
  const [history, setHistory] = useState([]);
  
  // Function to start a new chat
  const startNewChat = () => {
    if (messages.length > 0) {
      // Add current conversation to history before clearing
      const lastMessage = messages[0];
      if (lastMessage) {
        setHistory(prev => [{
          id: Date.now(),
          title: lastMessage.text.slice(0, 30) + (lastMessage.text.length > 30 ? '...' : '')
        }, ...prev]);
      }
      setMessages([]);
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(true); 
  const listRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) {
      return;
    }
    
    // If this is the first message in a new conversation, add to history
    if (messages.length === 0) {
      setHistory(prev => [{
        id: Date.now(),
        title: input.trim().slice(0, 30) + (input.trim().length > 30 ? '...' : '')
      }, ...prev]);
    }

    setError("");
    setIsLoading(true);
    const userMsg = { id: Date.now(), role: "user", text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const result = await axios.post("https://movicai.onrender.com /api/movicai", {
        prompt: userMsg.text,
      });
      const bot = {
        id: Date.now() + 1,
        role: "assistant",
        text: result.data.response,
      };
      setMessages(prev => [...prev, bot]);
      setHistory(h => [{ id: `h${Date.now()}`, title: userMsg.text.slice(0, 24) }, ...h]);
      listRef.current.scrollTop = listRef.current.scrollHeight;
    } catch (err) {
      console.error("Error generating response:", err);
      setError(err.response?.data?.error || "Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  // For Speak functionality
  const handleSpeak = () => {
    const msg = new SpeechSynthesisUtterance();
    const voices = window.speechSynthesis.getVoices();
    console.log(voices); 

    msg.voice = voices[1];
    msg.volume = 0.6; 
    msg.rate = 0.5;   
    msg.text = input;
    msg.lang = "en-US";

    window.speechSynthesis.speak(msg);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e5ec] via-[#d1d9e6] to-[#e0e5ec] p-2 sm:p-6 text-slate-800 flex flex-col">
      <div className="relative flex-1 max-w-6xl mx-auto rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-12">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex sm:hidden">
            <div className="bg-black/20 flex-1" onClick={() => setSidebarOpen(false)}></div>
            <aside className="w-64 bg-[#e0e5ec] p-4 flex flex-col gap-4 z-50 shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <History className="w-5 h-5 text-teal-600" />
                  History
                </h3>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg bg-[#e0e5ec] shadow-neumorph-inset hover:shadow-neumorph-outset transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto space-y-2">
                {history.length === 0 ? (
                  <div className="text-xs text-slate-600 p-3 rounded-lg bg-[#e0e5ec] shadow-neumorph-inset">No history yet.</div>
                ) : (
                  history.map(item => (
                    <button 
                      key={item.id} 
                      className="w-full text-left p-3 rounded-lg bg-[#e0e5ec] shadow-neumorph-outset hover:shadow-neumorph-inset transition-all flex items-center gap-3"
                      onClick={() => alert(`Load conversation: ${item.title}`)}
                    >
                      <User className="w-5 h-5 text-teal-600" />
                      <div>
                        <div className="text-sm font-medium truncate">{item.title}</div>
                        <div className="text-xs text-slate-600">{new Date().toLocaleDateString()}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <button 
                onClick={() => setHistory([])} 
                className="mt-4 text-xs p-2 rounded-lg bg-[#e0e5ec] shadow-neumorph-outset hover:shadow-neumorph-inset transition-all flex items-center gap-2 justify-center"
              >
                <Trash2 className="w-4 h-4" />
                Clear history
              </button>
            </aside>
          </div>
        )}

        {/* Sidebar for desktop - Conditionally rendered */}
        {historyVisible && (
          <aside className="hidden sm:flex sm:col-span-3 bg-[#e0e5ec] p-4 flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-semibold">History</h3>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 rounded-lg bg-[#e0e5ec] shadow-neumorph-outset hover:shadow-neumorph-inset transition-all"
                  onClick={() => setHistoryVisible(false)}
                  aria-label="Close history"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  className="p-2 rounded-lg bg-[#e0e5ec] shadow-neumorph-outset hover:shadow-neumorph-inset transition-all"
                  onClick={() => setHistory([])}
                  aria-label="Clear history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto space-y-2">
              {history.length === 0 ? (
                <div className="text-xs text-slate-600 p-3 rounded-lg bg-[#e0e5ec] shadow-neumorph-inset">
                  No history yet — start a conversation.
                </div>
              ) : (
                history.map(item => (
                  <button
                    key={item.id}
                    className="w-full p-3  rounded-lg bg-[#e0e5ec] shadow-neumorph-outset hover:shadow-neumorph-inset transition-all flex items-center gap-3 "
                    onClick={() => alert(`Load conversation: ${item.title}`)}
                  >
                    <User className="w-5 h-5 text-teal-600" />
                    <div>
                      <div className="text-sm font-medium truncate">{item.title}</div>
                      <div className="text-xs text-slate-600">{new Date().toLocaleDateString()}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="pt-2">
              <button 
                onClick={startNewChat}
                className="w-full bg-[#001f3f] text-white py-2 rounded-lg font-semibold shadow-neumorph-outset hover:shadow-neumorph-inset transition-all"
              >
                + New Chat
              </button>
            </div>
          </aside>
        )}

        {/* Main Chat */}
        <main className={`col-span-1 ${historyVisible ? 'sm:col-span-9' : 'sm:col-span-12'} p-4 sm:p-6 flex flex-col bg-[#e0e5ec]`}>
          <header className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button 
                className="sm:hidden p-2 rounded-lg bg-[#e0e5ec] shadow-neumorph-outset hover:shadow-neumorph-inset transition-all"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              {/* Show history toggle button on desktop when history is hidden */}
              {!historyVisible && (
                <button 
                  className="hidden sm:flex p-2 rounded-lg bg-[#e0e5ec] shadow-neumorph-outset hover:shadow-neumorph-inset transition-all"
                  onClick={() => setHistoryVisible(true)}
                  aria-label="Show history"
                >
                  <History className="w-5 h-5" />
                </button>
              )}
              <div className="w-10 h-10 rounded-lg bg-[#001f3f] flex items-center justify-center text-white font-bold shadow-neumorph-outset">
                AI
              </div>
              <div>
                <h2 className="text-lg font-semibold">Movic AI Chat</h2>
                <p className="text-xs text-slate-600">Fast. Helpful. Delightful.</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-slate-600">
              <Clock className="w-4 h-4" />
              <button className="text-xs p-2 rounded-lg bg-[#e0e5ec] shadow-neumorph-outset hover:shadow-neumorph-inset transition-all">
                Settings
              </button>
            </div>
          </header>

          <div className="flex-1 rounded-xl bg-[#e0e5ec] shadow-neumorph-inset p-4 ">
            <div ref={listRef} className="flex flex-col-reverse gap-3 overflow-y-auto md:h-96 h-screen p-4">
              {messages.length === 0 ? (
                <div className="text-center text-slate-600 mt-8 p-4 rounded-lg bg-[#e0e5ec] shadow-neumorph-inset">
                  No messages — say hi 👋
                </div>
              ) : (
                [...messages].reverse().map(msg => (
                  <div 
                    key={msg.id} 
                    className={`p-4 rounded-lg max-w-[90%] shadow-neumorph-outset ${
                      msg.role === 'assistant' 
                        ? 'bg-[#001f3f] text-white self-start' 
                        : 'bg-[#001f3f] text-white self-end'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-line break-words min-w-[200px]">
                      {msg.role === 'assistant' ? msg.text.replace(/^\*\*A Little More Romantic:\*\*|\*\*A Little More Romantic:\*\*$/g, '') : msg.text}
                    </div>
                    <div className="text-xs text-slate-600 mt-2">
                      {msg.role === 'assistant' ? 'Assistant' : 'You'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="bg-[#e0e5ec] rounded-2xl p-3 shadow-neumorph-outset flex items-center gap-3">
              <button
                className="p-3 rounded-lg bg-[#e0e5ec] shadow-neumorph-outset hover:shadow-neumorph-inset transition-all"
                onClick={handleSpeak}
                aria-label="Toggle recording"
              >
                <Mic className="w-5 h-5" />
              </button>

              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Type your message... "
                disabled={isLoading}
                className="flex-1 resize-none bg-transparent outline-none text-slate-800 placeholder:text-slate-500 max-h-36 text-sm sm:text-base"
              />

              <button
                title="Attach"
                className="p-3 rounded-lg bg-[#e0e5ec] shadow-neumorph-outset hover:shadow-neumorph-inset transition-all"
                onClick={() => alert('Attach file — implement as needed')}
              >
                <MessageCircle className="w-5 h-5" />
              </button>

              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="p-3 rounded-full bg-[#001f3f] shadow-neumorph-outset hover:shadow-neumorph-inset transition-all"
                aria-label="Send"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowUp className="w-5 h-5 text-white transform rotate-45" />
                )}
              </button>
            </div>
            {error && <div className="mt-2 text-red-500 text-sm p-2 rounded-lg bg-[#e0e5ec] shadow-neumorph-inset">{error}</div>}
          </div>
        </main>
      </div>

      {/* Add Neumorphism CSS styles */}
      <style jsx>{`
        .shadow-neumorph-outset {
          box-shadow: 8px 8px 16px #b8b9be, -8px -8px 16px #ffffff;
        }
        
        .shadow-neumorph-inset {
          box-shadow: inset 8px 8px 16px #b8b9be, inset -8px -8px 16px #ffffff;
        }
        
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}
