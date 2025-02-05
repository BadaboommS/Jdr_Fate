export interface SettingsInterface{
    filter: FilterSettingsInterface
}

export const DEFAULT_SETTINGS: SettingsInterface = { 
    filter: {} as FilterSettingsInterface
};

export interface FilterSettingsInterface {
    id: number,
    filterName: string,
    filterString: string,
}