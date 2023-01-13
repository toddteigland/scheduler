import React, { Fragment } from 'react';
import './styles.scss';
import Header from './Header';
import Empty from './Empty';
import Show from './Show';

export default function Appointment(props) {

  return (
    <article className="appointment">
      <Header time={props.time} />

      {props.interview ?
        <Fragment>
          <Show student={props.interview.student} interviewer={props.interview.interviewer} />
        </Fragment>
        :
        <Fragment>
          <Empty />
        </Fragment>
      }

    </article>

  );
}