import {
  AgentType,
  ApiResponse,
  Conversation,
  Message,
  SendMessageResponse,
  Session,
} from "../types";

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:4000";

/**
 * Core HTTP Request Wrapper enforcing cookies and error normalization
 */
const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${GATEWAY_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Ensures Better Auth session cookies are sent/received
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: `HTTP ${response.status}: Failed to parse JSON response`,
  }));

  if (!response.ok) {
    const errorMessage =
      data.message || data.error || `Request failed with HTTP ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
};

export const api = {
  // 1. Authentication Endpoints (Port 4001 via Gateway)
  auth: {
    getSession: async (): Promise<Session | null> => {
      try {
        const res = await request<any>("/api/v1/auth/get-session");
        if (res && res.user) {
          return {
            user: res.user,
            sessionToken: res.session?.token,
            expires: res.session?.expiresAt,
          };
        }
        return null;
      } catch {
        return null;
      }
    },

    signInEmail: async (email: string, password: string): Promise<any> => {
      return request("/api/v1/auth/sign-in/email", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    },

    signInSocial: async (
      provider: "google" | "github" | "facebook",
      callbackURL?: string,
    ): Promise<{ url: string }> => {
      return request("/api/v1/auth/sign-in/social", {
        method: "POST",
        body: JSON.stringify({
          provider,
          callbackURL: callbackURL || window.location.origin,
        }),
      });
    },

    signOut: async (): Promise<void> => {
      return request("/api/v1/auth/sign-out", {
        method: "POST",
      });
    },
  },

  // 2. Chat Endpoints (Port 4002 via Gateway)
  chat: {
    getConversations: async (): Promise<Conversation[]> => {
      const res = await request<ApiResponse<Conversation[]>>(
        "/api/v1/chat/conversations",
      );
      return res.data || [];
    },

    getConversation: async (
      id: string,
    ): Promise<Conversation & { messages: Message[] }> => {
      const res = await request<
        ApiResponse<Conversation & { messages: Message[] }>
      >(`/api/v1/chat/conversations/${id}`);
      return res.data as Conversation & { messages: Message[] };
    },

    createConversation: async (title?: string): Promise<Conversation> => {
      const res = await request<ApiResponse<Conversation>>(
        "/api/v1/chat/conversations",
        {
          method: "POST",
          body: JSON.stringify({ title: title || "New Conversation" }),
        },
      );
      return res.data as Conversation;
    },

    deleteConversation: async (id: string): Promise<void> => {
      await request(`/api/v1/chat/conversations/${id}`, {
        method: "DELETE",
      });
    },

    sendMessage: async (
      conversationId: string,
      content: string,
      agentType: AgentType = "auto",
    ): Promise<SendMessageResponse> => {
      const res = await request<ApiResponse<SendMessageResponse>>(
        `/api/v1/chat/conversations/${conversationId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            content,
            agentType,
          }),
        },
      );
      return res.data as SendMessageResponse;
    },
  },

  // 3. Agents Endpoints (Port 4003 via Gateway)
  agents: {
    ingestDocument: async (
      conversationId: string,
      text: string,
      fileName?: string,
    ): Promise<{ chunkCount: number }> => {
      const res = await request<ApiResponse<{ chunkCount: number }>>(
        "/api/v1/agents/documents/ingest",
        {
          method: "POST",
          body: JSON.stringify({
            conversationId,
            text,
            fileName: fileName || "document.txt",
          }),
        },
      );
      return res.data as { chunkCount: number };
    },
  },
};
