// TODO: This is not complete.
export async function DomainIcon({ domain }: { domain: string }) {
  try {
    const icon = await fetch(`https://icons.duckduckgo.com/ip3/${domain}.ico`, {
      method: 'GET',
    });
    console.log(icon);
  } catch (error) {
    console.error(`Fetch error: ${error}`);
    return error;
  }
}
