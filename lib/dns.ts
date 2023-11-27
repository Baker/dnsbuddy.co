export const getDnsData = async (
  query: string,
  record_type: string,
  dns_url: string
) => {
  try {
    const response = await fetch(
      `${dns_url}?name=${query}&type=${record_type}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/dns-json',
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Error! status=${response.status} provider=${dns_url} query=${query}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Fetch error: ${error}`);
    return error;
  }
};
