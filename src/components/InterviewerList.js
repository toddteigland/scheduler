import React from 'react';
import InterviewerListItem from './InterviewerListItem';
import "./InterviewerList.scss";
// import PropTypes from 'prop-types';


export default function InterviewerList(props) {

  // InterviewerList.PropTypes = {
  //   interviewers: PropTypes.array.isRequired
  // };

  const InterviewerListItems = props.interviewers.map((interviewer) => {

    return (
      <InterviewerListItem
        key={interviewer.id}
        name={interviewer.name}
        avatar={interviewer.avatar}
        selected={interviewer.id === props.value}
        setInterviewer={() => props.setInterviewer(interviewer.id)}
      />
    );
  });


  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {InterviewerListItems}
      </ul>
    </section>
  );
}