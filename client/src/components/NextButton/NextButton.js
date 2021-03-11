import React from 'react';
import styles from './NextButton.module.sass';
import {connect} from 'react-redux';
import {submit} from 'redux-form';


const NextButton = (props) => {
    const clickHandler = () => {
        props.dispatch(submit('contestForm'));
    };

    return (
        <div onClick={clickHandler} className={styles.buttonContainer}>
            <span>Next</span>
        </div>
    )
};

export default connect()(NextButton);


