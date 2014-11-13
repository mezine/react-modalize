var React = require('react');
var _ = require('lodash');

ModalMixin = {
  propTypes: {
    // passed in Modal object which created the React element.
    modal: React.PropTypes.object.isRequired
  },
  submitModal: function () {
    this.props.modal.submit(this.params);
  },
  // setParams: function (params) {
  //   _.extend(this.params, params);
  // },
  setParams: function (newParams) {
    _.extend(this.params, newParams);
    this.props.modal.update(this.params);
  },
  replaceParams: function (newParams) {
    this.params = newParams;
    this.props.modal.update(this.params);
  },
  cancelModal: function () {
    this.props.modal.cancel();
  }
  // state: modalWillOpen(values);
  // modalWillClose();          // good place to remove handlers, blur form inputs, etc.
  // revertToValues: modalWillCancel();
};

module.exports = ModalMixin;

