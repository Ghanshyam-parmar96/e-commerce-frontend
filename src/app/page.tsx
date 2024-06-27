"use client";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function Home() {
  return <Button onClick={() => toast.success("done")}> Click Me </Button>;
}
