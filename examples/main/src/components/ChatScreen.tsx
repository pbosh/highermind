import { useState } from 'react';
import { useMessages } from '../utils/messages.context';
import { useWllama } from '../utils/wllama.context';
import { Message, Screen } from '../utils/types';
import { DebugLogger } from '../utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStop } from '@fortawesome/free-solid-svg-icons';
import { nl2br } from '../utils/nl2br';
import ScreenWrapper from './ScreenWrapper';
import { useIntervalWhen } from '../utils/use-interval-when';
import { LIST_MODELS } from '../config';

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const {
    currentConvId,
    isGenerating,
    createCompletion,
    formatChat,
    navigateTo,
    loadedModel,
    stopCompletion,
  } = useWllama();
  const {
    getConversationById,
    addMessageToConversation,
    editMessageInConversation,
    newConversation,
  } = useMessages();

  useIntervalWhen(chatScrollToBottom, 500, isGenerating, true);

  const currConv = getConversationById(currentConvId);

  const onSubmit = async () => {
    if (isGenerating) return;

    // copy input and create messages
    const userInput = input;
    setInput('');
    const userMsg: Message = {
      id: Date.now(),
      content: userInput,
      role: 'user',
    };
    const assistantMsg: Message = {
      id: Date.now() + 1,
      content: '',
      role: 'assistant',
    };

    // process conversation
    let convId = currConv?.id;
    let messages: Message[] = [];
    
    if (!convId) {
      // need to create new conversation with system message
      const modelConfig = LIST_MODELS.find(m => m.url === loadedModel?.url);
      const systemMsg: Message = {
        id: Date.now() - 1,
        content: modelConfig?.systemPrompt || "The following is a conversation with an AI assistant.",
        role: 'system',
      };
      messages = [systemMsg];
      const newConv = newConversation(systemMsg);
      convId = newConv.id;
      navigateTo(Screen.CHAT, convId);
    } else {
      // Get existing messages before adding new ones
      messages = [...(getConversationById(convId)?.messages ?? [])];
    }

    // Add new messages to both local array and storage
    messages.push(userMsg);
    messages.push(assistantMsg);
    addMessageToConversation(convId, userMsg);
    addMessageToConversation(convId, assistantMsg);

    // generate response
    if (!loadedModel) {
      throw new Error('loadedModel is null');
    }

    DebugLogger.debug('=== MODEL STATE ===');
    DebugLogger.debug('Model loaded:', !!loadedModel);
    DebugLogger.debug('Is generating:', isGenerating);
    DebugLogger.debug('=== END MODEL STATE ===');

    // Format messages for chat completion
    const formattedChat = await formatChat(messages);
    DebugLogger.debug('=== MODEL INPUT ===\n' + formattedChat + '\n=== END MODEL INPUT ===');

    let isFirstUpdate = true;
    try {
      await createCompletion(formattedChat, (newContent) => {
        editMessageInConversation(convId, assistantMsg.id, newContent);
        if (isFirstUpdate) {
          isFirstUpdate = false;
        }
      });
    } catch (error) {
      DebugLogger.error('Error during completion:', error);
      editMessageInConversation(convId, assistantMsg.id, 'Error: Failed to generate response');
    }
    // Log the final message after completion
    const finalMessage = getConversationById(convId)?.messages.find(m => m.id === assistantMsg.id);
    if (finalMessage) {
      DebugLogger.debug('=== MODEL RESPONSE ===\n' + finalMessage.content + '\n=== END MODEL RESPONSE ===');
    }
  };

  return (
    <ScreenWrapper fitScreen>
      <div className="chat-messages grow overflow-auto" id="chat-history">
        <div className="h-10" />

        {currConv ? (
          <>
            {currConv.messages.map((msg) => {
              if (msg.role === 'system') {
                return null; // Don't display system messages in the UI
              }
              return msg.role === 'user' ? (
                <div className="chat chat-end" key={msg.id}>
                  <div className="chat-bubble">{nl2br(msg.content)}</div>
                </div>
              ) : (
                <div className="chat chat-start" key={msg.id}>
                  <div className="chat-bubble bg-base-100 text-base-content">
                    {msg.content.length === 0 && isGenerating && (
                      <span className="loading loading-dots"></span>
                    )}
                    {nl2br(msg.content)}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="pt-24 text-center text-xl">Ask me something 👋</div>
        )}
      </div>
      <div className="flex flex-col input-message py-4">
        {isGenerating && (
          <div className="text-center">
            <button
              className="btn btn-outline btn-sm mb-4"
              onClick={stopCompletion}
            >
              <FontAwesomeIcon icon={faStop} />
              Stop generation
            </button>
          </div>
        )}

        {loadedModel && (
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Your message..."
            disabled={isGenerating}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.keyCode == 13 && e.shiftKey == false) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />
        )}

        {!loadedModel && <WarnNoModel />}

        <small className="text-center mx-auto opacity-70 pt-2">
          wllama may generate inaccurate information. Use with your own risk.
        </small>
      </div>
    </ScreenWrapper>
  );
}

function WarnNoModel() {
  const { navigateTo } = useWllama();

  return (
    <div role="alert" className="alert">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>Model is not loaded</span>
      <div>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => navigateTo(Screen.MODEL)}
        >
          Select model
        </button>
      </div>
    </div>
  );
}

const chatScrollToBottom = () => {
  const elem = document.getElementById('chat-history');
  elem?.scrollTo({
    top: elem.scrollHeight,
    behavior: 'smooth',
  });
};