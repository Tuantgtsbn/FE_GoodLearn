import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IChatConversation, IChatMessage } from '@/types';

// ─── Additional Chat Types ─────────────────────────────────────────────────
export type ReactionType = 'LIKE' | 'DISLIKE' | null;

export interface ChatMessageWithReaction extends IChatMessage {
  reaction?: ReactionType;
  isStreaming?: boolean;
}

interface ChatState {
  conversations: IChatConversation[];
  activeConversationId: string | null;
  messages: ChatMessageWithReaction[];
  isSidebarOpen: boolean;
  isStreaming: boolean;
  inputValue: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const generateId = () =>
  Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

// ─── Mock Data ──────────────────────────────────────────────────────────────
const INITIAL_CONVERSATIONS: IChatConversation[] = [
  {
    id: 'conv-1',
    userId: 'user-1',
    title: 'Giải bài tập Toán lớp 12',
    subject: 'Toán',
    gradeLevel: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 'conv-2',
    userId: 'user-1',
    title: 'Vật lý - Nhiệt động lực học',
    subject: 'Vật lý',
    gradeLevel: 11,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: 'conv-3',
    userId: 'user-1',
    title: 'Hóa học hữu cơ',
    subject: 'Hóa học',
    gradeLevel: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: 'conv-4',
    userId: 'user-1',
    title: 'Tiếng Anh - Grammar tips',
    subject: 'Tiếng Anh',
    gradeLevel: 10,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

const MOCK_MESSAGES: Record<string, ChatMessageWithReaction[]> = {
  'conv-1': [
    {
      messageId: 'msg-1',
      conversationId: 'conv-1',
      role: 'user',
      contentType: 'text',
      content: 'Giúp mình giải phương trình bậc 2: 2x² + 3x - 5 = 0',
      hasAttachment: false,
      attachmentType: null,
      attachmentUrl: null,
      attachmentFileId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      messageId: 'msg-2',
      conversationId: 'conv-1',
      role: 'assistant',
      contentType: 'text',
      content: `Đây là một câu hỏi hay! Hãy cùng giải nhé 🎓

## Giải phương trình: 2x² + 3x - 5 = 0

**Bước 1:** Tính Delta (Δ)

$$\\Delta = b^2 - 4ac = 3^2 - 4(2)(-5) = 9 + 40 = 49$$

**Bước 2:** Vì Δ = 49 > 0, phương trình có **2 nghiệm phân biệt**

$$x_1 = \\frac{-b + \\sqrt{\\Delta}}{2a} = \\frac{-3 + 7}{4} = 1$$

$$x_2 = \\frac{-b - \\sqrt{\\Delta}}{2a} = \\frac{-3 - 7}{4} = -2.5$$

### Kết quả
| Nghiệm | Giá trị |
|---------|---------|
| x₁ | **1** |
| x₂ | **-2.5** |

> 💡 **Mẹo:** Khi Delta là số chính phương, bạn có thể tính nhanh hơn bằng cách nhẩm!

Bạn cần giải thêm bài nào không? 😊`,
      hasAttachment: false,
      attachmentType: null,
      attachmentUrl: null,
      attachmentFileId: null,
      reaction: 'LIKE',
      createdAt: new Date(Date.now() - 1000 * 60 * 29),
    },
  ],
  'conv-2': [
    {
      messageId: 'msg-3',
      conversationId: 'conv-2',
      role: 'user',
      contentType: 'text',
      content: 'Giải thích nguyên lý 2 của nhiệt động lực học',
      hasAttachment: false,
      attachmentType: null,
      attachmentUrl: null,
      attachmentFileId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      messageId: 'msg-4',
      conversationId: 'conv-2',
      role: 'assistant',
      contentType: 'text',
      content: `Tuyệt vời! Đây là một chủ đề rất quan trọng trong Vật lý 🔬

## Nguyên lý 2 Nhiệt động lực học

### Phát biểu theo Clausius
> *"Nhiệt không thể tự truyền từ vật lạnh sang vật nóng"*

### Phát biểu theo Kelvin-Planck  
> *"Không thể chế tạo động cơ nhiệt hoạt động theo chu trình mà kết quả duy nhất là biến đổi hoàn toàn nhiệt thành công"*

### Tóm tắt nội dung

| Khái niệm | Mô tả | Ứng dụng |
|-----------|-------|----------|
| **Entropy** | Đại lượng đo độ hỗn loạn | ΔS ≥ 0 |
| **Hiệu suất Carnot** | Hiệu suất tối đa | η = 1 - T₂/T₁ |
| **Quá trình bất thuận nghịch** | Entropy tăng | Tất cả quá trình tự nhiên |

### Ví dụ thực tế
1. 🧊 Đá tan trong nước ấm (không tự đông lại)
2. ☕ Cà phê nóng nguội dần (không tự nóng lên)
3. 🎯 Khí tự phân tán (không tự co lại)

\`\`\`python
# Tính hiệu suất Carnot
def carnot_efficiency(T_hot, T_cold):
    """T_hot, T_cold tính bằng Kelvin"""
    return 1 - T_cold / T_hot

# Ví dụ: nguồn nóng 500K, nguồn lạnh 300K
eta = carnot_efficiency(500, 300)
print(f"Hiệu suất Carnot: {eta:.1%}")  # 40.0%
\`\`\`

Bạn muốn tìm hiểu sâu hơn về phần nào? 🤔`,
      hasAttachment: false,
      attachmentType: null,
      attachmentUrl: null,
      attachmentFileId: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 30000),
    },
  ],
};

// ─── AI Mock Responses ──────────────────────────────────────────────────────
const MOCK_RESPONSES = [
  `Chào bạn! Tôi là trợ lý AI của GoodLearn 🎓

Tôi có thể giúp bạn với nhiều chủ đề học tập khác nhau. Hãy hỏi tôi bất cứ điều gì bạn muốn biết!

### Một vài gợi ý:
- 📚 **Giải bài tập** toán, lý, hóa
- 📝 **Viết bài luận** hoặc tóm tắt nội dung
- 🔬 **Giải thích** các khái niệm khoa học
- 💡 **Tạo flashcard** ôn thi nhanh

Bạn cần giúp gì hôm nay?`,

  `Đây là một câu hỏi thú vị! Hãy cùng tìm hiểu nhé.

## Phân tích

Khi giải quyết một bài toán, bạn cần:
1. **Đọc kỹ đề bài** và xác định dữ kiện
2. **Lập kế hoạch giải** - tìm mối liên hệ giữa các đại lượng
3. **Thực hiện các phép tính** cần thiết
4. **Kiểm tra lại kết quả** với đề bài

\`\`\`python
# Ví dụ code minh họa
def solve_equation(a, b, c):
    """Giải phương trình bậc 2: ax² + bx + c = 0"""
    delta = b**2 - 4*a*c
    if delta > 0:
        x1 = (-b + delta**0.5) / (2*a)
        x2 = (-b - delta**0.5) / (2*a)
        return x1, x2
    elif delta == 0:
        return -b / (2*a)
    else:
        return "Phương trình vô nghiệm"
\`\`\`

Hy vọng điều này giúp ích cho bạn! 😊`,

  `Tuyệt vời! Đây là một chủ đề rất quan trọng.

### Tóm tắt nội dung chính

| Khái niệm | Mô tả | Ứng dụng |
|-----------|-------|----------|
| **Nguyên lý 1** | Nội năng hệ thay đổi khi trao đổi nhiệt | Nhiệt động lực học |
| **Nguyên lý 2** | Entropy không giảm | Máy nhiệt, tủ lạnh |
| **Định luật bảo toàn** | Năng lượng không tự sinh ra | Mọi hiện tượng vật lý |

> 💡 **Mẹo học nhanh:** Hãy liên hệ các khái niệm với thực tế cuộc sống hàng ngày để dễ nhớ hơn!

Bạn muốn tìm hiểu sâu hơn về phần nào không?`,
];

// ─── Initial State ──────────────────────────────────────────────────────────
const initialState: ChatState = {
  conversations: INITIAL_CONVERSATIONS,
  activeConversationId: null,
  messages: [],
  isSidebarOpen: true,
  isStreaming: false,
  inputValue: '',
};

// ─── Slice ──────────────────────────────────────────────────────────────────
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
      state.messages = action.payload
        ? MOCK_MESSAGES[action.payload] || []
        : [];
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },

    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    setInputValue: (state, action: PayloadAction<string>) => {
      state.inputValue = action.payload;
    },

    createNewConversation: (state) => {
      state.activeConversationId = null;
      state.messages = [];
      state.inputValue = '';
    },

    deleteConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(
        (c) => c.id !== action.payload
      );
      if (state.activeConversationId === action.payload) {
        state.activeConversationId = null;
        state.messages = [];
      }
      delete MOCK_MESSAGES[action.payload];
    },

    addUserMessage: (
      state,
      action: PayloadAction<{ content: string; conversationId?: string }>
    ) => {
      const { content } = action.payload;
      let conversationId =
        action.payload.conversationId || state.activeConversationId;

      // Create new conversation if none active
      if (!conversationId) {
        conversationId = generateId();
        const newConv: IChatConversation = {
          id: conversationId,
          userId: 'user-1',
          title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
          subject: null,
          gradeLevel: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        state.conversations.unshift(newConv);
        state.activeConversationId = conversationId;
      }

      const userMsg: ChatMessageWithReaction = {
        messageId: generateId(),
        conversationId,
        role: 'user',
        contentType: 'text',
        content,
        hasAttachment: false,
        attachmentType: null,
        attachmentUrl: null,
        attachmentFileId: null,
        createdAt: new Date(),
      };

      state.messages.push(userMsg);
      state.inputValue = '';
      state.isStreaming = true;

      // Store in mock data
      if (!MOCK_MESSAGES[conversationId]) {
        MOCK_MESSAGES[conversationId] = [];
      }
      MOCK_MESSAGES[conversationId].push(userMsg);
    },

    addAssistantMessage: (
      state,
      action: PayloadAction<{ messageId: string; conversationId: string }>
    ) => {
      const assistantMsg: ChatMessageWithReaction = {
        messageId: action.payload.messageId,
        conversationId: action.payload.conversationId,
        role: 'assistant',
        contentType: 'text',
        content: '',
        hasAttachment: false,
        attachmentType: null,
        attachmentUrl: null,
        attachmentFileId: null,
        isStreaming: true,
        createdAt: new Date(),
      };
      state.messages.push(assistantMsg);
    },

    updateStreamingMessage: (
      state,
      action: PayloadAction<{
        messageId: string;
        content: string;
        done?: boolean;
      }>
    ) => {
      const msg = state.messages.find(
        (m) => m.messageId === action.payload.messageId
      );
      if (msg) {
        msg.content = action.payload.content;
        if (action.payload.done) {
          msg.isStreaming = false;
          state.isStreaming = false;
          // Update conversation
          const conv = state.conversations.find(
            (c) => c.id === msg.conversationId
          );
          if (conv) {
            conv.updatedAt = new Date();
          }
        }
      }
    },

    setMessageReaction: (
      state,
      action: PayloadAction<{ messageId: string; reaction: ReactionType }>
    ) => {
      const msg = state.messages.find(
        (m) => m.messageId === action.payload.messageId
      );
      if (msg) {
        msg.reaction =
          msg.reaction === action.payload.reaction
            ? null
            : action.payload.reaction;
      }
    },

    removeMessagesFrom: (state, action: PayloadAction<string>) => {
      const idx = state.messages.findIndex(
        (m) => m.messageId === action.payload
      );
      if (idx !== -1) {
        state.messages = state.messages.slice(0, idx);
      }
    },

    setIsStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
    },
  },
});

export const {
  setActiveConversation,
  setSidebarOpen,
  toggleSidebar,
  setInputValue,
  createNewConversation,
  deleteConversation,
  addUserMessage,
  addAssistantMessage,
  updateStreamingMessage,
  setMessageReaction,
  removeMessagesFrom,
  setIsStreaming,
} = chatSlice.actions;

export default chatSlice.reducer;

// ─── Thunk: Send Message (simulates streaming) ─────────────────────────────
export const sendMessage =
  (content: string) =>
  (
    dispatch: (action: unknown) => void,
    getState: () => { chat: ChatState }
  ) => {
    dispatch(addUserMessage({ content }));

    const state = getState().chat;
    const conversationId = state.activeConversationId!;
    const assistantId = generateId();

    const fullResponse =
      MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];

    setTimeout(() => {
      dispatch(addAssistantMessage({ messageId: assistantId, conversationId }));

      let index = 0;
      const intervalId = setInterval(() => {
        index += Math.floor(Math.random() * 4) + 2;
        if (index >= fullResponse.length) {
          dispatch(
            updateStreamingMessage({
              messageId: assistantId,
              content: fullResponse,
              done: true,
            })
          );
          clearInterval(intervalId);
        } else {
          dispatch(
            updateStreamingMessage({
              messageId: assistantId,
              content: fullResponse.slice(0, index),
            })
          );
        }
      }, 18);
    }, 400);
  };

// ─── Thunk: Regenerate Message ──────────────────────────────────────────────
export const regenerateMessage =
  (messageId: string) =>
  (
    dispatch: (action: unknown) => void,
    getState: () => { chat: ChatState }
  ) => {
    dispatch(removeMessagesFrom(messageId));

    const state = getState().chat;
    const lastUserMsg = [...state.messages]
      .reverse()
      .find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    const newAssistantId = generateId();
    const fullResponse =
      MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];

    dispatch(setIsStreaming(true));
    dispatch(
      addAssistantMessage({
        messageId: newAssistantId,
        conversationId: lastUserMsg.conversationId,
      })
    );

    let index = 0;
    const intervalId = setInterval(() => {
      index += Math.floor(Math.random() * 4) + 2;
      if (index >= fullResponse.length) {
        dispatch(
          updateStreamingMessage({
            messageId: newAssistantId,
            content: fullResponse,
            done: true,
          })
        );
        clearInterval(intervalId);
      } else {
        dispatch(
          updateStreamingMessage({
            messageId: newAssistantId,
            content: fullResponse.slice(0, index),
          })
        );
      }
    }, 18);
  };
