import React from 'react';
import {connect} from 'react-redux';
import {sendMessageAction} from '../../../../actions/actionCreator';
import {Field, reduxForm} from 'redux-form';
import styles from './ChatInput.module.sass';
import CONSTANTS from '../../../../constants';
import FormInput from "../../../FormInput/FormInput";


const validate = (values) => {
    const errors = {};
    if (!values.message || !values.message.trim().length) {
        errors.message = 'Cannot be empty';
    }
    return errors;
};

const ChatInput = (props) => {

    const clickButton = (values) => {
        const {reset} = props;
        props.sendMessage({
            messageBody: values.message,
            recipient: props.interlocutor.id,
            interlocutor: props.interlocutor
        });
        reset();
    };


    const {handleSubmit, valid} = props;
    return (
        <div className={styles.inputContainer}>
            <form onSubmit={handleSubmit(clickButton)} className={styles.form}>
                <Field
                    name='message'
                    component={FormInput}
                    type='text'
                    label='message'
                    classes={{
                        container: styles.container,
                        input: styles.input,
                        notValid: styles.notValid
                    }}
                />
                {valid &&
                <button type='submit'><img src={`${CONSTANTS.STATIC_IMAGES_PATH}send.png`} alt="send Message"/>
                </button>}
            </form>
        </div>
    )
};

const mapStateToProps = (state) => {
    const {interlocutor} = state.chatStore;
    const {data} = state.userStore;
    return {interlocutor, data};
};

const mapDispatchToProps = (dispatch) => {
    return {
        sendMessage: (data) => dispatch(sendMessageAction(data))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'messageForm',
    validate
})(ChatInput));
