import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import "./App.css"
import Home from "./Pages/Home"
import Characters from "./Pages/Characters"
import Drawer from "@mui/material/Drawer"
import { Box, Stack } from "@mui/material"
import WorldInformation from "./Pages/WorldInformation"
import { useAppSelector } from "./redux/hooks"
import Locations from "./Pages/Locations"
import Login from "./Pages/Login"



const Router = () => {
    const selectedWorld = useAppSelector((s) => s.world);
    const user = useAppSelector((s) => s.user);

    return (
        <BrowserRouter>
        {user.username !== '' && selectedWorld.id !== 0 &&
        <>
        <Drawer variant="permanent"
          anchor="left"
          sx={{
            width: '250px',
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                width: '250px',
                boxSizing: 'border-box'
            }
            }}>
            <div className="nav-drawer">
                <div className="nav-brand">GM Assistant</div>
                <Stack direction='column' spacing={0} marginBottom={4}>
                    <Box className="nav-item">
                        <Link to='/world'>World Home</Link>
                    </Box>
                     <Box className="nav-item">
                        <Link to='/characters'>Characters</Link>
                    </Box>
                    <Box className="nav-item">
                        <Link to='/locations'>Locations</Link>
                    </Box>
                    <Box className="nav-item">
                        <Link to='/world-selection'>World Selection</Link>
                    </Box>
                    
                </Stack>
                <li></li>
                <li></li>
                <li></li>
            </div>
        </Drawer>
            <div className="contentWindow" style={{ marginLeft: '250px', width: 'calc(100% - 250px)', minHeight: '100vh', padding: 0, boxSizing: 'border-box', overflowX: 'hidden' }}>
            <Routes>
                <Route path="/" element={<WorldInformation />} />
                <Route path="/characters" element={<Characters />} />
                <Route path="/world" element={<WorldInformation />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/world-selection" element={<Home />} />
            </Routes>
            </div>
        </>
        }
        {user.username !== '' && selectedWorld.id === 0 &&
        <>
            <Routes>
                <Route path="/*" element={<Home />} />
            </Routes>
        </>
        }
        {user.username === '' &&
        <>
            <Routes>
                <Route path="/*" element={<Login />} />
            </Routes>
        </>
        }
        </BrowserRouter>
    )
}

export default Router