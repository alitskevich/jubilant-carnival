export const FILTER_ADAPTER = (filters)=> {
    if (!filters) return {};

    filters.isActive = filters.isActive === 'all' ? undefined : true;

    return filters;

};