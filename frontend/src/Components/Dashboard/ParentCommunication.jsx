import { useState } from 'react';
import { Send } from 'lucide-react';

const ParentCommunication = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'Teacher', text: 'Please check the homework for Math.' },
    { sender: 'Parent', text: 'Sure! I’ll review it today.' },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { sender: 'Parent', text: message }]);
      setMessage('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Teacher Communication</h2>
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded-lg ${
              msg.sender === 'Parent' ? 'bg-indigo-100 ml-auto w-3/4' : 'bg-gray-200 w-3/4'
            }`}
          >
            <p className="font-semibold">{msg.sender}:</p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ParentCommunication;
