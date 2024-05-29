
export const useMySearch = () => {
  return (items, searchTerm, searchFields) => {
    return searchTerm === ''
      ? [...items]
      : items.filter((item) =>
        searchFields.some((term) =>
          item[term]
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
  }
};
