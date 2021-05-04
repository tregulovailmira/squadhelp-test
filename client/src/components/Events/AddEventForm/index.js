import React from 'react';
import { Modal, Button, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { Form, Formik, Field } from 'formik';
import DatePickerField from './DatePickerField';
import styles from './AddEventForm.module.sass';

function AddEventForm (props) {
  const { onSubmit, onHide } = props;
  const initialValues = {
    eventName: '',
    eventDate: new Date(),
    reminderDate: new Date()
  };

  const validationSchema = yup.object({
    eventName: yup.string().min(2, 'Must be at least 2 characters').max(256, 'Must be at most 256 characters').required('This is a required field!'),
    eventDate: yup.date().min(new Date(), `Must be later that ${new Date().toLocaleString()}`).required(),
    reminderDate: yup.date().min(new Date(), `Must be later that ${new Date().toLocaleString()}`).required()
  });

  const onSubmitHandler = (values, formikBag) => {
    const { eventName, eventDate, reminderDate } = values;
    onSubmit(eventName, eventDate, reminderDate);
    formikBag.resetForm();
    onHide();
  };

  const restrictEventTime = (time) => {
    const selectedDate = new Date(time);
    const currentDate = new Date();

    return currentDate.getTime() < selectedDate.getTime();
  };

  const restrictReminderTime = (eventDate, time) => {
    const selectedDate = new Date(time);
    const startEvent = new Date();
    const endEvent = new Date(eventDate);

    return startEvent.getTime() < selectedDate.getTime() && endEvent.getTime() > selectedDate.getTime();
  };

  return (
            <Modal {...props} aria-labelledby="contained-modal-title-vcenter">

                <Formik initialValues={initialValues} onSubmit={onSubmitHandler} validationSchema={validationSchema} validateOnBlur={false}>
                    {({ values }) =>
                        <Form>
                                <Modal.Header closeButton>
                                    <Modal.Title id="contained-modal-title-vcenter">
                                        Add new event
                                    </Modal.Title>
                                </Modal.Header>

                                <Modal.Body className="show-grid">
                                    <Container>
                                        <Row className='justify-content-md-center'>
                                            <Field name='eventName'>
                                                {({ field, meta }) =>
                                                    <label style={{ width: '100%' }}>
                                                        <input {...field} placeholder='Add new event' className={styles.nameInput}/>
                                                        {meta.touched && meta.error && <span className={styles.validationWarning}>{meta.error}</span>}
                                                    </label>
                                                }
                                            </Field>
                                        </Row>

                                        <Row md={1} xs={1} sm={1}>
                                            <div className={styles.pickerTitle}>Enter event date</div>
                                            <DatePickerField
                                                name='eventDate'
                                                maxDate={new Date('2100-12-31 23:59:59')}
                                                filterTime={restrictEventTime}
                                            />
                                        </Row>
                                        <Row md={1} xs={1} sm={1}>
                                            <div className={styles.pickerTitle}>Enter reminder date</div>
                                            <DatePickerField
                                                name='reminderDate'
                                                maxDate={values.eventDate}
                                                filterTime={(time) => restrictReminderTime(values.eventDate, time)}
                                            />
                                        </Row>
                                    </Container>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button variant='secondary' type='button' onClick={onHide}>
                                        <span className="fas fa-times"></span>
                                    </Button>
                                    <Button variant='primary' type='submit'>
                                        <span className="fas fa-check"></span>
                                    </Button>
                                </Modal.Footer>
                        </Form>
                    }
                </Formik>
            </Modal>
  );
}

AddEventForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired
};

export default AddEventForm;
