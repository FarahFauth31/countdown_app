import React, { useState, useEffect } from 'react';
import './App.css';

const plantStages = require.context('./plant_stages', true);
const plantStagesImages = plantStages.keys().map(image => plantStages(image));

function App() {
  const birthday = new Date('2025-02-12T00:00:00');
  const [timeLeft, setTimeLeft] = useState({});
  const [plantGrowth, setPlantGrowth] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = birthday - now;

      if (diff <= 0) {
        if (diff > -(24*60*60*1000)) { //milliseconds in a day
          setTimeLeft({message: 'Happy Birthday my love!'});
        }
        else {
          setTimeLeft({message: ' '});
        }
        setPlantGrowth(8);
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({days, hours, minutes, seconds});

      if (days >= 6) setPlantGrowth(1);
      else if (days === 5) setPlantGrowth(2);
      else if (days === 4) setPlantGrowth(3);
      else if (days === 3) setPlantGrowth(4);
      else if (days === 2) setPlantGrowth(5);
      else if (days === 1) setPlantGrowth(6);
      else if (days === 0) setPlantGrowth(7);
      else if (days < 0) setPlantGrowth(8);
    }, 1000);

    return () => clearInterval(interval);
  }, [birthday]);

  return (
    <div className="App">
      <br/>
      <br/>
      <h2>
        {timeLeft.message ||
          `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}
      </h2>
      <div className="image-container">
        <img src={plantStagesImages[plantGrowth - 1]} alt={`plant_stage${plantGrowth}`} />
      </div>
    </div>
  );
}

export default App;
