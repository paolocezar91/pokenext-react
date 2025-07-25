export default class BaseQuery {
  protected apiUrl: string;

  constructor(api: string = process.env.POKEAPI_URL as string) {
    this.apiUrl = api;
  }

  getURL = async <T>(url: string) => {
    return await this._getUrl(`${this.apiUrl}${url}`) as T;
  };

  postURL = async <T>(url: string, body: Record<string, unknown>) => {
    return await this._postUrl(`${this.apiUrl}${url}`, body) as T;
  };

  private _getUrl = async (url: string) => {
    try {
      const data = await fetch(url, {
        cache: 'force-cache'
      });

      if (data.status === 200) {
        const json = await data.json();
        return json;
      }
      throw { status: 404, text: data.statusText };
    } catch (error) {
      console.log({ error });
      throw { error };
    }
  };

  private _postUrl = async <T>(url: string, body: Record<string, unknown>) => {
    try {
      const data = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!data.ok) {
        throw new Error("Invalid credentials");
      }
      const json = await data.json();
      return json as T;
      // Handle success (e.g., redirect)
    } catch (err: unknown) {
      throw err;
    }
  };

  protected cleanParams = (params: Record<string, string>) => {
    Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);
    return params;
  };
}
