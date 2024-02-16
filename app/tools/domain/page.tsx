import { redirect } from "next/navigation";

export default function Page({ params }: { params: { domain: string } }) {
  if (!params.domain) {
    redirect("/");
  }
}
