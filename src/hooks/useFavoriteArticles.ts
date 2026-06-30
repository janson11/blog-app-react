import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "blog.favoriteArticleIds";

function readFavoriteIds() {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return [];

    const parsedValue = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) return [];

    return parsedValue.filter((id): id is number => Number.isInteger(id));
  } catch {
    return [];
  }
}

function useFavoriteArticles() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(readFavoriteIds);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  function toggleFavorite(articleId: number) {
    setFavoriteIds((currentIds) => {
      if (currentIds.includes(articleId)) {
        return currentIds.filter((id) => id !== articleId);
      }

      return [...currentIds, articleId];
    });
  }

  return {
    favoriteIds,
    favoriteIdSet,
    toggleFavorite,
  };
}

export default useFavoriteArticles;
