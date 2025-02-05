import { FilterSettingsInterface } from "../../../types/settingsType";
import { RxCross1 } from "react-icons/rx";


interface FilterItemPropsInterface {
    filter: FilterSettingsInterface;
    handleFilterUse: (filterString: string) => void;
    handleDeleteFilter: (filterId: number) => void;
}

export function SearchFilterItem ({ filter, handleFilterUse, handleDeleteFilter }: FilterItemPropsInterface) {
    return (
        <div className="flex justify-between gap-2 w-full border border-black rounded p-2 bg-gray-300">
            <button title={filter.filterString} onClick={() => handleFilterUse(filter.filterString)} className="cursor-pointer">{filter.filterName.length > 10 ? `${filter.filterName.substring(0, 10)}...` : filter.filterName}</button>
            <button onClick={() => handleDeleteFilter(filter.id)} className="bg-red-900 text-white hover:bg-white hover:text-red-900 cursor-pointer m-1 rounded transition-all"><RxCross1 size={20}/></button>
        </div>
    );
};