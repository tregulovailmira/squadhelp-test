import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Formik, Field } from 'formik';
import DatePickerField from './DatePickerField';

function AddEventForm(props) {

    const { data: { id: userId }} = useSelector(state => state.userStore);

    const { isShown, onSubmit, closeForm } = props;
    const initialValues = {
        eventName: '',
        eventDate: '2021-05-24T10:30',
        reminderDate: '2021-05-23T09:30'
    }

    const onSubmitHandler = (values, formikBag) => {
        const { eventName, eventDate, reminderDate } = values;
        onSubmit(eventName, eventDate, reminderDate, userId);
        formikBag.resetForm();
        closeForm();
    }

    return (
        isShown && 
        <>
            <Formik initialValues={initialValues} onSubmit={onSubmitHandler}>
                <Form>
                    <Field name='eventName' placeholder='Add new event'/> 
                    <DatePickerField name='eventDate' label='Set event date'/>                  
                    <DatePickerField name='reminderDate' label='Set reminder date'/> 
                    <button onClick={closeForm}>Close form</button>
                    <button type='submit'>Add event</button>                  
                </Form>            
            </Formik>
        </>
    )
}

AddEventForm.propTypes = {
    isShown: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    closeForm: PropTypes.func.isRequired
}

export default AddEventForm
