import { useState } from "react";
import { Copy } from "lucide-react";

function MessageCopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(text.replace(/\*/g, "")) 
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      });
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 flex items-center text-xs mt-4 text-white px-2 py-1 rounded hover:bg-gray-700"
      aria-label="Copy message"
    >
      <Copy className="w-4 h-4 " />
      {copied && <span className="text-white-400">Copied!</span>}
    </button>
  );
}

export default MessageCopyButton;
