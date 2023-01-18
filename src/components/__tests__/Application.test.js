import React from "react";
import axios from 'axios';

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  waitForElementToBeRemoved,
  queryByText,
  debug,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  }),

    it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
      const { container } = render(<Application />);

      await waitForElement(() => getByText(container, "Archie Cohen"));

      const appointments = getAllByTestId(container, "appointment");
      const appointment = appointments[0];

      fireEvent.click(getByAltText(appointment, "Add"));

      fireEvent.change(
        getByPlaceholderText(appointment, /enter student name/i),
        {
          target: { value: "Lydia Miller-Jones" },
        }
      );
      fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

      fireEvent.click(getByText(appointment, "Save"));

      await waitForElementToBeRemoved(() =>
        getByText(appointment, "Saving Interview")
      );

      const day = getAllByTestId(container, "day").find((day) =>
        queryByText(day, "Monday")
      );

      expect(
        getByText(day, "Monday", "no spots remaining")
      ).toBeInTheDocument();
    });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    await waitForElement(() =>
      getByText(appointment, "Delete the appointment?"));

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(container, "Confirm"));
    
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting Interview")).toBeInTheDocument();
   
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
   
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday"));
    expect(getByText(day, "Monday", "2 spots remaining")).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the app
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Change the student name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },});

    // 5. Click Save
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Check the spots remaining is still the same.
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday"));
    expect(getByText(day, "Monday", "1 spot remaining")).toBeInTheDocument();
 });
  
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // 1. Render the app
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click Add
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Enter Student Name
    fireEvent.change(
      getByPlaceholderText(appointment, /enter student name/i),{
        target: { value: "Lydia Miller-Jones" },});

    // 5. Click on interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click Save
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check for Error Message
    await waitForElementToBeRemoved(() =>
    getByText(appointment, "Saving Interview"));
    expect(getByText(appointment, "Error"));

    // 8. Click on close X
    fireEvent.click(getByAltText(appointment, "Close"));

    // 9. Check for add button
    await waitForElement(() => getByAltText(appointment, "Add"));

    expect(getByAltText(appointment, "Add")).toBeInTheDocument();
  });

  it("shows the save error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // 1. Render the app
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    await waitForElement(() =>
    getByText(appointment, "Delete the appointment?"));

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(container, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    await waitForElementToBeRemoved(() =>
    getByText(appointment, "Deleting Interview"));

    // 7. Check that Error message is shown
    expect(getByText(appointment, "Error"))
    
    // 8. Click on close X
    fireEvent.click(getByAltText(appointment, "Close"));
    // 9. Check that Archie Cohen is still there
    expect(getByText(container, "Archie Cohen")).toBeInTheDocument();
  });

});
