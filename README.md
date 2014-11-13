# react-modal-jquery

## Features

* Create Modal Dialogs
* CSS Framework Agnostic (Use anything you want)
* Position modal relative to other elements on screen (perfect for custom UI elements like date pickers, color pickers, text input, etc.)
* Ability to pass params to Modal when it is opened
* Ability to return params from Modal back to opener when Modal is updated, submitted, cancelled
* All positioning features from jQuery UI's position (e.g. my "left top" at "left bottom" of some button).
* Live updating of values from Modal to parent (e.g. live preview of color picker changes, input text, etc.)
* Built in cancelling behavior (e.g. when you cancel the color preview, the color is reverted to the original color)
* Uses click outside modal to cancel
* Uses escape key to cancel modal
* Programmatically cancel (e.g. by clicking a "cancel" button or an "x" in the UI)
* The React Modal can be used from a React component or a non-React component


## Creating a Modal

To create a modal, add Modal.Mixin to your React class then instantiate.

```javascript
var Modal = require('react-modalizer');

var MyModal = React.createClass({
  mixins: [Modal.Mixin],
  render: function () {
    return (<div>Hello World</div>)
  }
});

var modal = Modal.create(MyModal);
```

To open the modal

```javascript
modal.open();
```


## Open Positioning Options

Just calling modal.open is boring so there's lots of options:

```javascript
// Positioning to a node
// Try `left`, `center`, `right` for horizontal positioning
// and `top`, `center, `bottom` for vertical positioning
modal.open({
  my: 'left top',
  at: 'left bottom',
  of: someNode
});

// Position to an event like a mouse click
modal.open({
  my: 'left top',
  at: 'left bottom',
  of: event
});
```

Look at jQuery UI position for more options:

http://api.jqueryui.com/position/

Supports the following options:

* my
* at
* of
* collision


## Passing Values to Modal

Send values as params:

When you open a modal, the `params` option will be available as `this.params` within the React element. `this.params` is an Object that represents the values you wish to pass back and forth between the calling function and the Modal.

```javascript
var Modal = require('react-modalizer');
var InputModal = React.createClass({
  mixins: [Modal.Mixin],
  modalWillOpen: function () {
    // any params set in `open` call (below) are available in `this.params`
    this.setState({text: this.params.text});
  },
  render: function () {
    return (<input type="text" value={this.state.text} />);
  }
});

var modal = Modal.create(InputModal);

// open the modal with the given params
modal.open({
  params: {text: 'Hello World'}
});

```


## Returning Values from Modal

```javascript
var Modal = require('react-modalizer');
var InputModal = React.createClass({
  mixins: [Modal.Mixin],
  modalWillOpen: function () {
    // any params set in `open` call (below) are available in `this.params`
    this.setState({text: this.params.text});
  },
  render: function () {
    return (<form>
      <input type="text" value={this.state.text} />
    </form>);
  }
});

var modal = Modal.create(InputModal);

// this opens the modal with the given params
modal.open({
  params: {text: 'Hello World'},
  onUpdate: function (params) { console.log("updated: " + params.text); }
  onSubmit: function (params) { console.log("submitted: " + params.text); }
});

```

## Modal creation

Modal's are created in two steps:

1. Add Modal.Mixin to the React element
2. use new Modal(reactElement) to instantiate the modal

## Modal open arguments


## API

### Callbacks

#### modalWillOpen

This method is called immediately before the Modal is opened if it exists.

You can use `this.params` to access any params that were passed in. This is usually the place to `setState` for your ReactElement.

#### modalWillClose

This method is called immediately before the Modal is closed.



### ReactModal.Mixin

#### setParams

```javascript
setParams(object nextParams)
```

Merges nextParams with the current params. After the params are set, there is an automatic call to the `onUpdate` callback of the Modal's opener.

```javascript
modal.open({
  params: {text: 'abc'},
  // this method automatically called whenever `setParams` is called.
  onUpdate: function (params) { console.log(params.text); }
});
```

Notes:

Like this.state, Never mutate this.params directly.


#### replaceParams

```javascript
replaceParams(object nextParams)
```

Like `setParams` but deletes any pre-existing param keys that are not in nextParams.

#### submitModal

When `submitModal` is called, the `onSubmit` callback is automatically called with the values from `this.params`

```javascript
// When `this.submitModal` is called, `this.params` is sent to the `onSubmit`
// callback as shown below.
modal.open({
  params: {text: 'abc'},
  onSubmit: function (params) { console.log(params.text); }
});
```


#### this.cancelModal()

When `cancelModal` is called, `this.params` is reset to its original value during the `open` call.

The `onUpdate` callback is then called automatically.