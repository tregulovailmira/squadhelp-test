import React from 'react';
import {change} from 'redux-form';


class SelectInput extends React.Component {

    getOptionsArray = () => {
        const {optionsArray, valueArray} = this.props;
        const array = [];
        for (let i = 0; optionsArray && i < optionsArray.length; i++) {
            let option;
            if (valueArray) {
                option = <option key={i} value={valueArray[i]}>{optionsArray[i]}</option>;
            } else {
                option = <option key={i}>{optionsArray[i]}</option>;
            }
            array.push(option);
        }
        return array;
    };

    componentDidMount() {
        const {valueArray, optionsArray, input, meta: {dispatch, form, initial}} = this.props;
        if (!initial && optionsArray)
            dispatch(change(form, input.name, valueArray ? valueArray[0] : optionsArray[0]));
    }

    render() {
        const {input, header, classes} = this.props;
        return (
            <div className={classes.inputContainer}>
                <span className={classes.inputHeader}>{header}</span>
                <select {...input} className={classes.selectInput}>
                    {this.getOptionsArray()}
                </select>
            </div>
        )
    }
}

export default SelectInput;



