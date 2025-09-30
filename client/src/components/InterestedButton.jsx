import { useState } from "react";
import { toast } from "react-toastify";

export default function InterestedButton({ landlordEmail, currentUser, onSuccess }) {
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!currentUser || !landlordEmail) {
      toast.error("User or landlord info missing!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landlordEmail: landlordEmail,
          userName: currentUser.username || currentUser.name,
          userEmail: currentUser.email,
          message: "I am interested in your property for rent."
        }),
      });

      const data = await res.json();

      if (data.success) {
        setClicked(true);
        toast.success("Your interest has been sent to the owner!");
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.message || "Failed to send. Please try again.");
      }
    } catch (err) {
      console.error("Error sending interest:", err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        disabled={clicked || loading}
        onClick={handleClick}
        className={`px-4 py-2 rounded-lg ${
          clicked
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-slate-700 text-white hover:bg-slate-700"
        }`}
      >
        {loading ? "Sending..." : clicked ? "Interest Sent" : "I am Interested"}
      </button>
    </div>
  );
}
