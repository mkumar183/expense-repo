
export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export type ChatContextType = {
  messages: ChatMessage[];
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  isLoading: boolean;
};
