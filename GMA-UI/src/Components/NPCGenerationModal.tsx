import TextField from "@mui/material/TextField";
import { backendURL } from "./constants";
import { useEffect, useState } from "react";
import { Box, Checkbox, CircularProgress, Collapse, FormControlLabel, FormGroup, IconButton } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './NPCGenerationModal.css'
import { useAppSelector } from "../redux/hooks";

type Props = {
  closeModal: () => void
  variant: string
}

const NPCGenerationModal = ({closeModal, variant} : Props) => {

    const [givenPrompt, setGivenPrompt] = useState("")
    const [npcList, setNPCList] = useState<any[]>([])
    const [selectedNPCs, setSelectedNPCs] = useState<number[]>([])
    const [showRelatedNPCs, setShowRelatedNPCs] = useState(false)
    const [customName, setCustomName] = useState("")
    const [customOccupation, setCustomOccupation] = useState("")
    const [customDescription, setCustomDescription] = useState("")
    const [customAppearance, setCustomAppearance] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const user = useAppSelector((s) => s.user);

    const getNPCList = async (worldId: number) => {
        const response = await fetch(`${backendURL}/NPC?worldId=${worldId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        });
        const data = await response.json();
        setNPCList(data);
    }

    useEffect(() => {
        getNPCList(3);
    }, []);

    const toggleSelectedNPC = (id: number) => {
        setSelectedNPCs(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    }

    const postNPC = async () => {
        const response = await fetch(`${backendURL}/NPC/ManualNPC`, {
            method: 'POST',
            body: JSON.stringify({
                worldId: 3,
                name: customName,
                occupation: customOccupation,
                description: customDescription,
                appearance: customAppearance,
                relatedNPCs: selectedNPCs
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        });

        if (response.ok) {
                alert('NPC Generated');
            }

        closeModal();
    }

    const generateCustomNPC = async (worldId: number, userPrompt: string) => {
        setIsLoading(true);
        const response = await fetch(`${backendURL}/NPC`, {
            method: 'POST',
            body: JSON.stringify({ worldId: worldId, relatedNPCs: selectedNPCs, userPrompt: userPrompt}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
        });
    
        if (response.ok) {
            alert('NPC Generated');
        }
        setIsLoading(false);
        closeModal();
        }

    return (
        <>
        {isLoading ? (
            <CircularProgress />
        ) : (
            <Box className="npc-generation-modal" sx={{ display: 'flex', flexDirection: 'column', p: 3, borderRadius: 2, boxShadow: 24, width: 'min(900px, 95%)', maxHeight: '90vh' }}>
            <h3>NPC Generation</h3>
            <div className="modal-body">
            {variant === "generated" && (
            <>
            <div className="npc-prompt">
                <TextField className="npc-textfield" label="Description" multiline rows={4} value={givenPrompt} onChange={(event) => setGivenPrompt(event.target.value)} />
            </div>
            </>
            )}
            {variant === "manual" && (
                <div>
                <TextField className="npc-textfield" label="Name" fullWidth margin="normal" value={customName} onChange={(event) => setCustomName(event.target.value)} />
                <TextField className="npc-textfield" label="Occupation" fullWidth margin="normal" value={customOccupation} onChange={(event) => setCustomOccupation(event.target.value)} />
                <TextField className="npc-textfield" label="Description" fullWidth margin="normal" multiline rows={4} value={customDescription} onChange={(event) => setCustomDescription(event.target.value)} />
                <TextField className="npc-textfield" label="Appearance" fullWidth margin="normal" multiline rows={4} value={customAppearance} onChange={(event) => setCustomAppearance(event.target.value)} />
                </div>
            )}
            {npcList.length > 0 && (
                <>
                <div className="related-header">
                        <h4 style={{margin: 0}}>Add Related NPCs</h4>
                        <IconButton
                            onClick={() => setShowRelatedNPCs(prev => !prev)}
                            aria-expanded={showRelatedNPCs}
                            aria-label="toggle related npcs"
                            size="small"
                            className={`expand-icon ${showRelatedNPCs ? 'expanded' : ''}`}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </div>
                <Collapse in={showRelatedNPCs} className="related-list">
                    <FormGroup>
                        {npcList.map((npc: any) => (
                            <FormControlLabel
                                key={npc.id}
                                control={
                                    <Checkbox
                                        checked={selectedNPCs.includes(npc.id)}
                                        onChange={() => toggleSelectedNPC(npc.id)}
                                    />
                                }
                                label={`${npc.name} - ${npc.occupation}`}
                            />
                        ))}
                    </FormGroup>
                </Collapse>
                </>
            )}
            </div>
            <div className="actions">
                {variant === "generated" && <button className="generate-button" onClick={async () => {await generateCustomNPC(3, givenPrompt)}}>Generate NPC</button>}
                {variant === "manual" && <button className="generate-button" onClick={async () => {await postNPC()}}>Create NPC</button>}
            </div>
        </Box>)}
        </>
    )
}

export default NPCGenerationModal;