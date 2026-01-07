import './CharacterCard.css'
import type { Character } from "../Components/constants"
import { useState } from 'react'
import { Card, CardHeader, IconButton, Menu, MenuItem, Stack, TextField } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { backendURL } from '../Components/constants';
import { useAppSelector } from '../redux/hooks';


type Props = { selectedCharacter: Character, fetchCharacters: () => void }

const CharacterCard = ({selectedCharacter, fetchCharacters}: Props) => {
    const [editMode, setEditMode] =  useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [editedCharacter, setEditedCharacter] = useState<Character>(selectedCharacter); 
    const user = useAppSelector((s) => s.user);

    const handleMenuClick = (event: HTMLElement) => {
        setOpenMenu(!openMenu)
        setAnchorEl(event);
    }

    const handleDelete = async () => {
        const response = await fetch(`${backendURL}/NPC/${selectedCharacter.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        if (response.ok) {
            alert('Character deleted successfully');
        }
        fetchCharacters();
    }

    const handleSave = async () => {
        const response = await fetch(`${backendURL}/NPC`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(editedCharacter)})
        if (response.ok) {
            alert('Character updated successfully');
            setEditMode(false);
        } else {
            alert('Failed to update character');
        }
        fetchCharacters();
    }

  return (
    <Card className="baseCard">
        <CardHeader action={
            <IconButton onClick={(event) => handleMenuClick(event.currentTarget)}>
                <MoreVertIcon />
                <Menu open={openMenu} anchorEl={anchorEl}>
                    {!editMode && <MenuItem onClick={() => setEditMode(true)}>
                        Edit
                    </MenuItem>}
                    <MenuItem onClick={handleDelete}>
                        Delete
                    </MenuItem>
                </Menu>
            </IconButton>} 
            title={selectedCharacter.name} 
            subheader={selectedCharacter.occupation} 
            titleTypographyProps={{ component: 'h3' }}
            subheaderTypographyProps={{ component: 'p' }}
        />
        {editMode ? (
        <>
            <TextField label="Name" defaultValue={selectedCharacter.name} fullWidth margin="normal" onChange={(event) => setEditedCharacter({...editedCharacter, name: event.currentTarget.value})}/>
            <TextField label="Occupation" defaultValue={selectedCharacter.occupation} fullWidth margin="normal" onChange={(event) => setEditedCharacter({...editedCharacter, occupation: event.currentTarget.value})}/>
            <TextField label="Description" defaultValue={selectedCharacter.description} fullWidth margin="normal" multiline rows={4} onChange={(event) => setEditedCharacter({...editedCharacter, description: event.currentTarget.value})}/>
            <TextField label="Appearance" defaultValue={selectedCharacter.appearance} fullWidth margin="normal" multiline rows={4} onChange={(event) => setEditedCharacter({...editedCharacter, appearance: event.currentTarget.value})}/>
            <Stack direction="row" justifyContent='space-between' sx={{width: '100%'}}>
                <button onClick={() => setEditMode(false)}>Cancel</button>
                <button onClick={() => handleSave()}>Save</button>
            </Stack>
        </>
        ) : (
        <>
            <p>{selectedCharacter.description}</p>
            <p>{selectedCharacter.appearance}</p>
        </>
        )}
    </Card>
  )
}

export default CharacterCard