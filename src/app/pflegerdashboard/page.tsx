'use client';
import React, { useEffect, useState } from 'react';
import { DayPilot, DayPilotMonth } from "@daypilot/daypilot-lite-react";
import { getTime } from './getTime';

function PflegerDash() {
  const [events, setEvents] = useState<DayPilot.EventData[]>([]);
  const startDate = "2025-01-01";  // Start date for the calendar

  // Fetch all Arbeitszeiten (work times) for the logged-in user
  useEffect(() => {
    const fetchTime = async () => {
      const token = localStorage.getItem("bearerToken");
      if (!token) {
        throw new Error("Bearer token is missing");
      }
      const Arbeitszeiten = await getTime(token);  // Get all work times for the logged-in user
      if (Arbeitszeiten) {
        // Convert the fetched data into a format compatible with DayPilot
        const data: DayPilot.EventData[] = Arbeitszeiten.map((arbeitszeit, index) => ({
          id: index + 1, // Use the index as a unique ID for events
          text: "Arbeit",  // Event text, you can modify it if necessary
          start: new Date(arbeitszeit.StartTime).toISOString(),  // Convert start time to ISO string
          end: new Date(arbeitszeit.EndTime).toISOString(),  // Convert end time to ISO string
          tags: { progress: 60 },  // You can customize this as needed
        }));
        setEvents(data);  // Update the events state
      }
    };
    fetchTime();  // Fetch the work times on component mount
  }, []);

  return (
    <div>
      {/* Render the calendar with the fetched events */}
      <DayPilotMonth
        startDate={startDate}
        events={events}
      />
    </div>
  );
}

export default PflegerDash;
