"use client";
import BP from "./BP";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Template() {
  const [selected, setSelected] = useState([false, false]);
  const [typeSelected, setTypeSelected] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [pageId, setPageId] = useState<string | null>(null); // Store the ID of the existing record

  // Load the existing record for the user when the component mounts
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user) {
          setError("You are not authenticated. Please log in.");
          return;
        }

        // Fetch an existing record for the user
        const { data, error } = await supabase
          .from("editable_page")
          .select("id, type")
          .eq("user_id", userData.user.id)
          .single(); // Assume a single record per user

        if (error) {
          setError("Error loading the page: " + error.message);
          return;
        }

        if (data) {
          setPageId(data.id); // Save the record ID
          setTypeSelected(data.type); // Load the current type
          setSelected(data.type === "col" ? [true, false] : [false, true]); // Update selection
        }
      } catch (err) {
        setError("Unexpected error: " + err);
      }
    };

    fetchPage();
  }, []);

  const handleClick = (index: number, type: string) => {
    const update = [false, false];
    update[index] = true;
    setSelected(update);
    setTypeSelected(type);
  };

  // Function to update typeSelected in Supabase
  const handleSave = async () => {
    if (!typeSelected) {
      setError("Please select a type (col or row).");
      return;
    }

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setError("You are not authenticated. Please log in.");
        return;
      }

      if (!pageId) {
        // If no existing record, create a new one
        const { data, error } = await supabase
          .from("editable_page")
          .insert([
            {
              user_id: userData.user.id,
              link: `page-${Date.now()}`, // Generate a unique link based on timestamp
              content: "This text is by default. You should edit it.",
              type: typeSelected,
            },
          ])
          .select()
          .single();

        if (error) {
          setError("Error creating the page: " + error.message);
          return;
        }

        setPageId(data.id); // Save the ID of the new record
        setSuccess(true);
        setError(null);
        console.log("Page created:", data);
      } else {
        // If an existing record is found, update it
        const { data, error } = await supabase
          .from("editable_page")
          .update({ type: typeSelected })
          .eq("id", pageId)
          .eq("user_id", userData.user.id) // Ensure only the owner can update
          .select()
          .single();

        if (error) {
          setError("Error updating the page: " + error.message);
          return;
        }

        setSuccess(true);
        setError(null);
        console.log("Page updated:", data);
      }
    } catch (err) {
      setError("Unexpected error: " + err);
    }
  };

  return (
    <>
      <div className="w-[100%] h-screen flex flex-col items-center justify-center gap-5">
        <div className="w-full flex items-center justify-center gap-5">
          <BP
            onClick={() => handleClick(0, "col")}
            Type="col"
            className={`${
              selected[0] ? "border-green-200" : "border-gray-300"
            }`}
          />
          <BP
            onClick={() => handleClick(1, "row")}
            Type="row"
            className={`${
              selected[1] ? "border-green-200" : "border-gray-300"
            }`}
          />
        </div>
        <div>
          <Button onClick={handleSave} className="cursor-pointer">
            Next
          </Button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Page saved successfully!</p>}
      </div>
    </>
  );
}
