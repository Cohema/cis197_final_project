var React = require('react');
var LikeButton = React.createClass({
  getInitialState: function () {
    return {liked: false};
  },
  toggle: function () {
    this.setState({liked: !this.state.liked});
  },
  render: function () {
    var txt = this.state.liked ? 'Unlike' : 'Like';
    var color = this.state.liked ? '#3b5998' : '#627AAC';
    return (
      <span onClick={this.toggle} style={{color: color}}>
        {'\ud83d\udc4d' + txt}
      </span>
    );
  }
});
module.exports = LikeButton;
