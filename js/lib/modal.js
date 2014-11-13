/**
 * @jsx React.DOM
 */

var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ModalMixin = require('./modal-mixin');
require('jquery-ui/position');

class Modal {

  static create(reactElement) {
    return new Modal(reactElement);
  }

  constructor(component) {
    _.bindAll(this);
    this.component = component; // the component as a class
  }

  open(values, options) {
    this.$target = $(options.of.getDOMNode ? options.of.getDOMNode() : options.of);
    this.onSubmit = options.onSubmit || function () {};
    this.onUpdate = options.onUpdate || function () {};
    if (!this.$div) this.createNode();
    this.$div.position({
      my: options.my || 'left top',
      at: options.at || 'left bottom',
      of: this.$target,
      collision: options.collision || 'fit'
    });
    // callback
    this.node.originalParams = _.cloneDeep(values);
    this.node.params = _.cloneDeep(values)
    this.node.modalWillOpen(values);
    this.mount();
  }

  close() {
    this.node.modalWillClose && this.node.modalWillClose();
    this.$div.css({
      left: -9999,
      top: 0
    });
    this.unmount();
  }

  cancel() {
    this.onUpdate(this.node.originalParams);
    this.close();
  }

  mount() {
    $(document).on('click', this.cancelFromClick);
    $(document).on('keyup', this.cancelFromEscape);
  }

  unmount() {
    $(document).off('click', this.cancelFromClick);
    $(document).off('keyup', this.cancelFromEscape);
  }

  submit(value) {
    this.onSubmit(value);
    this.close();
  }

  update(value) {
    this.onUpdate(value);
  }

  cancelFromClick(jqEvent) {
    var fromThisNode = this.$div.find(jqEvent.target).length > 0;
    if (!fromThisNode) {
      this.cancel();
    }
  }

  cancelFromEscape(jqEvent) {
    if (jqEvent.keyCode == 27) {
      this.cancel();
    }
  }

  createNode() {
    var Component = this.component;
    this.div = document.createElement('div');
    var $div = this.$div = $(this.div);
    $(document.body).append($div);
    $div.css({
      position: 'absolute',
      left: -9999,
      top: 0,
      background: 'silver'
    });
    var that = this;
    $div.on('click', function (jqEvent) {
      jqEvent.modalSource = that;
    });
    this.node = React.render(<Component modal={this} />, this.div);
  }

}

Modal.Mixin = ModalMixin;

module.exports = Modal;

