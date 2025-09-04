export interface Wall {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  wall_id: string;
  content: string;
  likes: number;
  created_at: string;
  updated_at: string;
}

export interface CreateWallRequest {
  name: string;
  description?: string;
}

export interface CreateMessageRequest {
  content: string;
}

export interface UpdateMessageRequest {
  action: "like" | "delete";
}

export interface User {
  id: string;
  email: string;
  password: string;
}
