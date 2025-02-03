import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FileContextProvider from './context/FileContextProvider';
import FileMenu from './pages/Files/FileMenu';
import CreateChar from './pages/Create/CreateChar';
import FightingCalc from './pages/Fight/FightingCalc';
import Layout from './Layout';
import Error from './utils/Error';
import CharList from './pages/CharList/CharList';

const AdminRouter = () => {
  return (
    <FileContextProvider>
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                <Route index element={<FileMenu />} />

                <Route path="file" element={<FileMenu />} />
                <Route path="create" element={<CreateChar />} />
                <Route path="list" element={<CharList />} />
                <Route path="fight" element={<FightingCalc />} />

                <Route path='*' element={<Error />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </FileContextProvider>
  )
}

export default AdminRouter