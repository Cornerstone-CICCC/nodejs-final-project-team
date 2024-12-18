"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const setupCanvasSocket = (io) => {
    const roomDrawings = {};
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('drawing', (data) => {
            const { room, x0, y0, x1, y1, color, width } = data;
            if (!roomDrawings[room]) {
                roomDrawings[room] = [];
            }
            roomDrawings[room].push({ x0, y0, x1, y1, color, width });
            // Broadcast to the specific room
            socket.to(room).emit('drawing', data);
            const draingInfo = data;
            try {
                // For room-based broadcast
                io.to(data.room).emit('newDrawing', draingInfo);
            }
            catch (error) {
                console.error('Error saving chat:', error);
            }
        });
        socket.on('addNewRoom', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const roomInfo = data;
            socket.broadcast.emit('newRoom', roomInfo);
            //io.emit('newRoom', roomInfo);
        }));
        socket.on('sendDrawing', (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(data);
            const { username, message, room } = data;
            const draingInfo = data;
            try {
                // For room-based broadcast
                io.to(data.room).emit('newDrawing', draingInfo);
            }
            catch (error) {
                console.error('Error saving chat:', error);
            }
        }));
        socket.on('join room', (data) => {
            const { room } = data;
            socket.join(room);
            // Send the current drawing state to the user
            if (roomDrawings[room]) {
                socket.emit('load canvas', roomDrawings[room]);
            }
        });
        // Leaving a room
        socket.on('leave room', (data) => {
            socket.leave(data.room);
            console.log(`${data.username} has left the room ${data.room}`);
            io.to(data.room).emit('newMessage', {
                message: `${data.username} has left the room ${data.room}`,
                username: 'System',
                room: data.room
            });
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};
exports.default = setupCanvasSocket;
