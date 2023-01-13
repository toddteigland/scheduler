import classNames from 'classnames';
import React from 'react';
import "./InterviewerListItem.scss";

export default function InterviewerListItem(props) {

  let nameClass = classNames('interviewers__item', {
    'interviewers__item--selected': props.selected
  });



  return (
    <li className={nameClass} onClick={() => props.setInterviewer(props.id)}>
      <img src={props.avatar} className="interviewers__item-image"/>
      <p>{props.selected && props.name}</p>
    </li>);
};

