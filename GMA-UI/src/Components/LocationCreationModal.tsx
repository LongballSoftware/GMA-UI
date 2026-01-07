import { Modal, TextField } from "@mui/material"
import { useState } from "react"
import { backendURL, type WorldLocation } from "./constants"
import './LocationCreationModal.css'
import { useAppSelector } from "../redux/hooks"

type Props = {
    variant: 'nation' | 'province' | 'city'
    onClose: () => void
    isShown: boolean
    parentId: number
}

const LocationCreationModal = ({variant, onClose, isShown, parentId} : Props) => {
    const [newLocation, setNewLocation] = useState<WorldLocation>({
        id: 0,
        parentId: parentId,
        name: '',
        description: ''
    })
    const user = useAppSelector((s) => s.user);

    const createLocation = async () => {
        switch (variant) {
            case 'nation':
                try {
                    await fetch(`${backendURL}/Location/Nation`, {
                    method: 'POST',
                    body: JSON.stringify({worldId: parentId, nationName: newLocation.name, description: newLocation.description}),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                });
                } catch (error) {
                    console.error("Error creating nation:", error);
                }
                break;
            case 'province':
                try {
                    await fetch(`${backendURL}/Location/Province`, {
                    method: 'POST',
                    body: JSON.stringify({nationId: parentId, provinceName: newLocation.name, description: newLocation.description}),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                });
                } catch (error) {
                    console.error("Error creating province:", error);
                }
                break;
            case 'city':
                try {
                    await fetch(`${backendURL}/Location/City`, {
                    method: 'POST',
                    body: JSON.stringify({provinceId: parentId, cityName: newLocation.name, description: newLocation.description}),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                });
                } catch (error) {
                    console.error("Error creating city:", error);
                }
                break;
        }
        setNewLocation({
        id: 0,
        parentId: parentId,
        name: '',
        description: ''
        });
        onClose();
        
    }

    return (
        <>
        {isShown && (
            <Modal open={isShown} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="location-creation-modal">
        <h1>Create {variant[0].toUpperCase() + variant.slice(1)}</h1>
        <div className="form-fields">
          <TextField label="Name" value={newLocation.name} onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })} />
          <TextField label="Description" value={newLocation.description} multiline rows={4} onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })} />
        </div>
        <div className="actions">
          <button className="secondary" onClick={onClose}>Cancel</button>
          <button className="primary" onClick={createLocation}>Create {variant}</button>
        </div>
      </div>
    </Modal>
        )}
        </>
    )
}

export default LocationCreationModal