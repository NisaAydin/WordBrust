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

  joinGameRoom(gameId, playerId) {
    const emitJoin = () => {
      console.log("📤 join_game_room emit gönderiliyor:", { gameId, playerId });
      this.socket.emit("join_game_room", { gameId, playerId });
    };

    if (this.socket && this.socket.connected) {
      emitJoin();
    } else if (this.socket) {
      this.socket.once("connect", () => {
        console.log("✅ Socket bağlandıktan sonra join emit atılıyor.");
        emitJoin();
      });
    } else {
      console.error("❌ Socket nesnesi yok.");
    }
  }

  onBoardInitialized(callback) {
    if (this.socket) {
      // Önce eski dinleyiciyi kaldır (önlem için)
      this.socket.off("board_initialized");
      this.socket.on("board_initialized", callback);
    }
  }

  onInitialLetters(callback) {
    if (this.socket) {
      this.socket.on("initial_letters", callback);
    }
  }

  onRemainingLettersUpdated(callback) {
    if (this.socket) {
      this.socket.on("remaining_letters_updated", callback);
    }
  }

  leaveGameRoom(gameId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("leave_game_room", { gameId });
      console.log("Oda bırakıldı:", gameId);
    }
  }

  joinGameRoomAndListenBoard(gameId, onBoardReady) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("join_game_room", { gameId });
      this.socket.off("board_initialized");
      this.socket.on("board_initialized", (board) => {
        console.log("Tahta geldi:", board);
        onBoardReady(board);
      });
    } else {
      console.warn("Socket bağlı değil, bağlanmadan önce çağrı yapıldı.");
    }
  }

  onRemainingLettersUpdated(callback) {
    if (this.socket) {
      this.socket.off("remaining_letters_updated"); // Önlem için varsa eskiyi kaldır
      this.socket.on("remaining_letters_updated", callback);
    }
  }
}

const socketService = new SocketService();
export default socketService;
