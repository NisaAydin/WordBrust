# WordBrust 

**WordBrust** is a real-time, multiplayer mobile word game where players take turns placing given letters on a 15x15 game board to form valid words and earn points.

---

##  Technologies

- **Frontend**: React Native (Expo)
- **Backend**: Node.js + Express.js (Hosted on Render)
- **Real-Time Communication**: Socket.IO (WebSocket)
- **Database**: PostgreSQL + Sequelize ORM
- **Authentication**: JWT (JSON Web Token)

---

##  Features

- ✅ Real-time two-player gameplay
- ✅ Rule-based scoring system
- ✅ First move must start from the center
- ✅ Countdown-based turn system
- ✅ Joker letter and word validation support
- ✅ Live score tracking and game completion

---

##  Gameplay Overview

- The game board is 15x15 tiles.
- Each player starts with 7 random letters.
- Players take turns dragging and placing letters.
- When confirmed, the move is sent to the server.
- Words are validated using a dictionary.
- If valid, points are calculated, and the turn switches.

---

##  Screenshots

| Home Screen | Game Screen |
|-------------|-------------|
| <img width="297" alt="home" src="https://github.com/user-attachments/assets/9c8cf868-e6cc-41c8-9c12-2d98ab16dfde" /> | <img width="298" alt="game" src="https://github.com/user-attachments/assets/5d6f89fd-337a-495f-ba6b-677e57b1be1f" /> |

---

##  Database Schema

- `Users`: Stores player information
- `Games`: Game metadata and status
- `Moves`: Records player moves and positions
- `Boards`: Board state per game
- `Letters`: Manages letter distribution and pool

---

##  Getting Started

### Frontend (Expo)

```bash
cd frontend
npm install
npx expo start
```

### Backend

The backend is hosted on Render and handles real-time communication, game logic, and database operations.  
No local setup is required.


##  Authors

- **Nisa Nur Aydın** – [nnisaydin@gmail.com]
- **Kaan Topcu** – [ktopcu106@gmail.com]
