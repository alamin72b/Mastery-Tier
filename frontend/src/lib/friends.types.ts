export type DiscoverUser = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  isFriend: boolean;
  hasOutgoingRequest: boolean;
  hasIncomingRequest: boolean;
};

export type FriendRequestUser = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
};

export type IncomingRequest = {
  id: string;
  senderId?: string;
  receiverId?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  sender: FriendRequestUser;
};

export type OutgoingRequest = {
  id: string;
  senderId?: string;
  receiverId?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  receiver: FriendRequestUser;
};

export type FriendCategory = {
  id: number;
  name: string;
  masteryTier: number;
  children: Array<{
    id: number;
    name: string;
    count: number;
  }>;
};

export type FriendWithProgress = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  friendedAt?: string;
  categories: FriendCategory[];
};

export type RequestsResponse = {
  incoming: IncomingRequest[];
  outgoing: OutgoingRequest[];
};

export type FriendsSnapshot = {
  friends: FriendWithProgress[];
  incomingRequests: IncomingRequest[];
  outgoingRequests: OutgoingRequest[];
  discoverResults: DiscoverUser[];
};
