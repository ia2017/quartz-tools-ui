export async function getTokenStorageData<T>(coinGeckoId: string): Promise<T> {
  let data = localStorage.getItem(coinGeckoId);
  if (data) {
    data = JSON.parse(data);
  }

  return data as unknown as T;
}

export async function setTokenStorageData<T>(
  coinGeckoId: string,
  data: T,
): Promise<T> {
  localStorage.setItem(coinGeckoId, JSON.stringify(data));
  return data as unknown as T;
}
