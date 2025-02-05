import { useContext, useState } from 'react';
import { BsBookmarkPlusFill } from "react-icons/bs";
import { CharDataContext } from '../../../context/CharDataContext';
import { SearchFilterItem } from './SearchFilterItem';
import { Modal } from '../../../global/Modal';


interface SearchFilterListPropsInterface {
    changeQuery: (query: string) => void;
}

export function SearchFilterList({ changeQuery }: SearchFilterListPropsInterface) {
    const { filterData, setFilterData } = useContext(CharDataContext);
    const [ showAddModal, setShowAddModal] = useState(false);

    function handleFilterUse(filterString: string) {
        changeQuery(filterString);
    };

    function handleNewFilter() {
        if(!window.confirm('Ajouter le filtre ?')){ return };
        const newFilter = {
            id : filterData[0] ? filterData[filterData.length - 1].id + 1: 0,
            filterName : (document.getElementById('new_filter_name') as HTMLInputElement).value,
            filterString : (document.getElementById('new_filter_input') as HTMLInputElement).value
        }

        setFilterData([...filterData, newFilter]);
        resetField();
    }

    function handleModalClose() {
        resetField();
        setShowAddModal(false);
    }

    function handleDeleteFilter (filterId: number) {
        if(!window.confirm('Supprimer le filtre ?')){ return };
        setFilterData(filterData.filter(filter => filter.id !== filterId));
        changeQuery('');
    }

    function resetField() {
        (document.getElementById('new_filter_name') as HTMLInputElement).value = '';
        (document.getElementById('new_filter_input') as HTMLInputElement).value = '';
    }

    return (
        <div className='flex flex-col gap-2 items-center'>
            <div>
                <button onClick={() => setShowAddModal(true)} title="Add Filtre" className='text-green-500 hover:text-white cursor-pointer transition-all'><BsBookmarkPlusFill size={32}/></button>
                {
                    (showAddModal)
                    ?   <Modal isOpen={showAddModal} onClose={() => handleModalClose()}>
                            <div className='flex flex-col gap-2'>
                                <h2 className='text-center font-bold'>Nouveau Filtre :</h2>
                                <input type="text" placeholder="Filter Name" defaultValue='' id="new_filter_name" className='input_field' />
                                <input type="text" placeholder="Filter Value" defaultValue='' id="new_filter_input" className='input_field' />
                                <div className='flex justify-around py-2'>
                                    <button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer' onClick={() => handleNewFilter()}>Ajouter</button>
                                    <button className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer' onClick={() => handleModalClose()}>Cancel</button>
                                </div>
                            </div>
                        </Modal>
                    : <></>
                }
            </div>
            <div className='flex flex-col text-black gap-2'>
                {
                    (filterData[0])
                    ?   filterData.map((filter, key) => {
                            return <SearchFilterItem
                                key={key}
                                filter={filter} 
                                handleFilterUse={(filterString: string) => handleFilterUse(filterString)} 
                                handleDeleteFilter={(filterId: number) => handleDeleteFilter(filterId)} />
                        })
                    : <></>
                }
            </div>
        </div>
    );
}