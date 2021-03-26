import React from "react";
import { useField, useFormikContext } from "formik";
import TextField from '@material-ui/core/TextField'

export default function DatePickerField (props) {

  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);

  return (
    <TextField
      {...field}
      {...props}
      type="datetime-local"
      onChange={({ target:{ value } }) => {
        setFieldValue(field.name, value);
      }}
    />
  );
};