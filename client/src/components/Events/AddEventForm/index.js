import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { Form, Formik, Field } from 'formik';
import DatePickerField from './DatePickerField';

function AddEventForm(props) {

    const { isShown, onSubmit, closeForm } = props;
    const initialValues = {
        eventName: '',
        eventDate: new Date(),
        reminderDate: new Date()
    }

    const validationSchema = yup.object({
        eventName: yup.string().min(2).max(256).required('This is a required field!')
    })

    const onSubmitHandler = (values, formikBag) => {
        const { eventName, eventDate, reminderDate } = values;
        onSubmit(eventName, eventDate, reminderDate);
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
            <Formik initialValues={initialValues} onSubmit={onSubmitHandler} validationSchema={validationSchema}>
                {({values})=>
                    <Form>
                        <Field name='eventName'>
                            {({ field, meta }) => 
                                <label>
                                    <input {...field} placeholder='Add new event'/>
                                    {meta.touched && meta.error && <span>{meta.error}</span>}
                                </label>
                            }
                        </Field>
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
