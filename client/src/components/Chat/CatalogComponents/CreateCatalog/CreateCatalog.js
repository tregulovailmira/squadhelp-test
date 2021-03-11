import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import FormInput from '../../../FormInput/FormInput';
import styles from './CreateCatalog.module.sass';
import {createCatalog} from '../../../../actions/actionCreator';

const validate = (values) => {
    const errors = {};
    if (!values.catalogName || !values.catalogName.trim().length) {
        errors.catalogName = 'Cannot be empty';
    }
    return errors;
};


const CreateCatalog = (props) => {
    const click = (values) => {
        const {createCatalog} = props;
        const {addChatId} = props;
        createCatalog({catalogName: values.catalogName, chatId: addChatId});
    };
    const {handleSubmit, valid} = props;
    return (
        <form onSubmit={handleSubmit(click)} className={styles.form}>
            <Field
                name='catalogName'
                component={FormInput}
                type='text'
                label='name of catalog'
                classes={{
                    container: styles.inputContainer,
                    input: styles.input,
                    warning: styles.fieldWarning,
                    notValid: styles.notValid
                }}
            />
            {valid && <button type='submit'>Create Catalog</button>}
        </form>
    )
};


const mapDispatchToProps = (dispatch) => {
    return {
        createCatalog: (data) => dispatch(createCatalog(data))
    }
};

const mapStateToProps = (state) => {
    return state.chatStore;
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'createCatalog',
    validate
})(CreateCatalog));