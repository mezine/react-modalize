/**
 * @jsx React.DOM
 */

var React = require('react');
var Modal = require('../lib/modal');

var InputModal = React.createClass({
  mixins: [Modal.Mixin],
  getInitialState: function () {
    return {};
  },
  modalWillOpen: function () {
    this.focus();
    this.setState({text: this.params.text});
  },
  modalWillClose: function () {
    this.blur();
  },
  focus: function () {
    this.refs.input.getDOMNode().focus();
  },
  blur: function () {
    this.refs.input.getDOMNode().blur();
  },
  onSubmit: function (e) {
    e.preventDefault();
    this.submitModal();
  },
  onChange: function (e) {
    var text = this.refs.input.getDOMNode().value;
    this.setState({text: text});
    this.setParams({text: text});
  },
  render: function () {
    return (<div style={{padding: 5, border: '1px solid gray'}}>
      <form onSubmit={this.onSubmit}>
        <input ref="input" onChange={this.onChange} type="text" name="input" value={this.state.text} />
        <input type="submit" value="OK" />
        <input type="button" value="Cancel" onClick={this.cancelModal} />
      </form>
    </div>);
  }
});

module.exports = InputModal;