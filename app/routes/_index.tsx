import { requireUser } from "@/authSession.server";
import { type LoaderFunctionArgs, redirect } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);
  return redirect("/dash/links");
}
