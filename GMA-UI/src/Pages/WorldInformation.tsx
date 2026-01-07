import { useEffect, useState } from "react";
import { backendURL, type WorldFact, type WorldInfo } from "../Components/constants";
import './WorldInformation.css'
import { CircularProgress, Modal, Stack, TextField } from "@mui/material";
import WorldFactDisplay from "../Components/WorldFact";
import { useAppSelector } from "../redux/hooks";
import { Add } from "@mui/icons-material";

const WorldInformation = () => {
    const selectedWorld = useAppSelector((s) => s.world);
    const [worldInfo, setWorldInfo] = useState<WorldInfo>()
    const [worldFacts, setWorldFacts] = useState<WorldFact[]>([])
    const [showNewFactModal, setShowNewFactModal] = useState(false)
    const [newFact, setNewFact] = useState('')
    const user = useAppSelector((s) => s.user);

    const fetchWorldInfo = async () => {
        const response = await fetch(`${backendURL}/Worlds/${selectedWorld.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        setWorldInfo(await response.json())
    }

    const fetchWorldFacts = async () => {
        const response = await fetch(`${backendURL}/Worlds/WorldFacts?worldId=${selectedWorld.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        setWorldFacts(await response.json())
    }

    const postWorldFact = async (factDescription: string) => {
        try {
        await fetch(`${backendURL}/Worlds/WorldFact`, {
            method: 'POST',
            body: JSON.stringify({ worldId: selectedWorld.id, description: factDescription }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        });
        } catch (error) {
            console.error("Error posting world fact:", error);
        }
        fetchWorldFacts();
    }

    const handleSaveFact = async () => {
        await postWorldFact(newFact);
        setShowNewFactModal(false);
        setNewFact('');
    }

    useEffect(() => {
        fetchWorldInfo();
        fetchWorldFacts();
    }, [selectedWorld.id])

    
    return (
        <div className="world-information-container">
            <Modal className='add-fact-modal' open={showNewFactModal} onClose={() => setShowNewFactModal(false)}>
                <div className="add-fact-modal-content">
                <TextField onChange={(event) => setNewFact(event.target.value)} label="Fact Description" multiline rows={2} fullWidth />
                    <Stack direction="row" justifyContent="space-between" marginTop={2}>
                        <button className="modal-button" onClick={() => setShowNewFactModal(false)}>Cancel</button>
                        <button className="modal-button" onClick={handleSaveFact}>Save</button>
                    </Stack>
                </div>
            </Modal>
            <h1>World Information</h1>
            {worldInfo ? (
                <div>
                    <h2>{worldInfo.name}</h2>
                    <p>{worldInfo.description}</p>
                    <p><strong>System:</strong> {worldInfo.system}</p>
                    <p><strong>Genre:</strong> {worldInfo.genre}</p>
                    <p><strong>Owner:</strong> {worldInfo.owner}</p>
                </div>
            ) : (
                <CircularProgress />
            )}
            <div className="facts-card">
            <div className="facts-header">
                <h2>World Facts</h2>
                <button onClick={() => setShowNewFactModal(true)} className="add-button"><Add /></button>
            </div>
            {worldFacts.length > 0 ? (
                <ul>
                    {worldFacts.map((fact) => (
                        <>
                        <WorldFactDisplay getFacts={fetchWorldFacts} fact={fact.description} factId={fact.id} />
                        </>
                    ))}
                </ul>
            ) : (
                <CircularProgress />
            )}
            </div>
        </div>
    )
}

export default WorldInformation