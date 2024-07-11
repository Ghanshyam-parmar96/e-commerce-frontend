import Link from "next/link";

const Dashboard = async () => {
  const request = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const response = await request.json();
  return (
    <div>
      <h1>dashboard</h1>
      <h2>Welcome, {response[0].name}!</h2>
      <Link
        className="py-2, px-4 m-5 border border-black"
        href="/"
      >
        Home
      </Link>
    </div>
  );
};

export default Dashboard;
