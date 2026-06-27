import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  attachment?: File;
}

export function ChatPanel({ aircraftName }: { aircraftName: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'm-1', sender: 'ai', text: `I've analysed ${aircraftName}. Ask me anything about its components, risk areas, or maintenance recommendations.` }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedFile) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
      attachment: selectedFile || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedFile(null);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: userMessage.attachment 
          ? `I've reviewed ${userMessage.attachment.name} — let me know if you'd like me to flag anything specific from it.`
          : 'Based on the current component degradation rates, I recommend prioritizing the critical alerts before next week. Would you like a detailed breakdown?'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files.item(0) || null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#faf9f5] dark:bg-[#0C0C0E] border-l border-[#e6dfd8] dark:border-[#2a2a2b]">
      <div className="p-4 border-b border-[#e6dfd8] dark:border-[#2a2a2b] shrink-0">
        <h3 className="text-sm font-semibold text-[#141413] dark:text-[#faf9f5]">Maintenance Assistant</h3>
        <p className="text-[10px] text-[#6c6a64] dark:text-[#a09d96]">AI-powered diagnostics</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end ml-auto' : 'self-start items-start'}`}>
            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-[#cc785c] text-white rounded-br-sm' 
                : 'bg-[#efe9de]/50 dark:bg-[#161618] text-[#141413] dark:text-[#faf9f5] border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-bl-sm'
            }`}>
              {msg.attachment && (
                <div className="flex items-center gap-2 mb-2 p-1.5 bg-black/10 rounded-lg text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  {msg.attachment.name}
                </div>
              )}
              {msg.text}
            </div>
            <span className="text-[9px] font-medium text-[#6c6a64]/60 dark:text-[#a09d96]/60 mt-1 px-1">
              {msg.sender === 'user' ? 'You' : 'Airix AI'}
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start self-start max-w-[85%]">
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-[#efe9de]/50 dark:bg-[#161618] border border-[#e6dfd8] dark:border-[#2a2a2b]">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-[#6c6a64] dark:bg-[#a09d96] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-[#6c6a64] dark:bg-[#a09d96] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-[#6c6a64] dark:bg-[#a09d96] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[#e6dfd8] dark:border-[#2a2a2b] shrink-0 bg-[#faf9f5] dark:bg-[#0C0C0E]">
        {selectedFile && (
          <div className="mb-2 flex items-center justify-between bg-[#efe9de]/50 dark:bg-[#161618] px-3 py-1.5 rounded-lg border border-[#e6dfd8] dark:border-[#2a2a2b]">
            <span className="text-xs text-[#141413] dark:text-[#faf9f5] truncate font-medium">Attached: {selectedFile.name}</span>
            <button onClick={() => setSelectedFile(null)} className="text-[#6c6a64] dark:text-[#a09d96] hover:text-rose-500">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.csv,.doc,.docx" 
            onChange={handleFileChange}
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-[#6c6a64] dark:text-[#a09d96] hover:text-[#141413] dark:hover:text-[#faf9f5] transition-colors rounded-lg bg-[#efe9de]/30 dark:bg-[#161618]/30 border border-[#e6dfd8] dark:border-[#2a2a2b]"
            title="Attach File"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border border-[#e6dfd8] dark:border-[#2a2a2b] rounded-lg px-3 py-2 text-sm text-[#141413] dark:text-[#faf9f5] outline-none focus:border-[#cc785c]"
          />
          <button 
            type="submit"
            disabled={!inputText.trim() && !selectedFile}
            className="p-2 bg-[#cc785c] text-white rounded-lg hover:bg-[#a85b42] disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
