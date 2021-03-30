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
        eventDate: new Date(),
        reminderDate: new Date()
    }

    const onSubmitHandler = (values, formikBag) => {
        const { eventName, eventDate, reminderDate } = values;
        onSubmit(eventName, eventDate, reminderDate, userId);
        formikBag.resetForm();
        closeForm();
    };

    const restrictEventTime = (time) => {
        const selectedDate = new Date(time);
        const currentDate = new Date();

        return currentDate.getTime() < selectedDate.getTime();

    }

    const restrictReminderTime = (eventDate, time) => {
        const selectedDate = new Date(time);
        const startEvent = new Date();
        const endEvent = new Date(eventDate);

        return startEvent.getTime() < selectedDate.getTime() && endEvent.getTime() > selectedDate.getTime();
    };

    return (
        isShown && 
        <>
            <Formik initialValues={initialValues} onSubmit={onSubmitHandler}>
                {({values})=>
                    <Form>
                        <Field name='eventName' placeholder='Add new event'/>
                        <DatePickerField name='eventDate' maxDate={new Date('2100-12-31 23:59:59')} filterTime={restrictEventTime}/>                  
                        <DatePickerField name='reminderDate' maxDate={values.eventDate} filterTime={(time)=>restrictReminderTime(values.eventDate, time)}/>
                        <button onClick={closeForm}>Close form</button>
                        <button type='submit'>Add event</button>                  
                    </Form>
                }            
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
