import React, {Component} from 'react';
import {Text} from 'react-native';

export default class AppText extends Component {
  staticStyle = {fontFamily: 'Soho Gothic Pro', color: 'white'};

  constructor(props) {
    super(props);
    this.style = Array.from(this.staticStyle);

    if (props.style) {
      if (Array.isArray(props.style)) {
        this.style = this.style.concat(props.style);
        this.style = this.style.push(this.staticStyle);
      } else {
        this.style = {...this.staticStyle, ...props.style};
      }
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.style) {
      this.style = {...this.staticStyle, ...newProps.style};
    }
  }

  render() {
    return (
      <Text {...this.props} style={this.style}>
        {this.props.children}
      </Text>
    );
  }
}
