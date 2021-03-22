import React from 'react';
import stepsDescription from './stepsDescription.json';
import styles from './StartingWorkSteps.module.sass'

function StartingWorkSteps() {

    const renderSteps = () => {
        return stepsDescription.map((step, index)=>
            <li key={index} className={styles.stepWrapper}>            
                <div className={styles.stepNumber}>
                    {index + 1}
                </div>
                <h4 className={styles.stepHeader}>
                    {step.header}
                </h4>
                <div className={styles.stepDescription}>
                    {step.description}
                </div>
            </li>
        )
    };

    return (
        <div className={styles.mainContainer}>
            <h2 className={styles.mainHeader}>5 Simple Steps</h2>
            <ul className={styles.stepsContainer}>{renderSteps()}</ul>
        </div>
    )
}

export default StartingWorkSteps

