import { useEffect, useState, type MouseEvent } from "react"
import { backendURL, type Character } from "../Components/constants"
import CharacterCard from "../Components/CharacterCard"
import './Characters.css'
import { CircularProgress, Menu, MenuItem, Modal } from "@mui/material";
import NPCGenerationModal from "../Components/NPCGenerationModal";
import { useAppSelector } from "../redux/hooks";
import { Add } from "@mui/icons-material";

const Characters = () => {
    const selectedWorld = useAppSelector((s) => s.world);
    const [characters, setCharacters] = useState([])
    const [openMenu, setOpenMenu] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showGenerationModal, setShowGenerationModal] = useState(false)
    const [showCreationModal, setShowCreationModal] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const user = useAppSelector((s) => s.user);

    const fetchCharacters = async () => {
        const response = await fetch(`${backendURL}/NPC?worldId=${selectedWorld.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        setCharacters(await response.json())
    }

    const generateRandomNPC = async () => {
        setIsGenerating(true);
        setOpenMenu(false);
        const response = await fetch(`${backendURL}/NPC`, {
            method: 'POST',
            body: JSON.stringify({ worldId: selectedWorld.id, relatedNPCs: [], userPrompt: "Make a random NPC" }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        });

        setIsGenerating(false);
        if (response.ok) {
            alert('Random NPC Generated');
        }
        fetchCharacters();
    }

    const handleMenuClick = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        setOpenMenu(true)
        setAnchorEl(event.currentTarget);
    }

    const handleModalClose = () => {
        setShowCreationModal(false);
        setShowGenerationModal(false);
        fetchCharacters();
    }

    useEffect(() => {
        fetchCharacters();
    }, [])

    return (
        <div className="characters-page-container">
            <Modal open={showGenerationModal} onClose={() => handleModalClose()} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <NPCGenerationModal closeModal={handleModalClose} variant='generated'/>
            </Modal>
            <Modal open={showCreationModal} onClose={() => handleModalClose()} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <NPCGenerationModal closeModal={handleModalClose} variant='manual'/>
            </Modal>
            <Modal open={isGenerating} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Modal>
            <h1>Characters</h1>
            <button className="add-button" onClick={(event) => handleMenuClick(event)}><Add /></button>
            <Menu anchorEl={anchorEl} open={openMenu} onClose={() => setOpenMenu(false)}>
                <MenuItem onClick={() => {setShowCreationModal(true); setOpenMenu(false);}}>
                    Create New NPC
                </MenuItem>
                <MenuItem onClick={async () => {await generateRandomNPC();}}>
                    Generate Random NPC
                </MenuItem>
                <MenuItem onClick={() => {setShowGenerationModal(true); setOpenMenu(false);}}>
                    Generate Custom NPC
                </MenuItem>
            </Menu>
            {characters.length === 0 ? (
                <CircularProgress />
            ) : (
            <div>
                {characters.map((character: Character) => (
                    <CharacterCard selectedCharacter={character} fetchCharacters={fetchCharacters}/>
                ))}
            </div>
            )}
        </div>
    )
}

export default Characters