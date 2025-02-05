import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DataContextProvider } from './context/DataContextProvider';
import { FileMenu } from './pages/Files/FileMenu';
import { CreateChar } from './pages/Create/CreateChar';
import { FightList } from './pages/Fight/FightList';
import { CharList } from './pages/CharList/CharList';
import Layout from './Layout';
import Error from './utils/Error';

export function AppRouter () {
  return (
    <DataContextProvider>
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                <Route index element={<FileMenu />} />

                <Route path="file" element={<FileMenu />} />
                <Route path="create" element={<CreateChar />} />
                <Route path="list" element={<CharList />} />
                <Route path="fight" element={<FightList />} />

                <Route path='*' element={<Error />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </DataContextProvider>
  )
}