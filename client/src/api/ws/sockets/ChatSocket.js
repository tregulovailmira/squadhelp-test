import WebSocket from './WebSocket';
import CONTANTS from "../../../constants";
import {addMessage, changeBlockStatusInStore} from "../../../actions/actionCreator";

class ChatSocket extends WebSocket {

    anotherSubscribes = () => {
        this.onNewMessage();
        this.onChangeBlockStatus();
    };

    onChangeBlockStatus = () => {
        this.socket.on(CONTANTS.CHANGE_BLOCK_STATUS, (data) => {
            const { message } = data;
            const { messagesPreview } = this.getState().chatStore;
            messagesPreview.forEach(preview => {
                if (preview._id === message._id)
                    preview.blackList = message.blackList
            });
            this.dispatch(changeBlockStatusInStore({chatData: message, messagesPreview}));
        })
    };

    onNewMessage = () => {
        this.socket.on('newMessage', (data) => {
            const {message, preview} = data.message;
            const {messagesPreview} = this.getState().chatStore;
            let isNew = true;
            messagesPreview.forEach(item => {
                if (item._id === preview._id) {
                    item.text = message.body;
                    item.sender = message.sender;
                    item.createAt = message.createdAt;
                    isNew = false;
                }
            });
            if (isNew) {
                messagesPreview.push(preview);
            }
            this.dispatch(addMessage({message, messagesPreview}));
        })
    };

    subscribeChat = (id) => {
        this.socket.emit('subscribeChat', id);
    };

    unsubscribeChat = (id) => {
        this.socket.emit('unsubscribeChat', id);
    };
}

export default ChatSocket;