/**
 * SkyGPT Frontend TypeScript Contracts
 * Mirrors backend microservice schemas (Auth, Chat, Agents)
 */

export type AgentType =
  | "auto"
  | "chat"
  | "search"
  | "coding"
  | "pdf"
  | "ppt"
  | "image";

export interface AgentMetadata {
  id: AgentType;
  name: string;
  tagline: string;
  badge: string;
  accentColor: string;
  iconName: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  image?: string;
  emailVerified?: boolean;
}

export interface Session {
  user: User;
  sessionToken?: string;
  expires?: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  agentUsed?: AgentType;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Conversation {
  _id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SendMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
  agentUsed: AgentType;
  conversationTitle: string;
}
