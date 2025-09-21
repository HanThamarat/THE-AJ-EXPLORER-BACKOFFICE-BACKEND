import { Server, Socket } from "socket.io";
import { registerSocket, removeSocket, getActiveUsersCount } from "./sockets/userTracker";

export function setupSocket(io: Server) {
  // Client site namespace
  io.of("/client").on("connection", (socket: Socket) => {
    console.log("[client] connected:", socket.id);

    socket.on("register", ({ userId }) => {
      registerSocket(userId ?? socket.id, socket.id);
      broadcast(io);
    });

    socket.on("disconnect", () => {
      removeSocket(socket.id);
      broadcast(io);
    });
  });

  // CMS namespace
  io.of("/cms").on("connection", (socket: Socket) => {
    console.log("[cms] connected:", socket.id);
    socket.emit("activeUsers", { count: getActiveUsersCount() });
  });
}

function broadcast(io: Server) {
  const count = getActiveUsersCount();
  io.of("/client").emit("activeUsers", { count });
  io.of("/cms").emit("activeUsers", { count });
}
