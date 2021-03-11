import React from 'react'
import {connect} from 'react-redux';
import styles from './ContestCreationPage.module.sass';
import {saveContestToStore, clearDataForContest} from '../../actions/actionCreator';
import NextButton from '../../components/NextButton/NextButton';
import ContestForm from '../../components/ContestForm/ContestForm';
import Schem from '../../validators/validationSchems';
import CONSTANTS from '../../constants';
import BackButton from '../../components/BackButton/BackButton';
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';


const ContestCreationPage = (props) => {

    const submitDataContest = (values) => {
        props.saveContest({type: props.contestType, info: values});
        props.history.push(props.bundleStore.bundle[props.contestType] === 'payment' ? '/payment' : props.bundleStore.bundle[props.contestType] + 'Contest');
    };

    !props.bundleStore.bundle && props.history.replace('/startContest');
    const contestData = props.contestStore.contests[props.contestType] ? props.contestStore.contests[props.contestType] : {contestType: props.contestType};
    return (
        <div>
            <Header/>
            <div className={styles.startContestHeader}>
                <div className={styles.startContestInfo}>
                    <h2>
                        {props.title}
                    </h2>
                    <span>
                        Tell us a bit more about your business as well as your preferences so that creatives get a better idea about what you are looking for
                        </span>
                </div>
                <ProgressBar currentStep={2}/>
            </div>
            <div className={styles.container}>
                <div className={styles.formContainer}>
                    <ContestForm contestType={props.contestType} submitData={submitDataContest}
                                 defaultData={contestData}/>
                </div>
            </div>
            <div className={styles.footerButtonsContainer}>
                <div className={styles.lastContainer}>
                    <div className={styles.buttonsContainer}>
                        <BackButton/>
                        <NextButton/>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
};


const mapStateToProps = (state) => {
    const {contestStore, bundleStore} = state;
    return {contestStore, bundleStore};
};

const mapDispatchToProps = (dispatch) => (
    {
        saveContest: (data) => dispatch(saveContestToStore(data)),
        clearDataForContest: () => dispatch(clearDataForContest())
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(ContestCreationPage);

