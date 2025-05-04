import { io } from "socket.io-client";

class SocketService {
  socket = null;

  async connect(serverUrl) {
    return new Promise((resolve, reject) => {
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
    if (!this.socket) {
      console.error("Socket not initialized.");
      return;
    }
    const payload = { gameId };
    console.log("Emitting join_game_room:", payload);
    this.socket.emit("join_game_room", payload);
  }

  leaveGameRoom(gameId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("leave_game_room", { gameId });
      console.log("Left room:", gameId);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  registerListener(event, callback) {
    if (!this.socket) return;
    this.socket.off(event);
    this.socket.on(event, callback);
  }

  // sinyaller

  onBothPlayersReady(callback) {
    this.registerListener("both_players_ready", callback);
  }

  onMoveMade(callback) {
    if (this.socket && typeof callback === "function") {
      this.socket.on("move_made", callback);
    }
  }

  offMoveMade() {
    if (this.socket) {
      this.socket.off("move_made");
    }
  }

  onGameResigned(callback) {
    this.registerListener("game_resigned", callback);
  }

  offGameResigned() {
    if (this.socket) {
      this.socket.off("game_resigned");
    }
  }
}

const socketService = new SocketService();
export default socketService;
