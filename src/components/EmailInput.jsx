import { useState } from "react";

const domains = ["gmail.com", "yahoo.com", "outlook.com"];

export default function EmailInput({
  to,
  setTo,
  cc,
  setCc,
  bcc,
  setBcc,
}) {
  const [inputs, setInputs] = useState({
    to: "",
    cc: "",
    bcc: "",
  });

  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const [activeField, setActiveField] = useState("to");

  // Get emails for current field
  const getEmails = (field) => {
    if (field === "to") return to;
    if (field === "cc") return cc;
    if (field === "bcc") return bcc;

    return [];
  };

  // Set emails for current field
  const setEmails = (field, value) => {
    if (field === "to") setTo(value);
    if (field === "cc") setCc(value);
    if (field === "bcc") setBcc(value);
  };

  // Current input
  const input = inputs[activeField];

  // Update current input
  const handleInputChange = (value) => {
    setInputs((prev) => ({
      ...prev,
      [activeField]: value,
    }));
  };

  // Add email
  const addEmail = () => {
    const email = input.trim();

    if (!email) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return;
    }

    // Duplicate check
    if (getEmails(activeField).includes(email)) {
      handleInputChange("");
      return;
    }

    setEmails(activeField, [
      ...getEmails(activeField),
      email,
    ]);

    handleInputChange("");
  };

  // Keyboard
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
  };

  // Domain suggestion
 const selectDomain = (domain) => {
    const username = input.split("@")[0];

    const email = `${username}@${domain}`;

    // Check duplicate
    if (getEmails(activeField).includes(email)) {
        handleInputChange("");
        return;
    }

    // Add email to current field
    setEmails(activeField, [
        ...getEmails(activeField),
        email
    ]);

    // Clear input → suggestion disappears
    handleInputChange("");
};

  // Remove email
  const removeEmail = (field, index) => {
    const emails = getEmails(field);

    setEmails(
      field,
      emails.filter((_, i) => i !== index)
    );
  };

  // Render field
  const renderField = (field, label, emails) => {
    return (
      <div className="flex gap-2 border-b-2 min-h-10 items-center border-gray-400 text-xl">
        <h1 className="text-gray-400">{label}:</h1>

        <div className="flex flex-wrap gap-2 flex-1">

          {emails.map((email, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-gray-200 rounded-full px-3 py-1 text-sm"
            >
              <span>{email}</span>

              <button
                type="button"
                onClick={() => removeEmail(field, index)}
                className="text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}

          <input
            type="text"
            value={activeField === field ? input : ""}
            onChange={(e) => {
              setActiveField(field);
              handleInputChange(e.target.value);
            }}
            onFocus={() => setActiveField(field)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-[150px] focus:outline-0"
            placeholder={emails.length === 0 ? "Enter email" : ""}
          />

        </div>

        {field === "to" && (
          <div className="flex gap-2">

            {!showCc && (
              <p
                className="hover:underline cursor-pointer"
                onClick={() => {
                  setShowCc(true);
                  setActiveField("cc");
                }}
              >
                Cc
              </p>
            )}

            {!showBcc && (
              <p
                className="hover:underline cursor-pointer"
                onClick={() => {
                  setShowBcc(true);
                  setActiveField("bcc");
                }}
              >
                Bcc
              </p>
            )}

          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">

      {/* TO */}
      {renderField("to", "To", to)}

      {/* CC */}
      {showCc && renderField("cc", "Cc", cc)}

      {/* BCC */}
      {showBcc && renderField("bcc", "Bcc", bcc)}

      {/* SUGGESTIONS */}
      {input.includes("@") && (
        <div className="absolute top-full left-0 z-50 mt-1 rounded-lg border bg-white shadow-lg">

          {domains
            .filter((domain) => {
              const typedDomain = input.split("@")[1] || "";

              return domain.startsWith(
                typedDomain.toLowerCase()
              );
            })
            .map((domain) => (
              <div
                key={domain}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectDomain(domain);
                }}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              >
                {input.split("@")[0]}@{domain}
              </div>
            ))}

        </div>
      )}

    </div>
  );
}