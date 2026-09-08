import { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';

export const useNewEmail = () => {
    const { socket, isConnected } = useSocket();
    const [newEmails, setNewEmails] = useState([]);

    useEffect(() => {
       

        if (!socket) {
            return;
        }

        if (!isConnected) {
            return;
        }


        const handleNewEmail = (emailData) => {
                console.log("🔥 SOCKET EMAIL:", emailData);

            // ✅ IMPORTANT: Make sure the email has an ID
            if (!emailData.id) {
                console.warn('⚠️ Email received without ID:', emailData);
                // Generate a temporary ID if needed
                emailData.id = Date.now();
            }

            // ✅ Update newEmails state
            setNewEmails(prev => {
                
                // Check for duplicates
                const exists = prev.some(email => email.id === emailData.id);
                if (exists) {
                    return prev;
                }
                
                const newState = [emailData, ...prev];
                return newState;
            });

            // ✅ Also dispatch a custom event for debugging

            // Get sender name
           

            // Show toast notification
            toast.info(
                <div className="p-2">
                    <strong className="text-blue-600">📧 New email from {emailData.sender}</strong>
                    <p className="text-sm text-gray-600 mt-1">{emailData.subject || '(No subject)'}</p>
                    <p className="text-xs text-gray-400 mt-1">
                        {emailData.attachments?.length > 0 && `📎 ${emailData.attachments.length} attachment(s)`}
                    </p>
                </div>,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );

            // Browser notification
            if (Notification.permission === 'granted') {
                new Notification(`📧 New email from ${senderName}`, {
                    body: emailData.subject || 'New email received',
                    icon: '/favicon.ico'
                });
            }
        };

        // ✅ Attach the listener
        socket.on('new_email', handleNewEmail);

        // ✅ Clean up
        return () => {
            socket.off('new_email', handleNewEmail);
        };
    }, [socket, isConnected]);

    return { newEmails, setNewEmails };
};