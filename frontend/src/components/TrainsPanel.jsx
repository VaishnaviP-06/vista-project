import React from "react";

export default function TrainsPanel({
  srcStation,
  destStation,
  stationsData,
  mockTrains,
  onSelectTrain
}) {

  // 🔥 GET PLATFORM FROM STATION DATA
  const getPlatform = (stationName, direction) => {
    if (!stationsData) return [];

    const station = stationsData.find(
      s => s.name.toLowerCase() === stationName.toLowerCase()
    );

    if (!station) return [];

    return direction === "southbound"
      ? station.platforms.towards_churchgate
      : station.platforms.towards_virar;
  };

  // 🔥 DETERMINE DIRECTION
  const getDirection = () => {
    if (!srcStation || !destStation) return "southbound";

    const order = [
      "Virar","Nalasopara","Vasai Road","Naigaon",
      "Bhayandar","Mira Road","Dahisar","Borivali"
    ];

    const srcIndex = order.indexOf(srcStation.name);
    const destIndex = order.indexOf(destStation.name);

    return destIndex > srcIndex ? "southbound" : "northbound";
  };

  const direction = getDirection();
  const platforms = getPlatform(srcStation?.name, direction);

  const platformText = platforms.length
    ? platforms.join(" / ")
    : "—";

  return (
    <div>
      <h3>Available Trains</h3>

      {mockTrains.map((train, i) => (
        <div
          key={i}
          onClick={() => onSelectTrain(train)}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          <h4>{train.name}</h4>
          <p>Type: {train.type}</p>
          <p>Platform: {platformText}</p>
        </div>
      ))}
    </div>
  );
}