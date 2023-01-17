import React from "react";
import "./styles.scss";
import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRMING = "CONFIRMING";
  const EDITING = "EDITING";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW);
      })
      .catch((res) => {
        transition(ERROR_SAVE, true);

      });
  };

  const deleteInterview = () => {
    transition(CONFIRMING);
  };

  const confirmDeleteInterview = () => {
    transition(DELETING);
    props
      .cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((res) => {
        transition(ERROR_DELETE, true);
      });
  };

  const editInterview = () => {
    transition(EDITING);
  };

  return (
    <article className="appointment">
      <Header time={props.time} />

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer}
          onDelete={deleteInterview}
          onEdit={editInterview}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={back} onSave={save} />
      )}
      {mode === SAVING && <Status message="Saving Interview" />}
      {mode === DELETING && <Status message="Deleting Interview" />}
      {mode === CONFIRMING && (
        <Confirm onCancel={back} onConfirm={confirmDeleteInterview} />
      )}
      {mode === EDITING && (
        <Form
          student={props.interview.student}
          interviewers={props.interviewers}
          interviewer={props.interview.interviewer}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && (<Error message="Error Saving Interview" onClose={() => transition(EMPTY, true)} />)}
      {mode === ERROR_DELETE && (<Error message="Error Deleting Interview" onClose={() =>transition(SHOW, true)} />)}
    </article>
  );
}
