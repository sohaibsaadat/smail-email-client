import { useEffect, useRef, useState } from "react";
import { createContext, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../axios/axios";
import { toast } from "react-toastify";
import { useNewEmail } from "../hooks/useNewEmail";

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
    
    const [emails, setEmails] = useState([]);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [checked, setChecked] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ Global refresh trigger
    const { newEmails } = useNewEmail();

    const location = useLocation();
    const navigate = useNavigate();


    // ✅ Handle new emails
    useEffect(() => {
        
        if (newEmails && newEmails.length > 0) {
            setEmails(prevEmails => {
                const existingIds = new Set(prevEmails.map(e => e.id));
                const emailsToAdd = newEmails.filter(e => !existingIds.has(e.id));
                
                if (emailsToAdd.length === 0) return prevEmails;
                
                const updated = [...emailsToAdd, ...prevEmails];
                
                // ✅ Force global refresh
                setRefreshTrigger(prev => prev + 1);
                
                return updated;
            });
        }
    }, [newEmails]);


    const getMail = async () => {
        try {
            const response = await api.get("/email/all");

            if (response.data.success) {
                setEmails(response.data.emails);

                
            }
        } catch (error) {
            console.log("❌ Error fetching emails:", error.response);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getMail();
            
        }
    }, []);


    // ✅ Helper functions
    const getSenderName = (email) => {
        if (!email || !email.sender) return 'Unknown';
        const firstName = email.sender.firstName || email.sender.firstname || '';
        const lastName = email.sender.lastName || email.sender.lastname || '';
        if (firstName || lastName) {
            return `${firstName} ${lastName}`.trim();
        }
        return email.sender.email || 'Unknown';
    };

    const formatEmailDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const isSameYear = date.getFullYear() === now.getFullYear();

        if (isToday) {
            return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        }
        if (isSameYear) {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        }
        return date.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "2-digit",
        });
    };
useEffect(() => {
}, [emails]);
    // ✅ All handlers
    const handleSelectEmail = (id) => {
        setSelectedEmails((prev) =>
            prev.includes(id)
                ? prev.filter((emailId) => emailId !== id)
                : [...prev, id]
        );
        setChecked(false);
    };

    const handleSelectAll = () => {
        let filteredEmails = [];
        switch (location.pathname) {
            case "/":
            case "/inbox":
                filteredEmails = emails.filter(e => e.folder === "Inbox");
                break;
            case "/starred":
                filteredEmails = emails.filter(e => e.is_starred);
                break;
            case "/sent":
                filteredEmails = emails.filter(e => e.folder === "Sent");
                break;
            case "/drafts":
                filteredEmails = emails.filter(e => e.folder === "Draft");
                break;
            case "/trash":
                filteredEmails = emails.filter(e => e.folder === "Trash");
                break;
            default:
                filteredEmails = emails;
        }

        const ids = filteredEmails.map((email) => email.id);
        const allSelected = ids.every((id) => selectedEmails.includes(id));

        if (allSelected) {
            setSelectedEmails([]);
            setChecked(false);
        } else {
            setSelectedEmails(ids);
            setChecked(true);
        }
    };

    const handleEmailClick = async (id) => {
        const path = location.pathname.split("/")[1] || "inbox";
        navigate(`/${path}/mail/${id}`);
    };

    const readMail = async (id) => {
        const path = location.pathname.split("/")[1] || "inbox";
        try {
            const res = await api.patch(`/email/read/${id}`);
            if (res.data.success) {
                setEmails((prevEmails) =>
                    prevEmails.map((email) =>
                        email.id === id ? { ...email, is_read: true } : email
                    )
                );
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            toast.error(error.message);
        }
        navigate(`/${path}/mail/${id}`);
    };

    const starredMail = async (id) => {
        try {
            const res = await api.patch(`/email/star/${id}`);
            if (res.data.success) {
                setEmails((prevEmails) =>
                    prevEmails.map((email) =>
                        email.id === id ? { ...email, is_starred: !email.is_starred } : email
                    )
                );
                setRefreshTrigger(prev => prev + 1);
                toast.info(res.data.is_starred ? "⭐ Email Starred" : "☆ Email Unstarred");
            }
        } catch (error) {
            console.log(error.response);
        }
    };

 const trashMail = async (ids) => {
    try {
        const emailIds = Array.isArray(ids) ? ids : [ids];

        for (const id of emailIds) {
            const res = await api.patch(`/email/delete/${id}`);

            if (!res.data.success) {
                throw new Error(res.data.message);
            }
        }

        setEmails(prevEmails =>
            prevEmails.map(email =>
                emailIds.some(
                    id => String(id) === String(email.id)
                )
                    ? {
                        ...email,
                        is_deleted: true,
                        folder: "Trash"
                    }
                    : email
            )
        );

        setSelectedEmails([]);

        toast.success("Email moved to Trash");

    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
};
    const restoreEmail = async (ids) => {
    const emailIds = Array.isArray(ids) ? ids : [ids];

    try {
        await Promise.all(
            emailIds.map(id =>
                api.patch(`/email/restore/${id}`)
            )
        );

        setEmails(prev =>
            prev.map(email =>
                emailIds.some(id => String(id) === String(email.id))
                    ? {
                        ...email,
                        is_deleted: false,
                        folder: "Inbox"
                    }
                    : email
            )
        );

        setSelectedEmails([]);
        setChecked(false);
        setRefreshTrigger(prev => prev + 1);

        toast.success("Email restored successfully");
    } catch (error) {
        toast.error(error.response?.data?.message || error.message);
    }
};

    return (
        <EmailContext.Provider
            value={{
                emails,
                setEmails,
                refreshTrigger,
                trashMail,
                restoreEmail,
                formatEmailDate,
                getSenderName,
                readMail,
                getMail,
                starredMail,
                handleEmailClick,
                handleSelectAll,
                selectedEmails,
                setSelectedEmails,
                checked,
                setChecked,
                handleSelectEmail,
            }}
        >
            {children}
        </EmailContext.Provider>
    );
};

export const useEmail = () => {
    const context = useContext(EmailContext);
    if (!context) {
        throw new Error("useEmail must be used within EmailProvider");
    }
    return context;
};