import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const generateMonthlyCourts = () => {
  const locations = ["Las Palmeras Güimar 2.0", "Tecnisur", "360º Padel Indoor"];
  const times = ["18:00", "18:30", "20:00"];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return months.flatMap((month) => {
    const dates = getMondaysTuesdaysWednesdays(month);
    return dates.map((date, index) => ({
      id: `${month}-${index}`,
      month,
      date: date.toLocaleDateString("es-ES", { weekday: 'long', day: '2-digit', month: 'long' }),
      time: times[index % 3],
      location: locations[index % 3],
      spots: 4,
      players: [],
      pairs: "",
      result: ""
    }));
  });
};

const getMondaysTuesdaysWednesdays = (month) => {
  const year = new Date().getFullYear();
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  let dates = [];
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 1 || d.getDay() === 2 || d.getDay() === 3) {
      dates.push(new Date(d));
    }
  }
  return dates;
};

const playersList = ["Alejandra", "Ana", "Andrea", "Araceli", "Daile", "Elsa", "Jesi", "Laura", "Leti", "Lucía", "María", "Mónica", "Patri", "Piluqui", "Rocío", "Sara H.", "Sara V.", "Susana", "Invitad@ 1", "Invitad@ 2", "Invitad@ 3"];

export default function PadelBookingApp() {
  const [courts, setCourts] = useState(generateMonthlyCourts());
  const [name, setName] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const primaryGreen = "#B0C800";

  const handleJoin = (courtId) => {
    setCourts(prevCourts =>
      prevCourts.map(court =>
        court.id === courtId && court.players.length < court.spots
          ? { ...court, players: [...court.players, name] }
          : court
      )
    );
  };

  const handleLeave = (courtId) => {
    setCourts(prevCourts =>
      prevCourts.map(court =>
        court.id === courtId
          ? { ...court, players: court.players.filter(player => player !== name) }
          : court
      )
    );
  };

  const handleResult = (courtId, field, value) => {
    setCourts(prevCourts =>
      prevCourts.map(court =>
        court.id === courtId ? { ...court, [field]: value } : court
      )
    );
  };

  return (
    <div className="p-4 max-w-xl mx-auto rounded-lg shadow-md" style={{ backgroundColor: primaryGreen }}>
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Pistas fijas Las Palmeras Fem. A</h1>
      <select
        className="w-full p-2 mb-4 border rounded bg-white text-black"
        value={name}
        onChange={(e) => setName(e.target.value)}
      >
        <option value="">Selecciona tu nombre</option>
        {playersList.map((player) => (
          <option key={player} value={player}>{player}</option>
        ))}
      </select>
      <select
        className="w-full p-2 mb-4 border rounded bg-white text-black"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(Number(e.target.value))}
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <option key={month} value={month}>{new Date(2024, month - 1).toLocaleString('es-ES', { month: 'long' })}</option>
        ))}
      </select>
      <div className="space-y-4">
        {courts.filter(court => court.month === selectedMonth).map((court) => (
          <motion.div key={court.id} whileHover={{ scale: 1.02 }}>
            <Card className={`${court.players.length === court.spots ? 'bg-[#C59AC4]' : 'bg-white'} border-2 border-black`}>
              <CardContent className="p-4">
                <p className="text-lg font-semibold text-black">
                  📅 {court.date} - ⏰ {court.time} - 📍 {court.location}
                </p>
                <p className="text-sm text-pink-600 font-bold">
                  Plazas disponibles: {court.spots - court.players.length}
                </p>
                <ul className="mt-2">
                  {court.players.map((player, index) => (
                    <li key={index} className="text-sm text-black">
                      {player}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
