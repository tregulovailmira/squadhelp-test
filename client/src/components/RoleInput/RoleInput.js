/* eslint-disable react/prop-types */
import React from 'react';
import styles from './RoleInput.module.sass';

const RoleInput = ({ label, id, strRole, infoRole, input, type }) => {
  return (
        <label htmlFor={id}>
            <div className={styles.roleContainer}>
                <input {...input} type={type} id={id}/>
                <div className={styles.infoRoleContainer}>
                    <span className={styles.role}>{strRole}</span>
                    <span className={styles.infoRole}>{infoRole}</span>
                </div>
            </div>
        </label>
  );
};

export default RoleInput;
