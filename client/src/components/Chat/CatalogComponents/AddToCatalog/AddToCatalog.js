import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import SelectInput from '../../../SelectInput/SelectInput';
import {addChatToCatalog} from '../../../../actions/actionCreator';
import styles from './AddToCatalog.module.sass';


const AddToCatalog = (props) => {

    const getCatalogsNames = () => {
        const {catalogList} = props;
        const namesArray = [];
        catalogList.forEach((catalog) => {
            namesArray.push(catalog.catalogName);
        });
        return namesArray;
    };

    const getValueArray = () => {
        const {catalogList} = props;
        const valueArray = [];
        catalogList.forEach((catalog) => {
            valueArray.push(catalog._id);
        });
        return valueArray;
    };

    const click = (values) => {
        const {addChatId} = props;
        props.addChatToCatalog({chatId: addChatId, catalogId: values.catalogId});
    };


    const {handleSubmit} = props;
    const selectArray = getCatalogsNames();
    return (<>
            {selectArray.length !== 0 ?
                <form onSubmit={handleSubmit(click)} className={styles.form}>
                    <Field
                        name='catalogId'
                        component={SelectInput}
                        header='name of catalog'
                        classes={{
                            inputContainer: styles.selectInputContainer,
                            inputHeader: styles.selectHeader,
                            selectInput: styles.select
                        }}
                        optionsArray={selectArray}
                        valueArray={getValueArray()}
                    />
                    <button type='submit'>Add</button>
                </form>
                :
                <div className={styles.notFound}>You have not created any directories.</div>
            }

        </>
    )
};


const mapStateToProps = (state) => {
    return state.chatStore
};

const mapDispatchToProps = (dispatch) => {
    return {
        addChatToCatalog: (data) => dispatch(addChatToCatalog(data))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'addChatToCatalog'
})(AddToCatalog));