import { useAppSelector } from "../redux/hooks";
import { backendURL } from "../Components/constants";
import { useEffect, useState } from "react";
import LocationDisplay from "../Components/LocationDisplay";
import { CircularProgress } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import './Locations.css'
import LocationCreationModal from "../Components/LocationCreationModal";


const Locations = () => {
    
    const selectedWorld = useAppSelector((s) => s.world)
    const [nations, setNations] = useState([])
    const [provinces, setProvinces] = useState([])
    const [cities, setCities] = useState([])
    const [selectedNation, setSelectedNation] = useState<number>(0)
    const [selectedProvince, setSelectedProvince] = useState<number>(0)

    const [viewMode, setViewMode] = useState<'nations' | 'provinces' | 'cities'>('nations');
    const [showCreationModal, setShowCreationModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const user = useAppSelector((s) => s.user);

    const getNations = async () => {
        const response = await fetch(`${backendURL}/Location/Nations/${selectedWorld.id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        setNations(await response.json());
    }

    const getProvinces = async (selectedNation: number) => {
        setIsLoading(true);
        const response = await fetch(`${backendURL}/Location/Provinces/${selectedNation}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        setProvinces(await response.json());
        setIsLoading(false);
    }

    const getCities = async (selectedProvince: number) => {
        setIsLoading(true);
        const response = await fetch(`${backendURL}/Location/Cities/${selectedProvince}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        setCities(await response.json());
        setIsLoading(false);
    }

    const handleNationClick = (nationId: number) => {
        getProvinces(nationId);
        setSelectedNation(nationId);
        setViewMode('provinces');
    }

    const handleProvinceClick = (provinceId: number) => {
        getCities(provinceId);
        setSelectedProvince(provinceId);
        setViewMode('cities');
    }

    const handleBackClick = () => {
        if (viewMode === 'cities') {
            setViewMode('provinces');
        } else {
            setViewMode('nations');
        }
    }

    useEffect(() => {
        getNations();
    }, [selectedWorld.id]);

    return (
        <div className="locations-page-container">
            {viewMode != 'nations' && <div className="locations-breadcrumb">
                <button className="back-button" onClick={() => handleBackClick()}><ArrowBackIcon /></button>
            </div>}
            <button className="add-button" onClick={() => setShowCreationModal(true)}><AddIcon /></button>
            {viewMode === 'nations' &&
            <>
            <LocationCreationModal onClose={() => {setShowCreationModal(false)}} isShown={showCreationModal} variant='nation' parentId={selectedWorld.id}/>
            <h1>Nations</h1>
            {!isLoading && nations.length >= 1 ? (
            <div className="locations-grid">
                  {nations.map((nation: any) => (
                    <LocationDisplay
                        key={nation.id}
                        onClick={() => handleNationClick(nation.id)}
                        location={nation}
                        variant = 'Nation'
                        updatePage={getNations}
                    />
                ))}
            </div>
            ) : (
              <CircularProgress />
            )}
            </>}


            {viewMode === 'provinces' &&
            <>
            <LocationCreationModal onClose={() => {setShowCreationModal(false)}} isShown={showCreationModal} variant='province' parentId={selectedNation}/>
                <h1>Provinces</h1>
                {!isLoading && provinces.length >= 1 ? (
                <div className="locations-grid">
                  {provinces.map((province: any) => (
                    <LocationDisplay
                      key={province.id}
                      location={province}
                      onClick={() => handleProvinceClick(province.id)}
                      variant = 'Province'
                      updatePage={() => getProvinces(selectedNation)}
                    />
                  ))}
                </div>
                ) : (
                    <CircularProgress />
                )}
            </>}

            {viewMode === 'cities' &&
            <>
            <LocationCreationModal onClose={() => {setShowCreationModal(false)}} isShown={showCreationModal} variant='city' parentId={selectedProvince}/>
                <h1>Cities</h1>
                {!isLoading && cities.length >= 1 ? (
                <div className="locations-grid">
                  {cities.map((city: any) => (
                    <LocationDisplay key={city.id} location={city} onClick={() => {}} updatePage={() => getCities(selectedProvince)} variant='City'/>
                  ))}
                </div>
                ) : (
                    <CircularProgress />
                )}
            </>}
        </div>
    )
}

export default Locations