/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  DatePicker, Form, Input, Radio, Select, Switch, Checkbox, TimePicker, Cascader, InputNumber,
} from 'antd';

export const inputType = {
  input: 'INPUT',
  inputNumber: 'INPUT_NUMBER',
  select: 'SELECT',
  switch: 'SWITCH',
  datePicker: 'DATE_PICKER',
  timePicker: 'TIME_PICKER',
  rangePicker: 'RANGE_PICKER',
  timeRangePicker: 'TIME_RANGE_PICKER',
  radio: 'RADIO',
  radioGroup: 'RADIO_GROUP',
  checkbox: 'CHECKBOX',
  checkboxGroup: 'CHECKBOX_GROUP',
  cascader: 'CASCADER',
  inputTextArea: 'INPUT_TEXTAREA',
  password: 'PASSWORD',
};

const FormItem = ({
  type,
  inputProps,
  showAllOption,
  ...rest
}) => {
  let input = <Input {...inputProps} />;
  switch (type) {
    case inputType.password:
      input = <Input.Password {...inputProps} />;
      break;
    case inputType.inputNumber:
      input = <InputNumber {...inputProps} />;
      break;
    case inputType.select:
      input = <Select {...inputProps} options={showAllOption ? [{ label: '全部', value: '' }].concat(inputProps.options) : inputProps.options} />;
      break;
    case inputType.switch:
      input = <Switch {...inputProps} />;
      break;
    case inputType.datePicker:
      input = <DatePicker {...inputProps} />;
      break;
    case inputType.timePicker:
      input = <TimePicker {...inputProps} />;
      break;
    case inputType.timeRangePicker:
      input = <TimePicker.RangePicker {...inputProps} />;
      break;
    case inputType.rangePicker:
      input = <DatePicker.RangePicker {...inputProps} />;
      break;
    case inputType.radio:
      input = <Radio {...inputProps} />;
      break;
    case inputType.radioGroup:
      input = <Radio.Group {...inputProps} />;
      break;
    case inputType.checkbox:
      input = <Checkbox {...inputProps} />;
      break;
    case inputType.checkboxGroup:
      input = <Checkbox.Group {...inputProps} />;
      break;
    case inputType.inputTextArea:
      input = <Input.TextArea {...inputProps} />;
      break;
    case inputType.cascader:
      input = <Cascader {...inputProps} />;
      break;
    default:
      break;
  }
  return (
    <Form.Item {...rest}>
      {input}
    </Form.Item>
  );
};

FormItem.propTypes = {
  type: PropTypes.oneOf(Object.keys(inputType).map((key) => inputType[key])),
  inputProps: PropTypes.shape({
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf({}),
  }),
  showAllOption: PropTypes.bool,
};

FormItem.defaultProps = {
  type: inputType.input,
  inputProps: {},
  showAllOption: true,
};

export default FormItem;
