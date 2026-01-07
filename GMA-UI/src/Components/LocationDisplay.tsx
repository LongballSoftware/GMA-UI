import { Box, Stack, TextField } from "@mui/material"
import { backendURL, type WorldLocation } from "./constants"
import './LocationDisplay.css'
import { useState } from "react"
import { Edit } from "@mui/icons-material"
import { useAppSelector } from "../redux/hooks"


type Props = {
    onClick : () => void
    location: WorldLocation
    variant: 'Nation' | 'Province' | 'City'
    updatePage: () => void
}

const LocationDisplay = ({onClick, location, variant, updatePage} : Props) => {
    const [editMode, setEditMode] =  useState(false)
    const [newName, setNewName] = useState(location.name)
    const [newDescription, setNewDescription] = useState(location.description)
    const user = useAppSelector((s) => s.user);

    const saveResults = async () => {
        
        try {
            await fetch(`${backendURL}/Location/${variant}`, {
                method: 'PUT',
                body: JSON.stringify({id: location.id, name: newName, description: newDescription }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            });
        } catch (error) {
            console.error("Error saving location:", error);
        }
        setEditMode(false);
        updatePage();
    }

    return (
        <>
            {!editMode && <Box className='nationCard' onClick={onClick}>
                <Edit onClick={(e: MouseEvent) => { e.stopPropagation(); setEditMode(true); }} />
                <h3>{location.name}</h3>
                <p>{location.description}</p>
            </Box>}
            {editMode && <Box className='nationCard'>
                <TextField fullWidth defaultValue={location.name} onChange={(event) => setNewName(event.target.value)}/>
                <TextField fullWidth multiline minRows={2} maxRows={6} defaultValue={location.description} onChange={(event) => setNewDescription(event.target.value)}/>
                <Stack direction="row" justifyContent='space-between' marginTop={2}>
                <button onClick={() => setEditMode(false)}>Cancel</button>
                <button onClick={saveResults}>Save</button>
                </Stack>
            </Box>}
        </>
    )
}

export default LocationDisplay