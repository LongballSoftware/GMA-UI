import { useEffect, useState } from "react";
import { backendURL } from "../Components/constants";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import type { World } from "../redux/worldSlice";
import './Home.css'


const Home = () => {
  const [availableWorlds, setAvailableWorlds] = useState<World[] | null>(null)
  const selectedWorld = useAppSelector((s) => s.world);
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user);

    const getWorlds = async () => {
      const response = await fetch(`${backendURL}/Worlds`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      })
      setAvailableWorlds(await response.json());
    }

    useEffect(() => {
      getWorlds();
    }, [])

  return (
    <div className="home-container">
      <div className="home-card">
      <h1>Game Master Assistant</h1>
      <h3>Select a world</h3>
      <select className="home-select" value={selectedWorld ? selectedWorld.id : ''} onChange={(e) => {
        const worldId = Number(e.target.value);
        const world = availableWorlds?.find((w) => w.id === worldId) || null;
        dispatch({ type: 'world/setWorld', payload: world });
      }}>
        <option value={undefined}>-- Select a world --</option>
        {availableWorlds ? availableWorlds.map((world) => (
          <option key={world.id} value={world.id}>{world.name}</option>
        )) : (
          <option disabled>Loading worlds...</option>
        )}
      </select>
      </div>
    </div>
  )
}

export default Home