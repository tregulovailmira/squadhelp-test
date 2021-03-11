import React from 'react';
import Cards from 'react-credit-cards';
import styles from './PayForm.module.sass';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { changeFocusOnCard } from '../../actions/actionCreator';
import PayInput from '../InputComponents/PayInput/PayInput';
import customValidator from '../../validators/validator';
import Schems from '../../validators/validationSchems';

import 'react-credit-cards/es/styles-compiled.css';

let isPayForOrder;

const PayForm = (props) => {

  const changeFocusOnCard = (name) => {
    props.changeFocusOnCard(name);
  };

  const pay = (values) => {
    props.sendRequest(values);
  };

  isPayForOrder = props.isPayForOrder;
  const { handleSubmit, focusOnElement, name, number, expiry, cvc } = props;
  return (
    <div className={ styles.payFormContainer }>
      <span className={ styles.headerInfo }>Payment Information</span>
      <div className={ styles.cardContainer }>
        <Cards
          number={ number ? number : '' }
          name={ name ? name : '' }
          expiry={ expiry ? expiry : '' }
          cvc={ cvc ? cvc : '' }
          focused={ focusOnElement }
        />
      </div>
      <form id='myForm' className={ styles.formContainer }
            onSubmit={ handleSubmit(pay) }>
        <div className={ styles.bigInput }>
          <span>Name</span>
          <Field
            name='name'
            classes={ {
              container: styles.inputContainer,
              input: styles.input,
              notValid: styles.notValid,
              error: styles.error,
            } }
            component={ PayInput }
            type='text'
            label='name'
            changeFocus={ changeFocusOnCard }
          />
        </div>
        { !isPayForOrder && <div className={ styles.bigInput }>
          <span>Sum</span>
          <Field
            name='sum'
            classes={ {
              container: styles.inputContainer,
              input: styles.input,
              notValid: styles.notValid,
              error: styles.error,
            } }
            component={ PayInput }
            type='text'
            label='sum'
          />
        </div> }
        <div className={ styles.bigInput }>
          <span>Card Number</span>
          <Field
            isInputMask={ true }
            mask='9999 9999 9999 9999 999'
            name='number'
            classes={ {
              container: styles.inputContainer,
              input: styles.input,
              notValid: styles.notValid,
              error: styles.error,
            } }
            component={ PayInput }
            type='text'
            label='card number'
            changeFocus={ changeFocusOnCard }
          />
        </div>
        <div className={ styles.smallInputContainer }>
          <div className={ styles.smallInput }>
            <span>* Expires</span>
            <Field
              isInputMask={ true }
              mask='99/99'
              name='expiry'
              classes={ {
                container: styles.inputContainer,
                input: styles.input,
                notValid: styles.notValid,
                error: styles.error,
              } }
              component={ PayInput }
              type='text'
              label='expiry'
              changeFocus={ changeFocusOnCard }
            />
          </div>
          <div className={ styles.smallInput }>
            <span>* Security Code</span>
            <Field
              isInputMask={ true }
              mask='9999'
              name='cvc'
              classes={ {
                container: styles.inputContainer,
                input: styles.input,
                notValid: styles.notValid,
                error: styles.error,
              } }
              component={ PayInput }
              type='text'
              label='cvc'
              changeFocus={ changeFocusOnCard }
            />
          </div>
        </div>
      </form>
      { isPayForOrder &&
      <div className={ styles.totalSum }><span>Total: $100.00</span></div> }
      <div className={ styles.buttonsContainer }>
        <button form='myForm' className={ styles.payButton } type='submit'>
          <span>{ isPayForOrder ? 'Pay Now' : 'CashOut' }</span></button>
        { isPayForOrder &&
        <div onClick={ () => props.back() } className={ styles.backButton }>
          <span>Back</span></div> }
      </div>
    </div>
  );

};

const mapStateToProps = (state) => {
  const selector = formValueSelector('payForm');
  const { focusOnElement } = state.payment;
  const { name, number, cvc, expiry } = selector(state, 'name', 'number', 'cvc',
    'expiry');
  return { focusOnElement, name, number, cvc, expiry };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeFocusOnCard: (data) => dispatch(changeFocusOnCard(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'payForm',
  validate: customValidator(
    isPayForOrder ? Schems.PaymentSchema : Schems.CashoutSchema),
})(PayForm));
