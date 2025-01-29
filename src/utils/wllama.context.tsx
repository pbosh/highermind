import { Message } from './types';
import { SYSTEM_PROMPT } from '../config';

const formatChat = async (messages: Message[]): Promise<string> => {
  const formattedMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))
  ];

  const formatted = await wllamaInstance.formatChat(
    formattedMessages,
    true,
    `<s>{{prompt}}</s>\n{{history}}{{char}}`
  );

  return formatted;
}; 
