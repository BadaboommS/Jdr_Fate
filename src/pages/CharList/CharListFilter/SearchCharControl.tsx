interface SearchPwdControlPropsInterface {
    changeQuery: (query: string) => void;
}

export function SearchCharControl({ changeQuery }: SearchPwdControlPropsInterface){
    return (
        <div className="p-2">
            <input
                type="text"
                onChange={(e) => changeQuery(e.target.value)}
                placeholder="Search"
                className='w-full p-2 text-lg border border-solid border-black border-collapse border-spacing-1 rounded text-black'
                id="search_control"
            />
        </div>
    );
}