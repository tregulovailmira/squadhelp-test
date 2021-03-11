import React from 'react';
import classNames from 'classnames';

const ImageUpload = (props) => {
    const onChange = (e) => {
        const node = window.document.getElementById('imagePreview');
        const {input: {onChange}} = props;
        const file = e.target.files[0];
        const imageType = /image.*/;
        if (!file.type.match(imageType)) {
            e.target.value = '';
        } else {
            onChange(file);
            const reader = new FileReader();
            reader.onload = () => {
                node.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };
    const {input: {value}} = props;
    const {uploadContainer, inputContainer, imgStyle} = props.classes;
    return (
        <div className={uploadContainer}>
            <div className={inputContainer}>
                <span>Support only images (*.png, *.gif, *.jpeg)</span>
                <input
                    id='fileInput'
                    type='file'
                    accept='.jpg, .png, .jpeg'
                    onChange={onChange}
                />
                <label htmlFor="fileInput">Chose file</label>
            </div>
            <img id='imagePreview' className={classNames({[imgStyle]: !!value})}/>
        </div>
    )
};

export default ImageUpload;