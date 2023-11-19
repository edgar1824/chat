import { Server, Socket } from "socket.io";
import { UserStore } from "../services/index.js";

export interface DBDocument {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type IEventHandler = (
  io: Server,
  socket: Socket,
  userStore: UserStore
) => void;

export interface ISocketUser {
  userId?: string;
  socketId?: string;
  username?: string;
  conversationId?: string;
}

export interface IUser<TFriends = string[]> extends DBDocument {
  friends?: TFriends;
  username?: string;
  googleId?: string;
  email?: string;
  country?: string;
  img?: string;
  city?: string;
  phone?: string;
  password?: string;
  isAdmin?: boolean;
}

export interface INotif<TSender = string, TRecievers = string[]>
  extends DBDocument {
  sender?: TSender;
  type?: string;
  recievers?: TRecievers;
  title?: string;
  text?: string;
  expireAt?: string | Date;
}

export interface IMessage<TSender = string, RWatched = string[]>
  extends DBDocument {
  conversationId?: string;
  sender?: TSender;
  text?: string;
  audio?: string;
  device?: "PC" | "Mobile";
  watched?: RWatched;
}

export interface IConv<
  TMembers = string[],
  TAdmins = string[],
  TMessage = string
> extends DBDocument {
  members?: TMembers;
  type?: "group" | "dialogue";
  img?: string;
  title?: string | string[];
  admins?: TAdmins;
  lastMessage?: TMessage;
}
