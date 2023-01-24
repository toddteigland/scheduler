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

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));

    await waitForElement(() =>
      getByText(appointment, "Delete the appointment?"));

    fireEvent.click(getByText(container, "Confirm"));
    
    expect(getByText(appointment, "Deleting Interview")).toBeInTheDocument();
   
    await waitForElement(() => getByAltText(appointment, "Add"));
   

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday"));
    expect(getByText(day, "Monday", "2 spots remaining")).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Edit"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },});

    fireEvent.click(getByText(appointment, "Save"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday"));
    expect(getByText(day, "Monday", "1 spot remaining")).toBeInTheDocument();
 });
  
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(
      getByPlaceholderText(appointment, /enter student name/i),{
        target: { value: "Lydia Miller-Jones" },});

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    await waitForElementToBeRemoved(() =>
    getByText(appointment, "Saving Interview"));
    expect(getByText(appointment, "Error"));

    fireEvent.click(getByAltText(appointment, "Close"));

    await waitForElement(() => getByAltText(appointment, "Add"));

    expect(getByAltText(appointment, "Add")).toBeInTheDocument();
  });

  it("shows the save error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));

    await waitForElement(() =>
    getByText(appointment, "Delete the appointment?"));

    fireEvent.click(getByText(container, "Confirm"));

    await waitForElementToBeRemoved(() =>
    getByText(appointment, "Deleting Interview"));

    expect(getByText(appointment, "Error"))
    
    fireEvent.click(getByAltText(appointment, "Close"));

    expect(getByText(container, "Archie Cohen")).toBeInTheDocument();
  });

});
