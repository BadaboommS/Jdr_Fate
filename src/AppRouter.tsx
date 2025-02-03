import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FileContextProvider from './context/FileContextProvider';
import Layout from './Layout';
import FileImport from './pages/Files/FileImport';
import CreateChar from './pages/Create/CreateChar';
import FightingCalc from './pages/Fight/FightingCalc';
import Error from './utils/Error';

const AdminRouter = () => {
  return (
    <FileContextProvider>
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                <Route index element={<FileImport />} />

                <Route path="file" element={<FileImport />} />
                <Route path="create" element={<CreateChar />} />
                <Route path="fight" element={<FightingCalc />} />

                <Route path='*' element={<Error />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </FileContextProvider>
  )
}

export default AdminRouter