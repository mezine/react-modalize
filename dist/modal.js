/**
 * @jsx React.DOM
 */

var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ModalMixin = require('./modal-mixin');
require('jquery-ui/position');

var Modal = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var static$0={},proto$0={};

  static$0.create = function(reactElement) {
    return new Modal(reactElement);
  };

  function Modal(component) {
    _.bindAll(this);
    this.component = component; // the component as a class
  }DP$0(Modal,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.open = function(values, options) {
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
  };

  proto$0.close = function() {
    this.node.modalWillClose && this.node.modalWillClose();
    this.$div.css({
      left: -9999,
      top: 0
    });
    this.unmount();
  };

  proto$0.cancel = function() {
    this.onUpdate(this.node.originalParams);
    this.close();
  };

  proto$0.mount = function() {
    $(document).on('click', this.cancelFromClick);
    $(document).on('keyup', this.cancelFromEscape);
  };

  proto$0.unmount = function() {
    $(document).off('click', this.cancelFromClick);
    $(document).off('keyup', this.cancelFromEscape);
  };

  proto$0.submit = function(value) {
    this.onSubmit(value);
    this.close();
  };

  proto$0.update = function(value) {
    this.onUpdate(value);
  };

  proto$0.cancelFromClick = function(jqEvent) {
    var fromThisNode = this.$div.find(jqEvent.target).length > 0;
    if (!fromThisNode) {
      this.cancel();
    }
  };

  proto$0.cancelFromEscape = function(jqEvent) {
    if (jqEvent.keyCode == 27) {
      this.cancel();
    }
  };

  proto$0.createNode = function() {
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
    this.node = React.render(Component({modal: this}), this.div);
  };

MIXIN$0(Modal,static$0);MIXIN$0(Modal.prototype,proto$0);static$0=proto$0=void 0;return Modal;})();

Modal.Mixin = ModalMixin;

module.exports = Modal;

