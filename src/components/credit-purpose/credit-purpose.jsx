import React, {useCallback, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';
import {CreditData, CreditType, ENTER_KEY} from '../../const';
import {getClassName} from '../../utils';
import {resetOptions, setCreditType, setInitialPayment, setInitialPaymentRate, setPeriod, setTotalPrice, setStep} from '../../store/actions';
import {getCreditType} from '../../store/credit/selectors';

import "./style.scss";

const CreditToTitle = {
  home: `Ипотечное кредитование`,
  auto: `Автомобильное кредитование`,
};

const types = Object.values(CreditType);

const CreditPurpose = (props) => {
  const {className} = props;

  const checkedCredit = useSelector(getCreditType);

  const [isOpen, setOpenStatus] = useState(false);
  const dispatch = useDispatch();

  const resetCreditParameters = useCallback((type) => {
    const {totalSum: {min: minTotalPrice}, initialPayment: {min: minInitialRate}, period: {min: minPeriod}} = CreditData[type];

    const mintInitialPayment = minInitialRate * minTotalPrice / 100;

    dispatch(setCreditType(type));
    dispatch(setTotalPrice(minTotalPrice));
    dispatch(setInitialPayment(mintInitialPayment));
    dispatch(setInitialPaymentRate(minInitialRate));
    dispatch(setPeriod(minPeriod));
    dispatch(resetOptions());
  }, [dispatch]);

  const handleOptionClick = useCallback((evt) => {
    const type = evt.target.id;
    setOpenStatus(false);

    resetCreditParameters(type);
    dispatch(setStep(2));
  }, [dispatch, resetCreditParameters]);

  const optionOnFocus = (evt) => {
    if (evt.key === ENTER_KEY) {
      const type = evt.target.id;
      setOpenStatus(false);
      resetCreditParameters(type);
      dispatch(setStep(2));

      const element = evt.target;
      element.removeEventListener(`keydown`, optionOnFocus);
    }
  };

  const handleOptionFocus = useCallback((evt) => {
    const element = evt.target;
    element.addEventListener(`keydown`, optionOnFocus);
  }, [dispatch, resetCreditParameters]);

  const handleSelectClick = useCallback(() => setOpenStatus((prev) => !prev), []);

  const seletctOnFocus = (evt) => {
    if (evt.key === ENTER_KEY) {
      setOpenStatus((prev) => !prev);
      const element = evt.target;
      element.removeEventListener(`keydown`, seletctOnFocus);
    }
  };

  const handleSelectFocus = useCallback((evt) => {
    const element = evt.target;
    element.addEventListener(`keydown`, seletctOnFocus);
  }, []);

  const selectText = useMemo(() => checkedCredit ? CreditToTitle[checkedCredit] : `Выберите цель кредита`, [checkedCredit]);

  const formClass = useMemo(() => getClassName(className, `credit-purpose`), [className]);

  const iconId = isOpen ? `#arrow-up` : `#arrow-down`;

  return (
    <form id="credit-purpose" className={formClass}>
      <span
        onFocus={handleSelectFocus}
        onClick={handleSelectClick}
        className={getClassName(
            `credit-purpose__select`,
            isOpen && `credit-purpose__select--open`
        )}
        tabIndex="0"
      >
        {selectText}
        <svg className="credit-purpose__icon" width="18" height="11">
          <use xlinkHref={iconId}></use>
        </svg>
      </span>

      <ul className="credit-purpose__options">
        {types.map((type) => (
          <li
            key={type}
            id={type}
            className="credit-purpose__option"
            onFocus={handleOptionFocus}
            onClick={handleOptionClick}
            tabIndex="0"
          >
            {CreditToTitle[type]}
          </li>
        ))}
      </ul>
    </form>
  );
};

CreditPurpose.propTypes = {
  className: PropTypes.string.isRequired,
};

export default CreditPurpose;
