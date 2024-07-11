interface FetcherData {
  success: boolean;
  message: string;
  data?: any;
  statusCode?: number;
}

const fetcher = async (
  url: string,
  cookie: string | null
): Promise<FetcherData> => {
  try {
    const request = await fetch(`${process.env.BACKEND_URI}/${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie ?? "",
      },
      credentials: "include",
    });

    const response: FetcherData = await request.json();

    if (!request.ok) {
      return {
        success: false,
        message: response.message,
        statusCode: response.statusCode,
      };
    }

    return response;
  } catch (error) {
    error = error;
    console.error("Login failed", error);
    throw error;
  }
};

export default fetcher;
