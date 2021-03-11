import React from 'react';


const FieldFileInput = (props) => {
    const getFileName = () => {
        if (props.input.value)
            return props.input.value.name;
        else
            return '';
    };

    const onChange = (e) => {
        const {input: {onChange}} = props;
        const file = e.target.files[0];
        onChange(file);
    };

    const {fileUploadContainer, labelClass, fileNameClass, fileInput} = props.classes;
    return (
        <div className={fileUploadContainer}>
            <label htmlFor="fileInput" className={labelClass}>Choose file</label>
            <span id='fileNameContainer' className={fileNameClass}>{getFileName()}</span>
            <input className={fileInput} id="fileInput" type="file" onChange={onChange}/>
        </div>
    )
};

export default FieldFileInput;