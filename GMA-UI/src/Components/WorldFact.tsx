import { useState } from "react"
import { backendURL } from "./constants"
import { Stack, TextField } from "@mui/material"
import { useAppSelector } from "../redux/hooks"

type Props = {
  fact: string,
  factId: number,
  getFacts: () => void
}

const worldFact = ({fact, factId, getFacts} : Props) => {
    const [editedFact, setEditedFact] = useState<string>(fact)
    const [editMode, setEditMode] = useState<boolean>(false)
    const user = useAppSelector((s) => s.user);

    const editFact = async () => {
        try {
        await fetch(`${backendURL}/Worlds/WorldFact/${factId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ id: factId, newDescription: editedFact }),
        });
        } catch (error) {
            console.error('Error updating fact:', error);
        }

        getFacts();
        setEditMode(false);
    }
    return (
        <div style={{ width: '100%', marginBottom: '10px' }}>
            {editMode ? (
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField variant='outlined' value={editedFact} onChange={(e) => setEditedFact(e.target.value)} fullWidth />
                    <button onClick={editFact}>Save</button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                </ Stack>
            ) : (
                <li onClick={() => setEditMode(true)} key={factId}>{fact}</li>
            )}
        </div>
    )
}

export default worldFact