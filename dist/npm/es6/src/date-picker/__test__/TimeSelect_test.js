import _extends from 'babel-runtime/helpers/extends';
/* eslint react/prop-types: ["off"] */

import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import TimeSelect from '../TimeSelect';
import { mockRAf, nativeEvent } from './utils';

// https://facebook.github.io/jest/docs/expect.html
// http://airbnb.io/enzyme/docs/api/ShallowWrapper/exists.html
// http://sinonjs.org/releases/v2.3.4/spies/

// render , mount , shallow :
//    https://github.com/airbnb/enzyme/issues/465
describe('TimePicker test', function () {
  var minProps = {
    start: '08:30',
    step: '00:15',
    end: '18:30',
    maxTime: '12:30',
    onChange: function onChange() {},

    value: null,
    placeholder: 'Select time'
  };

  function mountDefault() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return mount(React.createElement(TimeSelect, _extends({}, minProps, props)));
  }
  it('should render without exploding', function () {
    var w = shallow(React.createElement(TimeSelect, minProps));
    expect(w.exists()).toBeTruthy();
  });

  it('should have valid state', function () {
    mockRAf();
    var onChange = sinon.spy();
    var w = mount(React.createElement(TimeSelect, _extends({}, minProps, {
      onChange: onChange
    })));

    // test pop up
    w.find('input[type="text"]').simulate('focus');
    expect(w.find('.time-select-item').length > 1).toBe(true);
    // min
    expect(w.find('.time-select-item').at(0).text().trim()).toBe('08:30');
    // max
    expect(w.find('.time-select-item.disabled').at(0).text().trim()).toBe('12:30');
    //test clear icon

    // https://github.com/Semantic-Org/Semantic-UI-React/issues/1319
    w.find('.time-select-item').at(0).simulate('click', nativeEvent);
    expect(onChange.args[0][0].getTime()).toBe(new Date(2017, 0, 1, 8, 30).getTime());
    w.find('i.el-input__icon').simulate('click', nativeEvent);
    expect(onChange.calledWith(null)).toBeTruthy();
  });

  it('isShowTrigger should work', function () {
    var w = mount(React.createElement(TimeSelect, _extends({}, minProps, {
      isShowTrigger: false
    })));
    expect(w.find('i.el-input__icon').exists()).toBe(false);
  });

  it('isDisabled should work', function () {
    var w = mount(React.createElement(TimeSelect, _extends({}, minProps, {
      isDisabled: true
    })));
    expect(w.find('input').props().disabled).toBe(true);
  });

  it('onFocus & onBlur should work', function () {
    var onFocus = sinon.spy();
    var onBlur = sinon.spy();
    var w = mountDefault({
      onFocus: onFocus,
      onBlur: onBlur
    });

    w.find('input').simulate('focus');
    expect(onFocus.called).toBeTruthy();
    w.find('input').simulate('blur');
    expect(onBlur.called).toBeTruthy();
  });

  describe('TimePicker:fixed range test', function () {

    it('start date change should trigger end date selectable dates', function () {
      var startDate = new Date(2017, 1, 10, 14, 30);
      var endDate = new Date(2017, 1, 10, 15, 30);

      var Ts = function Ts(_ref) {
        var startDate = _ref.startDate,
            onChange = _ref.onChange;
        return React.createElement(
          'div',
          null,
          React.createElement(TimeSelect, {
            start: '08:30',
            step: '00:15',
            end: '18:30',
            onChange: onChange,
            value: startDate,
            placeholder: '\u9009\u62E9\u65F6\u95F4'
          }),
          React.createElement(TimeSelect, {
            start: '08:30',
            step: '00:15',
            end: '18:30',
            onChange: function onChange() {},
            value: endDate,
            minTime: startDate,
            placeholder: '\u9009\u62E9\u65F6\u95F4'
          })
        );
      };

      var w = mount(React.createElement(Ts, { startDate: startDate, onChange: function onChange(d) {
          startDate = d;
        } }));

      w.find('input[type="text"]').at(0).simulate('focus');
      w.find('.time-select-item').at(3).simulate('click', nativeEvent);
      w.setProps({ startDate: startDate });
      // w.mount() // !notice, `update` would not work here, it seems `update` method wouldnt update deep child nodes

      w.find('input[type="text"]').at(1).simulate('focus');
      expect(w.find('.time-select-item').at(3).is('.disabled')).toBe(true);
      expect(w.find('.time-select-item').at(4).is('.disabled')).toBe(false);
      // console.log('xx', w.find('.time-select-item').at(4).debug(), startDate.toLocaleString())
    });
  });
});