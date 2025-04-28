import { io } from "socket.io-client";

class SocketService {
  socket = null;

  async connect(serverUrl) {
    return new Promise((resolve, reject) => {
      // Önce varsa eski bağlantıyı kapat
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }

      this.socket = io(serverUrl, {
        transports: ["websocket"],
        secure: true,
        rejectUnauthorized: false,
      });

      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket.id);
        resolve(this.socket);
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        reject(error);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });
    });
  }

  joinGameRoom(gameId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("join_game_room", { gameId });
    } else {
      console.warn("Socket not connected. Cannot join room.");
    }
  }

  onBoardInitialized(callback) {
    if (this.socket) {
      // Önce eski dinleyiciyi kaldır (önlem için)
      this.socket.off("board_initialized");
      this.socket.on("board_initialized", callback);
    }
  }
}

const socketService = new SocketService();
export default socketService;
