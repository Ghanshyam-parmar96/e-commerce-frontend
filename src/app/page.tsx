import fetcher from "@/hooks/fetcher";
import { getToken } from "@/lib/useAuth";
import Link from "next/link";

const Home = async () => {
  const token = getToken();
  const response = await fetcher("user/me", token);

  return (
    <div>
      <h1>Welcome! to Home</h1>
      <h2>{response?.data?.fullName}</h2>
      <Link
        className="py-2, px-4 m-5 border border-black"
        href="/dashboard"
      >
        Dashboard
      </Link>
      <h1>Welcome, {response?.data?.fullName}!</h1>
      <p>Your email: {response?.data?.email}</p>
      <p>Your role: {response?.data?.isAdmin ? "Admin" : "User"}</p>
    </div>
  );
};

export default Home;
