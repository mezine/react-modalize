/**
 * @jsx React.DOM
 */

var React = require('react');
var Modal = require('../lib/modal');
var InputModal = require('./input-modal');

var inputModal = Modal.create(InputModal);

var Button = React.createClass({
  getInitialState: function () {
    return {
      buttonText: "Click Me"
    };
  },
  onClick: function () {
    var target = this.refs.button.getDOMNode();
    var text = this.state.buttonText;
    inputModal.open({text: text}, {
      my: 'left top',
      at: 'left bottom',
      of: target,
      onSubmit: this.changeValues,
      onUpdate: this.changeValues
    });
  },
  changeValues: function (params) {
    this.setState({buttonText: params.text});
  },
  render: function () {
    return (<div>
      <button ref="button" onClick={this.onClick}>{this.state.buttonText}</button>
    </div>);
  }
});

React.render(<Button />, document.getElementById('content'));