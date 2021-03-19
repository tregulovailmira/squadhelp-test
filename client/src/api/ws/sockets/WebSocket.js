import CONSTANTS from '../../../constants';
import { io } from 'socket.io-client';


class WebSocket {
    constructor(dispatch, getState, room) {
        this.dispatch = dispatch;
        this.getState = getState;
        this.socket = io(`${CONSTANTS.BASE_URL}${room}`);
        this.listen();
    }

    listen = () => {
        this.socket.on('connect', () => {
            this.anotherSubscribes();
        });
    };

    anotherSubscribes = () => {

    };
}


export default WebSocket;