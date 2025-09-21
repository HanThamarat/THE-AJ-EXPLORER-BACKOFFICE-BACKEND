const userToSockets = new Map<string, Set<string>>();
const socketToUser = new Map<string, string>();

export function registerSocket(userId: string, socketId: string) {
  const set = userToSockets.get(userId) ?? new Set();
  set.add(socketId);
  userToSockets.set(userId, set);
  socketToUser.set(socketId, userId);
}

export function removeSocket(socketId: string) {
  const userId = socketToUser.get(socketId);
  if (!userId) return;

  const set = userToSockets.get(userId);
  if (!set) return;

  set.delete(socketId);
  if (set.size === 0) {
    userToSockets.delete(userId);
  }
  socketToUser.delete(socketId);
}

export function getActiveUsersCount() {
  return userToSockets.size;
}
