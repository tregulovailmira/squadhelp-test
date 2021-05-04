import React, { forwardRef } from 'react';
import { useField, useFormikContext } from 'formik';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import styles from './DatePickerField.module.sass';
import 'react-datepicker/dist/react-datepicker.css';

function DatePickerField (props) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);
  const { value } = field;

  // eslint-disable-next-line react/display-name
  const DatePickerButton = forwardRef(
    ({ value, onClick }, ref) => (
      <button
        type='button'
        onClick={onClick}
        ref={ref}
        className={styles.pickerButton}
        onMouseDown={(e) => e.preventDefault()}
      >
        {value}
        {meta.touched && meta.error &&
          <span className={styles.validationWarning}>
            {meta.error}
          </span>
        }
      </button>

    )
  );

  return (
    <>
      <DatePicker
        {...field}
        {...props}
        selected={value ? new Date(value) : new Date()}
        showMonthDropdown
        showYearDropdown
        showTimeSelect
        minDate={new Date()}
        dateFormat="MMMM d, yyyy h:mm aa"
        onChange={(value) => {
          setFieldValue(field.name, value);
        }}
        customInput={<DatePickerButton />}
      />
    </>

  );
}

DatePickerField.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default DatePickerField;
