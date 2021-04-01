import React, { forwardRef } from "react";
import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import styles from './DatePickerField.module.sass';
import "react-datepicker/dist/react-datepicker.css";

export default function DatePickerField (props) {

  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  const { value } = field;

  const DatePickerButton = forwardRef(
    ({ value, onClick }, ref) => (
      <button type='button' onClick={onClick} ref={ref} className={styles.pickerButton}>
        {value}
      </button>
    ),
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
};