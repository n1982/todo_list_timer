import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Task.css';

export default class Task extends Component {
  state = {
    // eslint-disable-next-line react/prop-types,react/destructuring-assignment
    min: this.props.minValue,
    // eslint-disable-next-line react/destructuring-assignment,react/prop-types
    sec: this.props.secValue,
    // eslint-disable-next-line react/no-unused-state
    isCounting: false,
  };

  static defaultProps = {
    description: 'Имя не задано',
    checked: false,
    timeAfterCreate: () => {},
    onEditClick: () => {},
    onDeletedClick: () => {},
    onCheckBoxClick: () => {},
  };

  static propTypes = {
    checked: PropTypes.bool,
    onCheckBoxClick: PropTypes.func,
    description: PropTypes.string,
    timeAfterCreate: PropTypes.string,
    onEditClick: PropTypes.func,
    onDeletedClick: PropTypes.func,
  };

  componentWillUnmount() {
    clearInterval(this.counterID);
  }

  minDecrement = () => {
    const { min } = this.state;
    this.setState({
      min: min - 1,
      sec: 59,
    });
  };

  secDecrement = () => {
    const { min, sec, isCounting } = this.state;
    const { onCheckBoxClick } = this.props;

    if (min === 0 && sec === 0 && isCounting === true) {
      onCheckBoxClick();
      clearInterval(this.counterID);
      this.setState({
        isCounting: false,
      });
    }
    if (sec > 0) {
      this.setState({
        sec: sec - 1,
        isCounting: true,
      });
    } else {
      this.minDecrement();
    }
  };

  handlePause = (event) => {
    event.stopPropagation();
    this.setState({ isCounting: false });
    clearInterval(this.counterID);
  };

  handleStart = (event) => {
    event.stopPropagation();
    this.setState({ isCounting: true });
    this.counterID = setInterval(() => {
      this.secDecrement();
    }, 1000);
  };

  render() {
    const { onCheckBoxClick, description, timeAfterCreate, onEditClick, onDeletedClick, checked } = this.props;
    const { min, sec, isCounting } = this.state;
    const buttonTimer = !isCounting ? (
      /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
      <button type="button" className="icon icon-play" onClick={this.handleStart} />
    ) : (
      /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
      <button type="button" className="icon icon-pause" onClick={this.handlePause} />
    );
    return (
      <div className="view">
        <input className="toggle" type="checkbox" readOnly onClick={onCheckBoxClick} checked={checked} />

        <div className="label">
          <span role="presentation" className="title" onClick={onCheckBoxClick}>
            {description}
          </span>
          <span className="description">
            {buttonTimer}
            <span className="description__time-value">
              {min}:{sec}
            </span>
          </span>
          <span className="created">created {timeAfterCreate} ago</span>
        </div>
        <button type="button" className="icon icon-edit" onClick={onEditClick} aria-label="log out" />
        <button type="button" className="icon icon-destroy" onClick={onDeletedClick} aria-label="log out" />
      </div>
    );
  }
}
