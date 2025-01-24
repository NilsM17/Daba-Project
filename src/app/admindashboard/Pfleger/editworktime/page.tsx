'use client';
import React, { useEffect, useState } from 'react';
import { DayPilot, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import { getTime, updateTime, addTime } from './getTime';

function PflegerDash() {
  const [events, setEvents] = useState<DayPilot.EventData[]>([]);
  const startDate = "2025-01-01";
  const [calendar, setCalendar] = useState<DayPilot.Month>();
  const token = localStorage.getItem("bearerToken");

  if (!token) {
    throw new Error("Bearer token is missing");
  }

  // Fetch the current work time on mount
  useEffect(() => {
    const fetchTime = async () => {
      const Arbeitszeit = await getTime(token);  // Get all work times for the logged-in user
      if (Arbeitszeit && Arbeitszeit.length > 0) {
        const data: DayPilot.EventData[] = Arbeitszeit.map(event => ({
          id: new Date(event.StartTime).getTime(), // Use a unique ID
          text: "Arbeit", // Or any other text
          start: new Date(event.StartTime).toISOString(),
          end: new Date(event.EndTime).toISOString(),
          tags: { progress: 60 },
        }));
        setEvents(data); // Set multiple events
      }
    };
    fetchTime();
  }, []);

  // Edit the event (open a modal to change details)
  const editEvent = async (e: DayPilot.Event) => {
    const form = [
      { name: "Event text", id: "text", type: "text" },
      { name: "Event color", id: "tags.color", type: "select", options: colors },
      { name: "Progress", id: "tags.progress", type: "select", options: progressValues },
      { name: "Start Time", id: "start", type: "datetime" },
      { name: "End Time", id: "end", type: "datetime" },
      { name: "Badge ID", id: "tags.badgeID", type: "text" }, // Added Badge ID field
    ];

    const modal = await DayPilot.Modal.form(form, e.data);
    if (modal.canceled) {
      return;
    }

    const updatedEvent = modal.result;
    updatedEvent.start = updatedEvent.start ? new Date(updatedEvent.start) : e.data.start;
    updatedEvent.end = updatedEvent.end ? new Date(updatedEvent.end) : e.data.end;

    // Update work time in the database
    await updateTime(token, updatedEvent.start, updatedEvent.end);

    // Update the event in the calendar
    calendar?.events.update(updatedEvent);

    // Update the events state with the modified event
    setEvents(prevEvents => {
      return prevEvents.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      );
    });
  };

  // Add new event (work time)
  const addNewEvent = async (start: Date, end: Date) => {
    const form = [
      { name: "Event text", id: "text", type: "text" },
      { name: "Start Time", id: "start", type: "datetime" },
      { name: "End Time", id: "end", type: "datetime" },
      { name: "Badge ID", id: "tags.badgeID", type: "text" }, // Added Badge ID field
    ];

    const modal = await DayPilot.Modal.form(form, {
      start: start,
      end: end,
      text: "Arbeit", // Default text for the event
      tags: { badgeID: "" }, // Ensure badgeID is included
    });

    if (modal.canceled) {
      return;
    }

    const newEvent = modal.result;
    newEvent.start = new Date(newEvent.start);
    newEvent.end = new Date(newEvent.end);

    // Save the new event in the database
    await addTime(newEvent.start, newEvent.end, newEvent.tags.badgeID); // Include badgeID

    // Add the new event to the calendar
    calendar?.events.add(newEvent);

    // Update the events state
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  // Colors for the event edit modal
  const colors = [
    { name: "Green", id: "#6aa84f" },
    { name: "Blue", id: "#3d85c6" },
    { name: "Turquoise", id: "#00aba9" },
  ];

  // Progress options for the event edit modal
  const progressValues = [
    { name: "0%", id: 0 },
    { name: "10%", id: 10 },
    { name: "20%", id: 20 },
    { name: "30%", id: 30 },
    { name: "40%", id: 40 },
    { name: "50%", id: 50 },
    { name: "60%", id: 60 },
    { name: "70%", id: 70 },
    { name: "80%", id: 80 },
    { name: "90%", id: 90 },
    { name: "100%", id: 100 },
  ];

  // Context menu to edit or delete events
  const contextMenu = new DayPilot.Menu({
    items: [
      {
        text: "Delete",
        onClick: async (args) => {
          calendar?.events.remove(args.source);
        },
      },
      { text: "-" }, // Separator
      {
        text: "Edit...",
        onClick: async (args) => {
          await editEvent(args.source);
        },
      },
      { text: "-" }, // Separator
      {
        text: "Enter Badge ID...",
        onClick: async (args) => {
          // Prompt the user to enter a Badge ID
          const badgeID = prompt("Enter the Badge ID for the Pfleger:");

          if (badgeID) {
            // Update the event with the Badge ID (or handle it as needed)
            args.source.data.tags = args.source.data.tags || {};
            args.source.data.tags.badgeID = badgeID;

            // Optionally update the event in the database or perform any other logic

            // Update the event in the calendar
            calendar?.events.update(args.source);
          }
        },
      },
    ],
  });

  return (
    <div>
      <DayPilotMonth
        startDate={startDate}
        events={events}
        onEventClick={async (args) => {
          await editEvent(args.e);
        }}
        onTimeRangeSelected={async (args) => {
          // Trigger the add event function when a time range is selected
          await addNewEvent(args.start.toDate(), args.end.toDate());
        }}
        contextMenu={contextMenu}
        controlRef={setCalendar}
      />
    </div>
  );
}

export default PflegerDash;
