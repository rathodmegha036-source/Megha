"use server";

import { createClient } from "@/lib/supabase/server.js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache"

export async function logout() {
  console.log("Logging out");
  //Step 1 - create the supabase client
  const supabase = await createClient();
  //Step 2 - sign out the user
  await supabase.auth.signOut();
  //Step 3 - redirect to the login page
  redirect("/login");
}

export async function addNote(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = String(formData?.get?.('title') ?? '').trim()
  if (!title) throw new Error('Title is required')

  await supabase.from('notes').insert({
    title,
    user_id: user.id,
  })
}
export async function deleteNote(formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.user_metadata?.is_admin) {
    throw new Error("Not authorized")
  }

  const id = formData.get("id")

  await supabase.from("notes").delete().eq("id", id)
  revalidatePath("/dashboard")
}
