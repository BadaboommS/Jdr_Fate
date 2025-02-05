import { useContext } from 'react';
import { DataContext } from '../../../context/DataContext';
import { SearchFilterItem } from './SearchFilterItem';
import { SearchFilterAdd } from './SearchFilterAdd';
import { TbZoomReset } from "react-icons/tb";

interface SearchFilterListPropsInterface {
    changeQuery: (query: string) => void;
}

export function SearchFilterList({ changeQuery }: SearchFilterListPropsInterface) {
    const { filterData, setFilterData } = useContext(DataContext);

    function handleFilterUse(filterString: string) {
        changeQuery(filterString);
    };

    function handleDeleteFilter (filterId: number) {
        if(!window.confirm('Supprimer le filtre ?')){ return };
        setFilterData(filterData.filter(filter => filter.id !== filterId));
        changeQuery('');
    }


    return (
        <div className='flex flex-col gap-2 items-center'>
            <div className='flex justify-around w-full'>
                <SearchFilterAdd />
                <span className='cursor-pointer text-black' title="Reset" onClick={() => changeQuery('')}><TbZoomReset size={32} /></span>
            </div>
            <div className='flex flex-col text-black gap-2'>
                {
                    (filterData[0])
                    ?   filterData.map((filter) => {
                            return <SearchFilterItem
                                key={`${filter.filterName}_${filter.filterString}`}
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