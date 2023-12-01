import { DBDocument } from "./requests";

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

export interface iSocketUser<T = string[]> extends IUser<T> {
  messageWatched?: string | boolean;
  isOnline?: boolean;
  userId?: string;
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

export interface IPost<T extends IUser | string = string> extends DBDocument {
  desc?: string;
  img?: string;
  likes?: number;
  user?: T;
  watched?: number;

  // Not in the DB
  hasMyLike?: boolean;
  haveWatched?: boolean;
  peopleLiked?: string[];
}
export interface IComment<TUser extends IUser | string = string>
  extends DBDocument {
  desc?: string;
  postId?: string;
  comentatorId?: TUser;
}

export interface IPagination<T = any> {
  items?: T[];
  count?: number;
  docsCount?: number;
}
