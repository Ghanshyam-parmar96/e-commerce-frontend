"use client";

export const clientData = async () => {
  const request = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const response = await request.json();
  console.log(response[0].name);
  return response;
};

// export default clientData;
