import React from "react";
import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePickerField (props) {

  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  const { value } = field;

  return (
    <>
      <DatePicker
        {...field}
        {...props}
        selected={value ? new Date(value) : new Date()}
        showTimeInput
        minDate={new Date()}
        dateFormat="MMMM d, yyyy h:mm aa"
        onChange={(value) => {
          setFieldValue(field.name, value);
        }}
      />
    </>

  );
};